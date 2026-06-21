require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// This script creates an admin user based on environment variables for development purposes.
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before running this script.');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin account already exists for ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10); // Hash the password before storing it
  await prisma.user.create({
    data: { email, password: hashed, role: 'ADMIN', status: 'APPROVED' },
  });

  console.log(`Admin account created for ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
