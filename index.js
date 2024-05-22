const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Mock database
const users = [
{
    "username" : "test",
    "password" : "test"
}
];

// JWT Secret
const SECRET_KEY = process.env.JWT_SECRET_KEY;


// Root endpoint to display service status with current date and time
app.get('/', (req, res) => {
    const currentDateTime = new Date().toLocaleString();
    res.send(`Auth Microservice is up and running as of ${currentDateTime}`);
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const user = users.find(user => user.username === username);
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});