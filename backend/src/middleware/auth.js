// Authentication and authorization middleware.
// Verifies JWT tokens and checks user roles/status before allowing access.

const jwt = require('jsonwebtoken');
const prisma = require('../db');

// Verifies the JWT Bearer token from the Authorization header.
// On success, attaches the full user object to req.user for downstream handlers.
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Ensures the authenticated user has been approved by an admin.
// Used to gate community creation — only approved users can add listings.
function requireApproved(req, res, next) {
  if (req.user.status !== 'APPROVED') {
    return res.status(403).json({ error: 'Account pending approval' });
  }
  next();
}

// Restricts access to admin-only endpoints (e.g. user management).
function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

module.exports = { authenticate, requireApproved, requireAdmin };
