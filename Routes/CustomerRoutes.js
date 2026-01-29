// Routes/CustomerRoutes.js
import { Router } from 'express';
import { query } from '../utils/db.js';
import multer from 'multer';
import path from 'path';

export const customerRouter = Router();

const uploadDir = path.join(process.cwd(), 'Public', 'Images');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, file.fieldname + ' ' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

customerRouter.post('/AddCustomer', upload.single('image'), async (req, res) => {
  try {
    const sql = `INSERT INTO customers
      (name, email, phone_number, address, daily_visits, services_utilized, image)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const vals = [
      req.body.name, req.body.email, req.body.phone, req.body.address,
      req.body.visits, req.body.services, req.file ? req.file.filename : null
    ];
    await query(sql, vals);
    return res.json({ Status: true, Message: 'Customer Added Successfully!' });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

customerRouter.get('/customer', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM customers');
    return res.json({ Status: true, Result: rows });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

customerRouter.get('/customer/:Id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM customers WHERE id = $1', [req.params.Id]);
    return res.json({ Status: true, Result: rows });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

customerRouter.put('/EditCustomer/:Id', async (req, res) => {
  try {
    const sql = `UPDATE customers
      SET name=$1, email=$2, phone_number=$3, address=$4, daily_visits=$5, services_utilized=$6
      WHERE id=$7`;
    const vals = [
      req.body.name, req.body.email, req.body.phone, req.body.address,
      req.body.visits, req.body.services, req.params.Id
    ];
    const { rowCount } = await query(sql, vals);
    return res.json({ Status: true, Result: { rowCount } });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

customerRouter.delete('/DeleteCustomer/:Id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM customers WHERE id = $1', [req.params.Id]);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error: ' + err });
  }
});
