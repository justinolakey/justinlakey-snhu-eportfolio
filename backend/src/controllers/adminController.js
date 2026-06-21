// Controller for admin-only user management operations.
// All routes using these handlers require authentication + admin role.

const prisma = require('../db');

// GET /api/admin/users — Lists all registered users with their status.
// Returns a summary of each user (no passwords) sorted by newest first.
async function getUsers(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: users });
}

// PATCH /api/admin/users/:id/status — Updates a user's approval status.
// Accepts PENDING, APPROVED, or REJECTED. Only approved users can add communities.
async function updateUserStatus(req, res) {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, email: true, role: true, status: true },
  });

  res.json({ data: user });
}

module.exports = { getUsers, updateUserStatus };
