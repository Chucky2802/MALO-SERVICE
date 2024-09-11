import express from 'express';
import con from '../utils/db.js';

const router = express.Router();

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

router.delete('/DeleteCategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM category WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

export { router as categoryRouter };
