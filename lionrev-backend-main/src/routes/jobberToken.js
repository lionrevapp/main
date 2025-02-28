import axios from 'axios';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID;
const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET;

export async function getJobberAccessToken() {
    const tokenData = await db.query('SELECT * FROM jobber_tokens LIMIT 1');
    
    if (tokenData.rowCount === 0) {
        throw new Error('No Jobber access token found. Authenticate first.');
    }

    let { access_token, refresh_token, expires_in, created_at } = tokenData.rows[0];

    // Check if token is expired
    const createdAtTime = new Date(created_at).getTime();
    const currentTime = Date.now();
    if (currentTime - createdAtTime > expires_in * 1000) {
        console.log('Access token expired. Refreshing...');

        try {
            const response = await axios.post('https://api.getjobber.com/api/oauth/token', {
                client_id: JOBBER_CLIENT_ID,
                client_secret: JOBBER_CLIENT_SECRET,
                // refresh_token,
                grant_type: 'authorization_code',
                code: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyODU1ODI1LCJhcHBfaWQiOiI5MzhhOTllOS03MmE0LTQzYWItYmM0MC0wMDMwODJjMjk5ZDYiLCJzY29wZXMiOiIiLCJleHAiOjE3MzkwNjIwMzJ9.ZfzG4JrETrHoUybvc-cjDO3rehdYoXhzxyHVjfx30cM',
                redirect_uri: 'https://app.lionrev.com/',


            });

            access_token = response.data.access_token;
            refresh_token = response.data.refresh_token;
            expires_in = response.data.expires_in;

            // Update DB with new tokens
            await db.query(
                'UPDATE jobber_tokens SET access_token = $1, refresh_token = $2, expires_in = $3, created_at = CURRENT_TIMESTAMP',
                [access_token, refresh_token, expires_in]
            );
        } catch (error) {
            console.error('Failed to refresh Jobber token:', error.response?.data || error.message);
            throw new Error('Failed to refresh Jobber token ' +  error.message + ' ' + JOBBER_CLIENT_ID + ' ' + JOBBER_CLIENT_SECRET );
        }
    }

    return access_token;
}
