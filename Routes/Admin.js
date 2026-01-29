// Routes/Admin.js
import { Router } from 'express';
import { query } from '../utils/db.js';
import { generateToken } from '../utils/jwtToken.js';

export const adminRouter = Router();

// login
adminRouter.post('/adminlogin', async (req, res) => {
  try {
    const sql = 'SELECT * FROM admin WHERE email = $1 AND password = $2';
    const { rows } = await query(sql, [req.body.email, req.body.password]);
    if (rows.length > 0) {
      const token = generateToken(rows[0].email);
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      return res.json({ loginStatus: true });
    }
    return res.json({ loginStatus: false, Error: 'Wrong email or password' });
  } catch (err) {
    console.error(err);
    return res.json({ loginStatus: false, Error: 'Query error' });
  }
});

// logout
adminRouter.get('/logout', (_req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

// quick health
adminRouter.get('/health', async (_req, res) => {
  try {
    const { rows } = await query('select now() as now');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
