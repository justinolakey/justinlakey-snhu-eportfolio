// Controller for user authentication (registration and login).

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

// POST /api/user/register — Creates a new user account.
// Hashes the password with bcrypt and stores the user with PENDING status.
// An admin must approve the account before the user can add communities.
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Validate email format and length
    if (typeof email !== "string" || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Enforce password length constraints
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
        return res.status(400).json({ error: "Password exceeds maximum length" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashed } });

    res.status(201).json({ message: "Registration successful. Your account is pending admin approval." });
}

// POST /api/user/login — Authenticates a user and returns a JWT token.
// The token is valid for 7 days and includes the user's ID as the payload.
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Basic type checks to prevent unexpected input types
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
}

module.exports = { register, login };
