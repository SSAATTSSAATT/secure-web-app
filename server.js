const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('.')); // Serves your HTML/CSS files

// Initialize the Database
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // We create the table with columns for current and future project steps
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,        -- Initially stored insecurely
        role TEXT DEFAULT 'user', -- For the Access Control requirement
        bio TEXT              -- For the XSS requirement[cite: 1]
    )`);
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // VULNERABLE SQL: Required for Part 2
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, row) => {
        if (row) {
            res.json(row);
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    });
});
// Registration Route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // This is the vulnerable SQL query required for Phase 2 of your project
    const sql = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
    
    db.run(sql, (err) => {
        if (err) {
            // Usually triggers if the username already exists
            return res.status(400).send({ message: "Error: User might already exist." });
        }
        res.send({ message: "User registered successfully!" });
    });
});
app.listen(3000, () => console.log('Server: http://localhost:3000'));