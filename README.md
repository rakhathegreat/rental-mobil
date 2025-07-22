# Rental Mobil

Aplikasi rental mobil berbasis **React**, **Express**, dan **MySQL**.

## 🔍 Deskripsi

Aplikasi ini memungkinkan pengguna untuk melihat daftar mobil yang tersedia, melakukan pemesanan mobil, dan melihat rincian harga. Admin dapat mengelola data mobil dan data pemesanan melalui API backend.

## 🧩 Fitur Utama

- Frontend menggunakan React + Tailwind CSS
- Backend menggunakan Express.js
- Manajemen data mobil dan pemesanan
- Perhitungan otomatis harga sewa berdasarkan hari dan jam tambahan
- API berbasis REST untuk komunikasi frontend-backend

## 🗂 Struktur Direktori

```
├── client/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/  # Komponen UI
│       ├── pages/       # Halaman aplikasi
│       └── App.tsx      # Root komponen
├── server/              # Express backend
│   ├── routes/          # Routing API
│   ├── controllers/     # Logic bisnis
│   └── db.js            # Koneksi database
├── .env                 # Konfigurasi environment
└── package.json
```

## 🚀 Instalasi

```bash
# Clone repository
git clone https://github.com/rakhathegreat/rental-mobil.git
cd rental-mobil

# Setup server (backend)
cd server
npm install
cp .env.example .env  # sesuaikan konfigurasi DB
node index.js          # atau gunakan nodemon

# Setup client (frontend)
cd ../client
npm install
npm run dev            # jalankan React
```

Akses aplikasi di `http://localhost:5173` untuk frontend dan `http://localhost:3000` untuk backend.

## 🧪 Testing

Belum tersedia unit test — akan ditambahkan pada rilis berikutnya.

## 📝 Kontribusi

Pull request dan masukan sangat diterima!

## 📄 Lisensi

[https://github.com/rakhathegreat/rental-mobilDistribusi](https://github.com/rakhathegreat/rental-mobilDistribusi) di bawah **MIT License**. Lihat file `LICENSE` untuk detail.

