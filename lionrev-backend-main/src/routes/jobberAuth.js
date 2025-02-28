import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();
const router = express.Router();

const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID;
const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET;
const JOBBER_REDIRECT_URI = process.env.JOBBER_REDIRECT_URI;

// Step 1: Redirect to Jobber OAuth login
router.get('/jobber/auth', (req, res) => {
    const authUrl = `https://api.getjobber.com/oauth/authorize?client_id=${JOBBER_CLIENT_ID}&redirect_uri=${encodeURIComponent(JOBBER_REDIRECT_URI)}&response_type=code&scope=read write`;
    res.redirect(authUrl);
});

// Step 2: Handle Jobber OAuth callback & store access token
router.get('/jobber/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
    }

    try {
        const response = await axios.post('https://api.getjobber.com/oauth/token', {
            client_id: JOBBER_CLIENT_ID,
            client_secret: JOBBER_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: JOBBER_REDIRECT_URI,
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Store tokens in DB (overwrite old ones)
        await db.query('DELETE FROM jobber_tokens');  // Remove previous tokens
        await db.query(
            'INSERT INTO jobber_tokens (access_token, refresh_token, expires_in) VALUES ($1, $2, $3)',
            [access_token, refresh_token, expires_in]
        );

        res.json({ success: true, access_token, refresh_token });
    } catch (error) {
        console.error('Jobber Auth Error:', error.response?.data || error.message);
        res.status(500).json({ error: authUrl });
    }
});

export default router;
