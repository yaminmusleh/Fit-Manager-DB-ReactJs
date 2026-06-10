require('dotenv').config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

//MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

//test DB connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ message: 'Connected to database successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//get all members:
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// post new member:
app.post('/api/members', async (req, res) => {
  try {
    const { member_id, first_name, last_name, gender, age, phone_number, email, registration_date } = req.body;

    await pool.query(
      `INSERT INTO members 
      (member_id, first_name, last_name, gender, age, phone_number, email, registration_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [member_id, first_name, last_name, gender, age, phone_number, email, registration_date]
    );

    res.json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete member:
app.delete('/api/members/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM members WHERE member_id = ?', [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update member:
app.put('/api/members/:id', async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    await pool.query(
      'UPDATE members SET first_name=?, last_name=? WHERE member_id=?',
      [first_name, last_name, req.params.id]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//memberships api:
app.get('/api/memberships', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM memberships');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//sessions api:
app.get('/api/sessions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM training_sessions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//maintenance api:
app.get('/api/maintenance', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipment_maintenance');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//trainers api:
app.get('/api/trainers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trainers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//equipment api:
app.get('/api/equipment', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipment');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//lockers api:
app.get('/api/lockers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gym_lockers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

