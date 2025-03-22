import express from 'express';
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: "User API is working!" });
});

// Example user registration route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    // TODO: Add user registration logic here (hash password, save to DB)
    res.json({ message: "User registered successfully!" });
});

export default router;

