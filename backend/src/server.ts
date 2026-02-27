import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import claimRoutes from './routes/claimRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

app.use(express.json());

// Routes
app.use('/api/claims', claimRoutes);

app.get('/', (req, res) => {
    res.send('Healthcare claim processing backend is running.');
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
