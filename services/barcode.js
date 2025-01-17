const bwipjs = require('bwip-js');

const barcode = (shortCode) => {
    return new Promise((resolve, reject) => {
        try {
            // Generate barcode as a PNG image in base64 format
            bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: shortCode,       // Text to encode
                scale: 3,              // Scaling factor
                height: 10,            // Bar height, in millimeters
                includetext: true,     // Include text under barcode
                textxalign: 'center',  // Align text to center
            }, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const barcodeData = buffer.toString('base64'); // Convert buffer to base64
                    resolve(barcodeData); // Return barcode image as base64
                }
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

module.exports = barcode;
