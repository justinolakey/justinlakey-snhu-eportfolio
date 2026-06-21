// Express application entry point.
// Configures middleware, mounts API routes, and starts the HTTP server.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Route modules
const communityRoutes = require("./routes/communities");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors());             // Allow cross-origin requests from the frontend
app.use(express.json());     // Parse JSON request bodies

// API route handlers
app.use("/api/communities", communityRoutes); // Public community browsing + authenticated creation
app.use("/api/user", userRoutes);             // User registration and login
app.use("/api/admin", adminRoutes);           // Admin-only user management

// Simple health check endpoint for monitoring
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

// Global error handler — catches unhandled errors from route handlers
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
