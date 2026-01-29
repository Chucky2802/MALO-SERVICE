// Routes/CategoryRoutes.js
import { Router } from 'express';
import { query } from '../utils/db.js';

export const categoryRouter = Router();

categoryRouter.get('/category', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM category');
    return res.json({ Status: true, Result: rows });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

categoryRouter.post('/AddCategory', async (req, res) => {
  try {
    await query('INSERT INTO category (name) VALUES ($1)', [req.body.Category]);
    return res.json({ Status: true });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query error' });
  }
});

categoryRouter.delete('/DeleteCategory/:id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM category WHERE id = $1', [req.params.id]);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error: ' + err });
  }
});
