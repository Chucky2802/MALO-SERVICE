// Routes/ServiceRoutes.js
import { Router } from 'express';
import { query } from '../utils/db.js';

export const serviceRouter = Router();

serviceRouter.post('/AddService', async (req, res) => {
  try {
    const sql = `INSERT INTO services
      (service_name, description, category, duration, cost, pricing_strategy, usage_frequency, customer_satisfaction)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
    const vals = [
      req.body.serviceName,
      req.body.description,
      req.body.category,
      req.body.duration,
      req.body.cost,
      req.body.pricing,
      req.body.usageFrequency,
      req.body.satisfaction
    ];
    await query(sql, vals);
    return res.json({ Status: true, Message: 'Service Added Successfully!' });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

serviceRouter.get('/services', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM services');
    return res.json({ Status: true, Result: rows });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

serviceRouter.get('/service/:ServiceID', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM services WHERE id = $1', [req.params.ServiceID]);
    return res.json({ Status: true, Result: rows });
  } catch {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

serviceRouter.put('/EditService/:ServiceID', async (req, res) => {
  try {
    const sql = `UPDATE services
      SET service_name=$1, description=$2, category=$3, duration=$4, cost=$5, pricing_strategy=$6, usage_frequency=$7, customer_satisfaction=$8
      WHERE id=$9`;
    const vals = [
      req.body.serviceName,
      req.body.description,
      req.body.category,
      req.body.duration,
      req.body.cost,
      req.body.pricing,
      req.body.usageFrequency,
      req.body.satisfaction,
      req.params.ServiceID
    ];
    const { rowCount } = await query(sql, vals);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

serviceRouter.delete('/DeleteService/:ServiceID', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM services WHERE id = $1', [req.params.ServiceID]);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    return res.json({ Status: false, Error: 'Query Error: ' + err });
  }
});
