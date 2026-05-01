
// sol
const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');  // bcrypt
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: 'secure-web-app-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    }
}));

// end sol

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


//sol
// ==============================================
// Access Control - RBAC
// ==============================================

// Check if the user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    next();
}

// Check if the logged-in user has the admin role
function requireAdmin(req, res, next) {
    if (req.session.user.role !== 'admin') {
        return res.status(403).send(`
            <h2>Access Denied</h2>
            <p>You are authenticated, but you are not authorized to access the admin page.</p>
            <a href="/dashboard.html">Back to Dashboard</a>
        `);
    }
    next();
}

// Protected admin page
app.get('/admin.html', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve static files after protecting admin.html
app.use(express.static('.'));

// end sol





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
        
/*sol edit this code
        if (isValid) {
            res.json(row);
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        } //end code for dena

*/
// sol alt code

if (isValid) {
    req.session.user = {
        id: row.id,
        username: row.username,
        role: row.role
    };

    res.json({
        username: row.username,
        role: row.role
    });
} else {
    res.status(401).send({ message: "Invalid credentials" });
}

// end sol


    });
});

// sol

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send({ message: "Logged out successfully" });
    });
});

// end sol

/*tempo sol
Temporary route used only for testing RBAC.
It was used to promote a test account to admin.
This route must be disabled before final submission.

app.get('/make-admin/:username', (req, res) => {
    const username = req.params.username;

    db.run(
        "UPDATE users SET role = 'admin' WHERE username = ?",
        [username],
        function(err) {
            if (err) {
                return res.status(500).send("Error updating user role.");
            }

            if (this.changes === 0) {
                return res.status(404).send("User not found.");
            }

            res.send(`${username} is now an admin.`);
        }
    );
});

end tempo sol*/


app.listen(3000, () => console.log('Server: http://localhost:3000 (Using bcrypt - Secure)'));