const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');  // bcrypt
const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.sqlite');
const SALT_ROUNDS = 10;  

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        bio TEXT
    )`);
});

//this code for dena

// ==============================================
// use MD5 
// ==============================================
/*

function hashMD5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

// 
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hashMD5(password);

    const sql = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`;
    
    db.run(sql, (err) => {
        if (err) {
            return res.status(400).send({ message: "Error: User might already exist." });
        }
        res.send({ message: "User registered successfully with MD5!" });
    });
});

// 
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hashMD5(password);
    
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashedPassword}'`;
    
    db.get(query, (err, row) => {
        if (row) {
            res.json(row);
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    });
});
*/



// ==============================================
// use bcrypt 
// ==============================================


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        const sql = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`;
        
        db.run(sql, (err) => {
            if (err) {
                return res.status(400).send({ message: "Error: User might already exist." });
            }
            res.send({ message: "User registered successfully with bcrypt!" });
        });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    
    db.get(query, async (err, row) => {
        if (!row) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        
        
        const isValid = await bcrypt.compare(password, row.password);
        
        if (isValid) {
            res.json(row);
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        } //end code for dena
    });
});

app.listen(3000, () => console.log('Server: http://localhost:3000 (Using bcrypt - Secure)'));