import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", email: email }, process.env.JWT_SECRET_KEY, { expiresIn: "1d"});
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });
  
  router.post('/AddCategory', (req, res) => {
    const sql = "INSERT INTO category (name) VALUES (?)";
    con.query(sql, [req.body.Category], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      return res.json({ Status: true });
    });
  });

export { router as adminRouter };
