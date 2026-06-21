// Controller for community CRUD operations.
// Handles listing with filters, fetching by ID, and creating new communities.

const prisma = require("../db");

const VALID_STATUSES = ["AVAILABLE", "SOLD_OUT", "COMING_SOON"];
const MAX_TEXT_LENGTH = 2000;
const MAX_SHORT_TEXT = 200;

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
            orderBy: { name: "asc" },
        });

        res.json({ data: communities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
}

// GET /api/communities/:id — Returns a single community by its ID.
async function getCommunityById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid community ID" });
        }

        const community = await prisma.community.findUnique({ where: { id } });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.json({ data: community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch community" });
    }
}

// POST /api/communities — Creates a new community (requires authentication + approval).
// Validates all required fields, numeric ranges, coordinates, and status.
async function createCommunity(req, res) {
    const {
        name, builder, description, address, city, state, zipCode,
        latitude, longitude, website,
        priceMin, priceMax, sqftMin, sqftMax,
        lotSizeSqftMin, lotSizeSqftMax,
        bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax,
        status,
    } = req.body;

    // Check that all required fields are present and non-empty
    const required = {
        name, builder, address, city, state, zipCode, latitude, longitude,
        priceMin, priceMax, sqftMin, sqftMax, lotSizeSqftMin, lotSizeSqftMax,
        bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax,
    };
    if (Object.values(required).some((v) => v === undefined || v === null || v === "")) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Enforce text length limits
    if (name.length > MAX_SHORT_TEXT || builder.length > MAX_SHORT_TEXT ||
        address.length > MAX_SHORT_TEXT || city.length > MAX_SHORT_TEXT ||
        state.length > 2 || zipCode.length > 10) {
        return res.status(400).json({ error: "One or more text fields exceed maximum length" });
    }
    if (description && description.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({ error: "Description exceeds maximum length" });
    }
    if (website && website.length > MAX_SHORT_TEXT) {
        return res.status(400).json({ error: "Website URL exceeds maximum length" });
    }

    // Parse and validate numeric fields
    const parsed = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
    };
    if (Object.values(parsed).some((v) => isNaN(v))) {
        return res.status(400).json({ error: "Numeric fields must be valid numbers" });
    }

    // Validate GPS coordinates
    if (parsed.latitude < -90 || parsed.latitude > 90) {
        return res.status(400).json({ error: "Latitude must be between -90 and 90" });
    }
    if (parsed.longitude < -180 || parsed.longitude > 180) {
        return res.status(400).json({ error: "Longitude must be between -180 and 180" });
    }

    // Validate that all min values are less than or equal to their max
    if (parsed.priceMin > parsed.priceMax) {
        return res.status(400).json({ error: "priceMin must be less than or equal to priceMax" });
    }
    if (parsed.sqftMin > parsed.sqftMax) {
        return res.status(400).json({ error: "sqftMin must be less than or equal to sqftMax" });
    }
    if (parsed.lotSizeSqftMin > parsed.lotSizeSqftMax) {
        return res.status(400).json({ error: "lotSizeSqftMin must be less than or equal to lotSizeSqftMax" });
    }
    if (parsed.bedroomsMin > parsed.bedroomsMax) {
        return res.status(400).json({ error: "bedroomsMin must be less than or equal to bedroomsMax" });
    }
    if (parsed.bathroomsMin > parsed.bathroomsMax) {
        return res.status(400).json({ error: "bathroomsMin must be less than or equal to bathroomsMax" });
    }

    // Validate that numeric values are non-negative
    if (parsed.priceMin < 0 || parsed.sqftMin < 0 || parsed.lotSizeSqftMin < 0 ||
        parsed.bedroomsMin < 0 || parsed.bathroomsMin < 0) {
        return res.status(400).json({ error: "Numeric values must not be negative" });
    }

    // Validate status enum
    const resolvedStatus = status || "AVAILABLE";
    if (!VALID_STATUSES.includes(resolvedStatus)) {
        return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
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
                ...parsed,
                website: website || null,
                status: resolvedStatus,
            },
        });
        res.status(201).json({ data: community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create community" });
    }
}

module.exports = { getCommunities, getCommunityById, createCommunity };
