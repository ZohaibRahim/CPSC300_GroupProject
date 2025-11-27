import express from 'express';
import pool from './config/database';
const app = express();
const PORT = 3000;


app.use(express.json());

// Database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err);
    } else {
        console.log('Database connected at', res.rows[0].now);
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

