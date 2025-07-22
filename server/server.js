import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const app = express();
app.use(cors());
app.use(express.json());

// GET /cars
app.get('/cars', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM cars ORDER BY id');
  res.json(rows);
});

// POST /booking
app.post('/booking', async (req, res) => {
  const { carId, rentalDays, extraHours, totalPrice } = req.body;
  await pool.query(
    'INSERT INTO bookings (car_id, rental_days, extra_hours, total_price) VALUES (?,?,?,?)',
    [carId, rentalDays, extraHours, totalPrice]
  );
  res.json({ message: 'Pemesanan berhasil!' });
});

app.listen(process.env.PORT, () => console.log('API on :3001'));