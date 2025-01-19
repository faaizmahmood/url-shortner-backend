const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({

    longURL: { type: String, required: true },
    shortURL: { type: String, required: true, unique: true },
    barcode: { type: String, },
    userId: { type: String },
    clicks: { type: Number, default: 0 },
    description: { type: String },
    analytics: [
        {
            timestamp: { type: String },
            referringPage: { type: String },
            deviceType: { type: String },
            browser: { type: String },
            os: { type: String },
            location: { type: String },
        }
    ],

}, { timestamps: true })

const URLModel = mongoose.model('URLs', urlSchema)


module.exports = URLModel