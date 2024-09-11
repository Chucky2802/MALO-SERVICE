import express from 'express';
import con from '../utils/db.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + " " + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/AddCustomer', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO Customers (Name, Email, Phone_Number, Address, Daily_Visits, Services_Utilized, Image) VALUES (?)`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
    req.body.visits,
    req.body.services,
    req.file ? req.file.filename : null
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Customer Added Successfully!" });
  });
});

router.get('/customer', (req, res) => {
  const sql = "SELECT * FROM Customers";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/customer/:Id', (req, res) => {
  const Id = req.params.Id;
  const sql = "SELECT * FROM Customers WHERE Id = ?";
  
  con.query(sql, [Id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/EditCustomer/:Id', (req, res) => {
  const Id = req.params.Id;
  const sql = `UPDATE Customers SET Name = ?, Email = ?, Phone_Number = ?, Address = ?, Daily_Visits = ?, Services_Utilized = ? WHERE Id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
    req.body.visits,
    req.body.services
  ];

  con.query(sql, [...values, Id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/DeleteCustomer/:Id', (req, res) => {
  const Id = req.params.Id;
  const sql = "DELETE FROM Customers WHERE Id = ?";
  con.query(sql, [Id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

export { router as customerRouter };
