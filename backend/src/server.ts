import express from 'express';
import pool from './config/database';
import jobsRouter from './routes/jobs';
import resumeRouter from './routes/resume';
import authRouter from './routes/auth';
import aiRouter from './routes/ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
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
app.use('/api/resume', resumeRouter); 
app.use('/api/auth', authRouter);
app.use('/ai', aiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//made all the changes to the server.ts file
