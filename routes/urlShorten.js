const express = require('express');
const URLModel = require('../models/urls');
const jwt = require('jsonwebtoken');
const barcode = require('../services/barcode');
const s3Upload = require('../services/s3Upload');

const router = express.Router();
const secretKey = process.env.SECRETEJWTKEY;

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        req.user = null; // No user is authenticated
        return next();
    }

    try {
        const user = jwt.verify(token, secretKey);
        req.user = user; // Attach user info to the request
        next();
    } catch (err) {
        console.error('Invalid or expired JWT:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Function to generate a unique string
function generateUniqueString() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return (timestamp + randomPart).toString(36).slice(-5);
}

// POST route to shorten URL
router.post('/url-shorten', authenticateJWT, async (req, res) => {
    const { URL } = req.body;
    const user = req.user;

    if (!URL) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const existingURL = await URLModel.findOne({ longURL: URL, userId: user.id });
        if (existingURL) {
            return res.status(409).json({
                shortURL: existingURL.shortURL,
                message: 'URL already shortened',
            });
        }

        const shortCode = generateUniqueString();
        let barcodeS3URL = null;

        // Generate and upload barcode only for authenticated users
        if (user) {
            const barcodeData = await barcode(`http://localhost:5173/u/${shortCode}`);
            // barcodeS3URL = await s3Upload(barcodeData);
        }

        // const barcodeData = await barcode(`http://localhost:5173/u/${shortCode}`);
        // barcodeS3URL = await s3Upload(barcodeData);

        const newURL = new URLModel({
            longURL: URL,
            shortURL: shortCode,
            barcodeURL: barcodeS3URL, // Save barcode URL only if available
            userId: user.id, // Save barcode URL only if available
            clicks: 0,
        });

        await newURL.save();

        res.status(201).json({
            shortURL: shortCode,
            barcodeURL: barcodeS3URL,
            message: 'URL successfully shortened',
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
        });
    }
});

module.exports = router;
