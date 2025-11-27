import express from 'express';
import pool from './config/database';
import jobsRouter from './routes/jobs';
import resumesRouter from './routes/resumes';
import authRouter from './routes/auth';

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

app.use('/api/jobs', jobsRouter);
app.use('/api/resumes', resumesRouter); 
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

