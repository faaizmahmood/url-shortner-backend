const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const URLModel = require('../models/urls');

router.put('/url-update', authMiddleware, async (req, res) => {

    const { id, shortURL, longURL, description } = req.body

    try {

        const existingURL = await URLModel.findOne({ shortURL });

        // If the shortURL exists and it's not the same document as the one being updated
        if (existingURL && existingURL._id.toString() !== id) {
            return res.status(201).json({ message: 'The short URL is already in use. Please choose a different one.' });
        }

        // Find the document by slug and update the fields using DB field names
        const updatedURL = await URLModel.findByIdAndUpdate(
            id, // matching the DB field shortURL to the code variable slug
            {
                shortURL: shortURL,
                longURL: longURL,   // matching the DB field longURL to the code variable destinationURL
                description: description // matching the DB field description to the code variable urlDescription
            },
            { new: true } // to return the updated document
        );

        // If no document was found
        if (!updatedURL) {
            return res.status(404).json({ message: 'URL not found' });
        }

        // Return the updated document
        res.status(200).json(updatedURL);

    } catch (error) {
        console.error('Error Updating RL:', error);
        res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
        });
    }

})


module.exports = router;