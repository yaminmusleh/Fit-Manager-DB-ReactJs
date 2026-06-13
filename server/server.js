require("dotenv").config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

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
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Connected to database successfully!" });
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
app.get("/api/members", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM members");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// post new member:
app.post("/api/members", async (req, res) => {
  try {
    const {
      member_id,
      first_name,
      last_name,
      gender,
      age,
      phone_number,
      email,
      registration_date,
    } = req.body;

    await pool.query(
      `INSERT INTO members 
      (member_id, first_name, last_name, gender, age, phone_number, email, registration_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        member_id,
        first_name,
        last_name,
        gender,
        age,
        phone_number,
        email,
        registration_date,
      ],
    );

    res.json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete member:
app.delete("/api/members/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM members WHERE member_id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update member:
app.put("/api/members/:id", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email } = req.body;
    await pool.query(
      "UPDATE members SET first_name=?, last_name=?, phone_number=?, email=? WHERE member_id=?",
      [first_name, last_name, phone_number, email, req.params.id],
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//memberships api:
app.get("/api/memberships", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM memberships");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//update membership:
app.put('/api/memberships/:id', async (req, res) => {
  try {
    const { status, start_date, end_date } = req.body;
    await pool.query(
      'UPDATE memberships SET status=?, start_date=?, end_date=? WHERE membership_id=?',
      [status, start_date, end_date, req.params.id]
    );
    res.json({ message: "Membership updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//sessions api:
app.get("/api/sessions", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM training_sessions");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//maintenance api:
app.get("/api/maintenance", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM equipment_maintenance");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//trainers api:
app.get("/api/trainers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM trainers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sessions with member names joined
app.get("/api/sessions/detailed", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ts.*, 
             CONCAT(m.first_name, ' ', m.last_name) AS member_name
      FROM training_sessions ts
      JOIN members m ON ts.member_id = m.member_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new session
app.post("/api/sessions", async (req, res) => {
  try {
    const { member_id, trainer_id, session_date, session_time, duration_minutes } = req.body;
    await pool.query(
      `INSERT INTO training_sessions (member_id, trainer_id, session_date, session_time, duration_minutes)
       VALUES (?, ?, ?, ?, ?)`,
      [member_id, trainer_id, session_date, session_time, duration_minutes]
    );
    res.json({ message: "Session added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sessions with member + trainer names joined
app.get("/api/sessions/detailed", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ts.*,
             CONCAT(m.first_name, ' ', m.last_name) AS member_name,
             CONCAT(t.first_name, ' ', t.last_name) AS trainer_name
      FROM training_sessions ts
      JOIN members m ON ts.member_id = m.member_id
      JOIN trainers t ON ts.trainer_id = t.trainer_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//equipment api:
app.get("/api/equipment", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM equipment");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add maintenance record
app.post("/api/maintenance", async (req, res) => {
  try {
    const { equipment_id, maintenance_date, issue_description, technician_name, notes, status } = req.body;
    await pool.query(
      `INSERT INTO equipment_maintenance 
       (equipment_id, maintenance_date, issue_description, technician_name, notes, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [equipment_id, maintenance_date, issue_description, technician_name, notes, status]
    );
    res.json({ message: "Maintenance record added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update maintenance status
app.put("/api/maintenance/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      "UPDATE equipment_maintenance SET status=? WHERE maintenance_id=?",
      [status, req.params.id]
    );
    res.json({ message: "Maintenance updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update equipment condition
app.put("/api/equipment/:id", async (req, res) => {
  try {
    const { condition_status } = req.body;
    await pool.query(
      "UPDATE equipment SET condition_status=? WHERE equipment_id=?",
      [condition_status, req.params.id]
    );
    res.json({ message: "Equipment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign locker to member
app.post("/api/lockers/assign", async (req, res) => {
  try {
    const { locker_id, member_id, usage_date, start_time } = req.body;
    // Update locker status to Occupied
    await pool.query(
      "UPDATE gym_lockers SET status='Occupied' WHERE locker_id=?",
      [locker_id]
    );
    // Add locker usage record
    await pool.query(
      "INSERT INTO locker_usage (locker_id, member_id, usage_date, start_time) VALUES (?, ?, ?, ?)",
      [locker_id, member_id, usage_date, start_time]
    );
    res.json({ message: "Locker assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get locker usage with member names
app.get("/api/lockers/usage", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lu.*, 
             CONCAT(m.first_name, ' ', m.last_name) AS member_name,
             m.member_id
      FROM locker_usage lu
      JOIN members m ON lu.member_id = m.member_id
      ORDER BY lu.usage_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//lockers api:
app.get("/api/lockers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gym_lockers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
