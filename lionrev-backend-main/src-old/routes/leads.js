import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all leads
router.get('/', async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await db.query(
      'SELECT * FROM facebook_leads ORDER BY create_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get lead by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM facebook_leads WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;