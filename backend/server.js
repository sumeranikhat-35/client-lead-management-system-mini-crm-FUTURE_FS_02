require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection error ❌", err);
  } else {
    console.log("MySQL connected ✅");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Mini CRM backend running 🚀");
});

app.get("/fix-table", (req, res) => {
  const sql = `
    ALTER TABLE leads 
    MODIFY id INT PRIMARY KEY AUTO_INCREMENT;
  `;
  
  db.query(sql, (err) => {
    if (err) {
      console.log("FIX ERROR:", err);
      return res.status(500).send(err.message);
    }
    res.send("Table fixed successfully ✅");
  });
});

// Add lead
app.post("/add-lead", (req, res) => {
  const { name, email, phone, message } = req.body;

  const sql =
    "INSERT INTO leads (name, email, phone, message, status) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message, "New"], (err) => {
    if (err) {
      console.log("INSERT ERROR:", err);
      return res.status(500).json({error : err.message});
    }
    res.json({ message: "Lead added successfully ✅" });
  });
});

// Get all leads (SHOW REAL ERROR NOW)
app.get("/leads", (req, res) => {
  const sql = "SELECT * FROM leads";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).send(err.message);
    }
    res.json(result);
  });
});

app.put("/update-status/:id", (req, res) => {
  const leadId = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE leads SET status = ? WHERE id = ?";

  db.query(sql, [status, leadId], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send("Status updated");
  });
});

app.put("/add-notes/:id", (req, res) => {
  const leadId = req.params.id;
  const { notes } = req.body;

  const sql = "UPDATE leads SET notes = ? WHERE id = ?";

  db.query(sql, [notes, leadId], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send("Notes added");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

