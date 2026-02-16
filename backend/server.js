require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }      
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

// Add lead
app.post("/add-lead", (req, res) => {
  const { name, email, phone, message } = req.body;

  const sql =
    "INSERT INTO leads (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: "Lead added successfully ✅" });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/leads", (req, res) => {
  const sql = "SELECT * FROM leads";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching leads");
    } else {
      res.json(result);
    }
  });
});

app.put("/update-status/:id", (req, res) => {
  const leadId = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE leads SET status = ? WHERE id = ?";

  db.query(sql, [status, leadId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating status");
    } else {
      res.send("Status updated");
    }
  });
});

app.put("/add-notes/:id", (req, res) => {
  const leadId = req.params.id;
  const { notes } = req.body;

  const sql = "UPDATE leads SET notes = ? WHERE id = ?";

  db.query(sql, [notes, leadId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding notes");
    } else {
      res.send("Notes added");
    }
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