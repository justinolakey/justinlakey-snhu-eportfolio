// Singleton Prisma client instance shared across all controllers and middleware.
// Avoids creating multiple database connection pools.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
