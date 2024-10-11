const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'Pertemuan5',
    port: 3307
});

connection.connect((err) => {
    if (err) {
        console.error("Error Connecting to MYSQL", err.stack);
        return;
    }
    console.log("Connection MySQL Done with id " + connection.threadId);
});

app.set('view engine', 'ejs');

// Menampilkan data users
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }
        res.render('index', { users: results });
    });
});

// Menambah data pengguna
app.post('/add', (req, res) => {
    const { name, email, phone } = req.body;
    const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    connection.query(query, [name, email, phone], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send("Error inserting user");
        }
        res.redirect('/');
    });
});

// Mengedit pengguna
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('edit', { user: results[0] });
    });
});

// Memperbarui data pengguna
app.post('/update/:id', (req, res) => {
    const { name, email, phone } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query, [name, email, phone, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Menghapus pengguna
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});
