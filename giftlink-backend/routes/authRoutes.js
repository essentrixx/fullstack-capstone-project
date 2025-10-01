const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
require('dotenv').config(); // Make sure .env has JWT_SECRET

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Connect to DB
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        // Generate JWT
        const token = jwt.sign(
            { userId: result.insertedId, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            authtoken: token,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            authtoken: token,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to verify JWT
const fetchUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // userId and email
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get User Profile
router.get('/profile', fetchUser, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: require('mongodb').ObjectId(req.user.userId) }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update User Profile
router.put('/profile', fetchUser, async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.findOneAndUpdate(
            { _id: require('mongodb').ObjectId(req.user.userId) },
            { $set: { firstName, lastName } },
            { returnDocument: 'after', projection: { password: 0 } }
        );

        res.json(result.value);

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
