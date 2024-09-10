const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies with a larger size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Directory to store uploaded files
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});

// In-memory storage for table state
let tableState = '';

// Route to save table state
app.post('/saveTableState', (req, res) => {
    tableState = req.body.tableHTML;
    res.status(200).send('Table state saved');
});

// Route to load table state
app.get('/loadTableState', (req, res) => {
    res.status(200).json({ tableHTML: tableState });
});

// Route to handle CSV uploads
app.post('/uploadCSV', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Process each row from the CSV file
            console.log('Parsed row:', row);
            results.push(row);
        })
        .on('end', () => {
            // Process all rows after reading
            console.log('CSV file successfully processed.');
            fs.unlinkSync(filePath); // Clean up file after processing
            res.status(200).json({ message: 'CSV file processed successfully.', data: results });
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).json({ error: 'Failed to process CSV file.' });
        });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
