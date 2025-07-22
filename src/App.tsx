/**
 * @file App.tsx
 * @description Aplikasi frontend pemesanan rental mobil menggunakan React dan TypeScript. 
 * Menyediakan form pemesanan mobil, perhitungan biaya, diskon, dan integrasi API untuk membuat booking.
 */


import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Car, Calculator, Clock, Percent, CreditCard } from 'lucide-react';

/* ---------- TIPE DATA ---------- */

/**
 * Tipe data untuk objek mobil.
 * @typedef {Object} Car
 * @property {number} id - ID unik dari mobil
 * @property {string} name - Nama mobil
 * @property {number} price_per_day - Harga sewa per hari dalam rupiah
 */

interface Car {
  id: number;
  name: string;
  price_per_day: number;
}


/**
 * Tipe data untuk form pemesanan mobil.
 * @typedef {Object} BookingForm
 * @property {number | null} selectedCar - ID mobil yang dipilih
 * @property {number} rentalDays - Lama sewa dalam hari
 * @property {number} extraHours - Jam tambahan di luar hari sewa
 */

interface BookingForm {
  selectedCar: number | null;
  rentalDays: number;
  extraHours: number;
}

/* ---------- HELPERS ---------- */

/**
 * Mengubah angka ke format mata uang Rupiah (IDR).
 * @function
 * @param {number} amount - Jumlah uang dalam angka
 * @returns {string} - Format rupiah dari angka tersebut
 */
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

/**
 * Menghitung persentase diskon berdasarkan lama sewa.
 *
 * Diskon:
 * - ≥10 hari: 25%
 * - 7-9 hari: 20%
 * - 4-6 hari: 10%
 * - <4 hari: 0%
 *
 * @function
 * @param {number} days - Jumlah hari sewa
 * @returns {number} - Persentase diskon
 */

const calculateDiscountPct = (days: number): number =>
  days >= 10 ? 25 : days >= 7 ? 20 : days >= 4 ? 10 : 0;

/* ---------- MAIN COMPONENT ---------- */
/**
 * Komponen utama aplikasi.
 * Mengelola form pemesanan mobil, menampilkan rincian biaya, serta menangani pengiriman data ke server.
 *
 * @component
 * @returns {JSX.Element} - Antarmuka pengguna aplikasi rental mobil
 */
function App() {
  
  const [cars, setCars] = useState<Car[]>([]);
  const [booking, setBooking] = useState<BookingForm>({
    selectedCar: null,
    rentalDays: 1,
    extraHours: 0,
  });

    /**
   * Mengambil daftar mobil dari server saat komponen dimuat.
   * Menggunakan endpoint `GET /cars`.
   */
  useEffect(() => {
    axios
      .get('http://localhost:3001/cars')
      .then((res) => setCars(res.data))
      .catch(console.error);
  }, []);

  /* ---------- PRICE LOGIC ---------- */
  const selectedCarData = cars.find((c) => c.id === booking.selectedCar);

  const discountPct = calculateDiscountPct(booking.rentalDays);
  const subtotal = selectedCarData
    ? selectedCarData.price_per_day * booking.rentalDays
    : 0;
  const extraHoursCost = booking.extraHours * 100_000;
  const discount = subtotal * (discountPct / 100);
  const total = subtotal - discount + extraHoursCost;

  /* ---------- HANDLERS ---------- */
    /**
   * Mengubah nilai input form pemesanan.
   *
   * @function
   * @param {keyof BookingForm} field - Nama field pada BookingForm
   * @param {string | number} value - Nilai baru untuk field tersebut
   */
  const handleInputChange = (field: keyof BookingForm, value: string | number) =>
    setBooking((prev) => ({ ...prev, [field]: value }));

    /**
   * Mengirim data pemesanan ke server.
   * Endpoint: `POST /booking`
   * Jika berhasil, akan menampilkan pesan sukses dan mereset form.
   * Jika gagal, akan menampilkan alert error.
   */
  const handleBooking = async () => {
    if (!selectedCarData) return;
    try {
      const res = await axios.post('http://localhost:3001/booking', {
        carId: selectedCarData.id,
        rentalDays: booking.rentalDays,
        extraHours: booking.extraHours,
        totalPrice: total,
      });
      setBooking({ selectedCar: null, rentalDays: 1, extraHours: 0 });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membooking');
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero */}
        <div className="flex flex-col justify-center items-center space-y-3 my-10">
          <h1 className="text-5xl font-bold text-blue-600">Rental Mobil Waluyo</h1>
          <p>Sewa mobil berkualitas dengan harga terjangkau</p>
        </div>

        {/* Grid Form & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Form Pemesanan</h2>
            </div>

            <div className="space-y-6">
              {/* Mobil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Mobil
                </label>
                <select
                  value={booking.selectedCar ?? ''}
                  onChange={(e) =>
                    handleInputChange('selectedCar', Number(e.target.value))
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih Mobil --</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} - {formatCurrency(car.price_per_day)}/hari
                    </option>
                  ))}
                </select>
              </div>

              {/* Hari */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lama Sewa (hari)
                </label>
                <input
                  type="number"
                  min={1}
                  value={booking.rentalDays}
                  onChange={(e) =>
                    handleInputChange('rentalDays', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Extra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Hour (jam tambahan)
                </label>
                <input
                  type="number"
                  min={0}
                  value={booking.extraHours}
                  onChange={(e) =>
                    handleInputChange('extraHours', parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Rp100.000 per jam</p>
              </div>

              {/* Diskon info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Percent className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Paket Diskon</h3>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 4-6 hari: 10%</li>
                  <li>• 7-9 hari: 20%</li>
                  <li>• 10+ hari: 25%</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Rincian Biaya */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Rincian Biaya</h2>
            </div>

            {selectedCarData ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">{selectedCarData.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(selectedCarData.price_per_day)}/hari × {booking.rentalDays} hari
                    {booking.extraHours > 0 && ` + ${booking.extraHours} jam`}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {discountPct > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Diskon ({discountPct}%)</span>
                      <span>- {formatCurrency(discount)}</span>
                    </div>
                  )}

                  {extraHoursCost > 0 && (
                    <div className="flex justify-between">
                      <span>Extra hour</span>
                      <span>+ {formatCurrency(extraHoursCost)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-blue-600 text-lg">
                      <span>Total Bayar</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
                >
                  Pesan Sekarang
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Pilih mobil untuk melihat rincian biaya</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;