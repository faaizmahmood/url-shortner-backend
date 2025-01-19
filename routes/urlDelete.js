const express = require('express')
const router = express.Router()

const mongoose = require('mongoose');

const URLModel = require('../models/urls');

router.delete('/url-delete/:shortURL', async (req, res) => {

    const { shortURL } = req.params


    try {



        const response = await URLModel.findOneAndDelete({ shortURL: shortURL })

        if (!response) {
            return res.status(404).json({
                message: 'URL not found. Please provide a valid ID.',
            });
        }

        res.status(200).json({
            message: 'URL successfully deleted.',
            deletedURL: response,
        });


    } catch (error) {
        console.error('Error fetching URL:', error);

        // Return a 500 response for unexpected server errors
        res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
        });
    }

})


module.exports = router