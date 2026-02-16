const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sumera@4",
  database: "mini_crm"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed ❌");
    return;
  }
  console.log("MySQL Connected ✅");
});

module.exports = db;