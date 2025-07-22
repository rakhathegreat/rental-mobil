/**
 * @file server.ts
 * @description API backend untuk layanan rental mobil. 
 * Menyediakan endpoint untuk mengambil data mobil dan menyimpan pemesanan.
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

dotenv.config();

/**
 * @constant pool
 * @description Pool koneksi ke database MySQL menggunakan konfigurasi dari file `.env`.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // Host database
  user: process.env.DB_USER,      // Username database
  password: process.env.DB_PASS,  // Password database
  database: process.env.DB_NAME,  // Nama database
  waitForConnections: true,
  connectionLimit: 10             // Batas maksimal koneksi dalam pool
});

/**
 * @constant app
 * @description Inisialisasi aplikasi Express dan middleware CORS serta JSON parser.
 */
const app = express();
app.use(cors());          // Mengizinkan permintaan lintas origin (CORS)
app.use(express.json());  // Middleware untuk parsing JSON dari body request

/**
 * @route GET /cars
 * @description Mengambil seluruh data mobil dari tabel `cars`, diurutkan berdasarkan ID.
 * @returns {JSON[]} Array objek mobil
 */
app.get('/cars', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM cars ORDER BY id');
  res.json(rows);
});

/**
 * @route POST /booking
 * @description Menyimpan data pemesanan mobil ke dalam tabel `bookings`.
 *
 * @param {number} carId - ID mobil yang dipesan
 * @param {number} rentalDays - Lama sewa (dalam hari)
 * @param {number} extraHours - Tambahan jam sewa (di luar hari penuh)
 * @param {number} totalPrice - Total harga yang harus dibayar
 *
 * @returns {Object} Pesan sukses sebagai JSON
 */
app.post('/booking', async (req, res) => {
  const { carId, rentalDays, extraHours, totalPrice } = req.body;
  await pool.query(
    'INSERT INTO bookings (car_id, rental_days, extra_hours, total_price) VALUES (?,?,?,?)',
    [carId, rentalDays, extraHours, totalPrice]
  );
  res.json({ message: 'Pemesanan berhasil!' });
});

/**
 * @function listen
 * @description Menjalankan server pada port yang ditentukan dalam file `.env`.
 */
app.listen(process.env.PORT, () => console.log('API on :3001'));
