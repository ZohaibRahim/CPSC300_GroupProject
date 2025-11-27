import express from 'express';

const app = express();
const PORT = 3000;


app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

