import express from 'express';
import con from '../utils/db.js';
import bcrypt from 'bcrypt';
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

router.post('/AddEmployee', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO Employees (Name, Email, Password, Salary, Category, EmployeeType, HoursWorked, 
                TasksPerformed, PerformanceRating, Address, ImagePath) VALUES (?)`;

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    const values = [
      req.body.name, req.body.email, hash, req.body.salary, req.body.category,
      req.body.employee_type, req.body.hours_worked, req.body.tasks_performed,
      req.body.performance, req.body.address, req.file.filename
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Message: "Employee Added Successfully!" });
    });
  });
});

router.get('/employee', (req, res) => {
  const sql = "SELECT * FROM Employees";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee/:EmployeeID', (req, res) => {
  const EmployeeID = req.params.EmployeeID;
  const sql = "SELECT * FROM Employees WHERE EmployeeID = ?";
  con.query(sql, [EmployeeID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/EditEmployee/:EmployeeID', (req, res) => {
  const EmployeeID = req.params.EmployeeID;
  const sql = `UPDATE employees SET Name = ?, Email = ?, Salary = ?, Address = ?, Category = ? WHERE EmployeeID = ?`;
  const values = [req.body.name, req.body.email, req.body.salary, req.body.address, req.body.category];
  con.query(sql, [...values, EmployeeID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/DeleteEmployee/:EmployeeID', (req, res) => {
  const EmployeeID = req.params.EmployeeID;
  const sql = "DELETE FROM employees WHERE EmployeeID = ?";
  con.query(sql, [EmployeeID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

export { router as employeeRouter };
