// Routes/EmployeeRoutes.js
import { Router } from 'express';
import { query } from '../utils/db.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const employeeRouter = Router();

// Ensure upload dir exists
const uploadDir = path.join(process.cwd(), 'Public', 'Images');
fs.mkdirSync(uploadDir, { recursive: true });

// Safer file names (no spaces)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

/**
 * POST /auth/AddEmployee
 * body fields:
 *  name, email, password, salary, category, employee_type, hours_worked,
 *  tasks_performed, performance, address, image (file)
 */
employeeRouter.post('/AddEmployee', upload.single('image'), async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const sql = `
      INSERT INTO employees
        (name, email, password, salary, category, employeetype, hoursworked,
         tasksperformed, performancerating, address, imagepath)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING employeeid
    `;
    const vals = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.category,
      req.body.employee_type,
      req.body.hours_worked,
      req.body.tasks_performed,
      req.body.performance,
      req.body.address,
      req.file ? req.file.filename : null
    ];

    const { rows } = await query(sql, vals);
    return res.json({ Status: true, Message: 'Employee Added Successfully!', Result: rows[0] });
  } catch (err) {
    console.error('AddEmployee error:', err);
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

/** GET /auth/employee */
employeeRouter.get('/employee', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM employees ORDER BY employeeid DESC');
    return res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error('List employees error:', err);
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

/** GET /auth/employee/:EmployeeID */
employeeRouter.get('/employee/:EmployeeID', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM employees WHERE employeeid = $1', [req.params.EmployeeID]);
    return res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error('Get employee error:', err);
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

/** PUT /auth/EditEmployee/:EmployeeID  (no password update here) */
employeeRouter.put('/EditEmployee/:EmployeeID', async (req, res) => {
  try {
    const sql = `
      UPDATE employees
      SET name=$1, email=$2, salary=$3, address=$4, category=$5
      WHERE employeeid=$6
    `;
    const vals = [
      req.body.name,
      req.body.email,
      req.body.salary,
      req.body.address,
      req.body.category,
      req.params.EmployeeID
    ];
    const { rowCount } = await query(sql, vals);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    console.error('Edit employee error:', err);
    return res.json({ Status: false, Error: 'Query Error' });
  }
});

/** DELETE /auth/DeleteEmployee/:EmployeeID */
employeeRouter.delete('/DeleteEmployee/:EmployeeID', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM employees WHERE employeeid = $1', [req.params.EmployeeID]);
    return res.json({ Status: true, Result: { rowCount } });
  } catch (err) {
    console.error('Delete employee error:', err);
    return res.json({ Status: false, Error: 'Query Error' });
  }
});
