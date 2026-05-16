const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getHomes(req, res) {
  try {
    const { communityId, priceMin, priceMax, sqftMin, sqftMax, lotSizeMin, lotSizeMax, bedrooms, bathrooms } = req.query;
    const where = {};

    if (communityId) where.communityId = parseInt(communityId);
    if (priceMin) where.priceMin = { ...where.priceMin, gte: parseInt(priceMin) };
    if (priceMax) where.priceMin = { ...where.priceMin, lte: parseInt(priceMax) };
    if (sqftMin) where.sqft = { ...where.sqft, gte: parseInt(sqftMin) };
    if (sqftMax) where.sqft = { ...where.sqft, lte: parseInt(sqftMax) };
    if (lotSizeMin) where.lotSizeSqft = { ...where.lotSizeSqft, gte: parseInt(lotSizeMin) };
    if (lotSizeMax) where.lotSizeSqft = { ...where.lotSizeSqft, lte: parseInt(lotSizeMax) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (bathrooms) where.bathrooms = { gte: parseFloat(bathrooms) };

    const homes = await prisma.home.findMany({
      where,
      include: {
        community: { select: { id: true, name: true, city: true, state: true } },
      },
      orderBy: { priceMin: 'asc' },
    });

    res.json({ data: homes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch homes' });
  }
}

module.exports = { getHomes };
