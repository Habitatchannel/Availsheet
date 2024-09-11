const express = require('express'); 
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if present
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies with a reasonable size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// In-memory storage for table state
let tableState = '';

// GitHub repository details
const GITHUB_TOKEN = process.env.APP_TOKEN; // Use the environment variable
const REPO_OWNER = 'Habitatchannel';
const REPO_NAME = 'Availsheet';
const FILE_PATH = 'data/tableState.json'; // Path in the repo where data will be saved

// Route to save table state
app.post('/saveTableState', async (req, res) => {
    tableState = req.body.tableHTML;

    try {
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const sha = response.data.sha;

        await axios.put(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update table state',
            content: Buffer.from(JSON.stringify({ tableHTML: tableState }, null, 2)).toString('base64'),
            sha: sha
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        res.status(200).send('Table state saved to GitHub');
    } catch (error) {
        console.error('Error saving data to GitHub:', error);
        res.status(500).send('Failed to save table state to GitHub');
    }
});

// Route to load table state
app.get('/loadTableState', (req, res) => {
    res.status(200).json({ tableHTML: tableState });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
