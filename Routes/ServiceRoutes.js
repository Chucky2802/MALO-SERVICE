import express from 'express';
import con from '../utils/db.js';

const router = express.Router();

router.post('/AddService', (req, res) => {
  const sql = `INSERT INTO Services (Service_Name, Description, Category, Duration, Cost, Pricing_Strategy, Usage_Frequency, Customer_Satisfaction) VALUES (?)`;
  const values = [
    req.body.serviceName,
    req.body.description,
    req.body.category,
    req.body.duration,
    req.body.cost,
    req.body.pricing,
    req.body.usageFrequency,
    req.body.satisfaction
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Service Added Successfully!" });
  });
});

router.get('/services', (req, res) => {
  const sql = "SELECT * FROM Services";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/service/:ServiceID', (req, res) => {
  const ServiceID = req.params.ServiceID;
  const sql = "SELECT * FROM Services WHERE Id = ?";
  
  con.query(sql, [ServiceID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/EditService/:ServiceID', (req, res) => {
  const ServiceID = req.params.ServiceID;
  const sql = `UPDATE Services SET Service_Name = ?, Description = ?, Category = ?, Duration = ?, Cost = ?, Pricing_Strategy = ?, Usage_Frequency = ?, Customer_Satisfaction = ? WHERE Id = ?`;
  const values = [
    req.body.serviceName,
    req.body.description,
    req.body.category,
    req.body.duration,
    req.body.cost,
    req.body.pricing,
    req.body.usageFrequency,
    req.body.satisfaction
  ];

  con.query(sql, [...values, ServiceID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/DeleteService/:ServiceID', (req, res) => {
  const ServiceID = req.params.ServiceID;
  const sql = "DELETE FROM Services WHERE Id = ?";
  con.query(sql, [ServiceID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

export { router as serviceRouter };
