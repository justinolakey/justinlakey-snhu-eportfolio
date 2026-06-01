const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getUsers(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: users });
}

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
