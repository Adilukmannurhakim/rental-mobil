'use client';

import { useState, useEffect } from 'react';

interface Car {
  id: string;
  name: string;
  type: string;
  price_per_day: number;
  capacity: number;
  image_url: string;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/cars')
      .then((res) => res.json())
      .then((data) => setCars(data));
  }, []);

  const calculateTotal = () => {
    if (!form.startDate || !form.endDate || !selectedCar) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    return days * selectedCar.price_per_day;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        car_id: selectedCar?.id,
        customer_name: form.name,
        customer_phone: form.phone,
        start_date: form.startDate,
        end_date: form.endDate,
        total_price: calculateTotal(),
      }),
    });

    setLoading(false);
    if (res.ok) {
      alert('Sewa berhasil diajukan! Tim kami akan menghubungi Anda.');
      setSelectedCar(null);
      setForm({ name: '', phone: '', startDate: '', endDate: '' });
    } else {
      alert('Gagal membuat pemesanan.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Mobil Perusahaan</h1>
        <p className="text-gray-600 mb-8">Pilih armada terbaik untuk kebutuhan perjalanan Anda.</p>

        {/* Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
              <div>
                <img src={car.image_url} alt={car.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <span className="text-xs font-semibold uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {car.type}
                </span>
                <h2 className="text-xl font-bold mt-2">{car.name}</h2>
                <p className="text-gray-500 text-sm">{car.capacity} Kursi</p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Rp {car.price_per_day.toLocaleString('id-ID')} <span className="text-xs text-gray-500">/hari</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCar(car)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Sewa Sekarang
              </button>
            </div>
          ))}
        </div>

        {/* Modal Booking Form */}
        {selectedCar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-1">Form Sewa {selectedCar.name}</h2>
              <p className="text-sm text-gray-500 mb-4">Lengkapi data untuk mengajukan sewa.</p>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border rounded-lg"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 w-full p-2 border rounded-lg"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tgl Mulai</label>
                    <input
                      type="date"
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tgl Selesai</label>
                    <input
                      type="date"
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium">Total Perkiraan:</span>
                  <span className="font-bold text-blue-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCar(null)}
                    className="w-1/2 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                  >
                    {loading ? 'Mengirim...' : 'Konfirmasi Sewa'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}