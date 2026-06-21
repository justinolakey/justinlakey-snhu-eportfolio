// Community API routes.
// GET endpoints are public; POST requires authentication and an approved account.

const express = require("express");
const { getCommunities, getCommunityById, createCommunity } = require("../controllers/communityController");
const { authenticate, requireApproved } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCommunities); // List/filter communities
router.get("/:id", getCommunityById); // Get single community by ID
router.post("/", authenticate, requireApproved, createCommunity); // Create new community

module.exports = router;
