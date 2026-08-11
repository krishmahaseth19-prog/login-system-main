const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check all fields
        if (!name || !email || !password) {
            return res.send("Please fill all fields");
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save User
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/login");

    } catch (error) {
        console.log(error);
        res.send("Server Error");
    }
});
const jwt = require("jsonwebtoken");

// Login User
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found");
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid Password");
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true
        });

        // Redirect to dashboard
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
        res.send("Server Error");
    }
});

module.exports = router;