// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');
const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint to generate QR code
app.post('/generate-qr', async (req, res) => {
  try {
    // Extract data from request
    const { text, width = 200, format = 'svg' } = req.body;

    // Generate QR code based on the specified format
    let qrCodeData;
    if (format === 'svg') {
      qrCodeData = await QRCode.toString(text, { type: 'svg', width });
      res.type('image/svg+xml').send(qrCodeData);
    } else if (format === 'png') {
      qrCodeData = await QRCode.toDataURL(text, { width });
      qrCodeData = Buffer.from(qrCodeData.split(',')[1], 'base64'); // Convert Base64 to Buffer
      res.type('image/png').send(qrCodeData);
    } else {
      return res.status(400).json({ error: 'Unsupported format. Use svg or png.' });
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`QR Code generator API is running at http://localhost:${port}`);
});
