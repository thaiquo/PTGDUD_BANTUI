import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import handler from './api/data.js';

dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/db.json', handler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy ở cổng ${PORT}`);
});
