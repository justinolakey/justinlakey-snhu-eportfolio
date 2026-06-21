// Controller for user authentication (registration and login).

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

// POST /api/user/register — Creates a new user account.
// Hashes the password with bcrypt and stores the user with PENDING status.
// An admin must approve the account before the user can add communities.
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
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
