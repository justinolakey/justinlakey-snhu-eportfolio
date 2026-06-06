const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildHomeFilter(query) {
  const { priceMin, priceMax, sqftMin, sqftMax, lotSizeMin, lotSizeMax, bedrooms, bathrooms } = query;
  const where = {};

  if (priceMin) where.priceMin = { ...where.priceMin, gte: parseInt(priceMin) };
  if (priceMax) where.priceMin = { ...where.priceMin, lte: parseInt(priceMax) };

  if (sqftMin) where.sqft = { ...where.sqft, gte: parseInt(sqftMin) };
  if (sqftMax) where.sqft = { ...where.sqft, lte: parseInt(sqftMax) };

  if (lotSizeMin) where.lotSizeSqft = { ...where.lotSizeSqft, gte: parseInt(lotSizeMin) };
  if (lotSizeMax) where.lotSizeSqft = { ...where.lotSizeSqft, lte: parseInt(lotSizeMax) };

  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
  if (bathrooms) where.bathrooms = { gte: parseFloat(bathrooms) };

  return where;
}

async function getCommunities(req, res) {
  try {
    const homeWhere = buildHomeFilter(req.query);
    const hasHomeFilters = Object.keys(homeWhere).length > 0;
    const { location } = req.query;

    const communities = await prisma.community.findMany({
      where: hasHomeFilters ? { homes: { some: homeWhere } } : undefined,
      include: {
        homes: {
          where: hasHomeFilters ? homeWhere : undefined,
          orderBy: { priceMin: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ data: communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
}

async function getCommunityById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const community = await prisma.community.findUnique({
      where: { id },
      include: { homes: { orderBy: { priceMin: 'asc' } } },
    });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({ data: community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
}

async function createCommunity(req, res) {
  const { name, builder, description, address, city, state, zipCode, latitude, longitude, website } = req.body;

  if (!name || !builder || !address || !city || !state || !zipCode || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const community = await prisma.community.create({
      data: {
        name,
        builder,
        description: description || null,
        address,
        city,
        state,
        zipCode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        website: website || null,
      },
    });
    res.status(201).json({ data: community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create community' });
  }
}

module.exports = { getCommunities, getCommunityById, createCommunity };
