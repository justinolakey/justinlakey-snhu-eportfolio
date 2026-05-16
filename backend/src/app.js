require('dotenv').config();
const express = require('express');
const cors = require('cors');

const communityRoutes = require('./routes/communities');
const homeRoutes = require('./routes/homes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/communities', communityRoutes);
app.use('/api/homes', homeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
