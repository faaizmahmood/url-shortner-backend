const express = require('express');
const router = express.Router();

const { setUser } = require("../services/auth");

const User = require('../models/user');

router.post('/oauth/google', async (req, res) => {
    const { credential } = req.body;

    try {
        // Use fetch instead of axios
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
        const googleUser = await response.json();

        if (!response.ok) {
            return res.status(500).json({ message: "Authentication failed." });
        }

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = new User({
                name: googleUser.name,
                email: googleUser.email,
                provider: "google",
            });

            await user.save();
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        const token = setUser(payload);

        res.status(200).json({
            message: "Login successful",
            user: token,
        });
    } catch (error) {
        res.status(500).json({ message: "Authentication failed." });
    }
});

module.exports = router;
