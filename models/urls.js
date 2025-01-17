const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({

    longURL: { type: String, required: true },
    shortURL: { type: String, required: true },
    barcode: { type: String, },
    userId: { type: String },
    clicks: { type: Number, default: 0 },

}, { timestamps: true })

const URLModel = mongoose.model('URLs', urlSchema)


module.exports = URLModel