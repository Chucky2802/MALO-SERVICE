import express from 'express';
import con from '../utils/db.js';
import { generateToken } from '../utils/jwtToken.js';


const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = generateToken(email);
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };
