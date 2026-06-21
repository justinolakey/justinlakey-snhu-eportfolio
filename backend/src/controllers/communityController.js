// Controller for community CRUD operations.
// Handles listing with filters, fetching by ID, and creating new communities.

const prisma = require('../db');

// Builds a Prisma `where` clause from query string filter parameters.
// Uses range-overlap logic: a community matches a filter range when its
// max value >= the filter's min and its min value <= the filter's max.
// For bedrooms/bathrooms, checks that the community offers at least
// the requested minimum (e.g. "3+ bedrooms" means bedroomsMax >= 3).
function buildCommunityFilter(query) {
  const { priceMin, priceMax, sqftMin, sqftMax, lotSizeMin, lotSizeMax, bedrooms, bathrooms } = query;
  const where = {};

  // Price range overlap
  if (priceMin) where.priceMax = { ...where.priceMax, gte: parseInt(priceMin) };
  if (priceMax) where.priceMin = { ...where.priceMin, lte: parseInt(priceMax) };

  // Square footage range overlap
  if (sqftMin) where.sqftMax = { ...where.sqftMax, gte: parseInt(sqftMin) };
  if (sqftMax) where.sqftMin = { ...where.sqftMin, lte: parseInt(sqftMax) };

  // Lot size range overlap
  if (lotSizeMin) where.lotSizeSqftMax = { ...where.lotSizeSqftMax, gte: parseInt(lotSizeMin) };
  if (lotSizeMax) where.lotSizeSqftMin = { ...where.lotSizeSqftMin, lte: parseInt(lotSizeMax) };

  // Minimum bedroom/bathroom requirements
  if (bedrooms) where.bedroomsMax = { gte: parseInt(bedrooms) };
  if (bathrooms) where.bathroomsMax = { gte: parseFloat(bathrooms) };

  return where;
}

// GET /api/communities — Returns all communities matching the optional filter query params.
async function getCommunities(req, res) {
  try {
    const where = buildCommunityFilter(req.query);

    const communities = await prisma.community.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({ data: communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
}

// GET /api/communities/:id — Returns a single community by its ID.
async function getCommunityById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const community = await prisma.community.findUnique({ where: { id } });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({ data: community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
}

// POST /api/communities — Creates a new community (requires authentication + approval).
// Validates that all required fields are present, then parses numeric values
// from the request body before inserting into the database.
async function createCommunity(req, res) {
  const {
    name, builder, description, address, city, state, zipCode, latitude, longitude, website,
    priceMin, priceMax, sqftMin, sqftMax, lotSizeSqftMin, lotSizeSqftMax,
    bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, status,
  } = req.body;

  // Check that all required fields are present and non-empty
  const required = {
    name, builder, address, city, state, zipCode, latitude, longitude,
    priceMin, priceMax, sqftMin, sqftMax, lotSizeSqftMin, lotSizeSqftMax,
    bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax,
  };
  if (Object.values(required).some((v) => v === undefined || v === null || v === '')) {
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
        priceMin: parseInt(priceMin),
        priceMax: parseInt(priceMax),
        sqftMin: parseInt(sqftMin),
        sqftMax: parseInt(sqftMax),
        lotSizeSqftMin: parseInt(lotSizeSqftMin),
        lotSizeSqftMax: parseInt(lotSizeSqftMax),
        bedroomsMin: parseInt(bedroomsMin),
        bedroomsMax: parseInt(bedroomsMax),
        bathroomsMin: parseFloat(bathroomsMin),
        bathroomsMax: parseFloat(bathroomsMax),
        status: status || 'AVAILABLE',
      },
    });
    res.status(201).json({ data: community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create community' });
  }
}

module.exports = { getCommunities, getCommunityById, createCommunity };
