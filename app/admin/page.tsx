'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  ktp_url?: string;
  cars: {
    name: string;
    type: string;
  };
}

interface Car {
  id: string;
  name: string;
  type: string;
  price_per_day: number;
  capacity: number;
  image_url: string;
  status: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'cars'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKtp, setSelectedKtp] = useState<string | null>(null);

  // Modal Tambah Mobil
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [carForm, setCarForm] = useState({
    name: '',
    type: 'MPV',
    price_per_day: '',
    capacity: '7',
    image_url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [resBookings, resCars] = await Promise.all([
      fetch('/api/admin/bookings'),
      fetch('/api/admin/cars'),
    ]);

    if (resBookings.ok) setBookings(await resBookings.json());
    if (resCars.ok) setCars(await resCars.json());
    setLoading(false);
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert('Gagal menghapus pesanan');
    }
  };

  const handleUpdateCarStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/cars', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mobil ini dari sistem?')) return;
    const res = await fetch(`/api/admin/cars?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCars((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert('Gagal menghapus mobil');
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/cars/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...carForm,
        price_per_day: Number(carForm.price_per_day),
        capacity: Number(carForm.capacity),
        status: 'available',
      }),
    });

    if (res.ok) {
      alert('Mobil berhasil ditambahkan!');
      setIsAddCarOpen(false);
      setCarForm({ name: '', type: 'MPV', price_per_day: '', capacity: '7', image_url: '' });
      fetchData();
    } else {
      alert('Gagal menambah mobil');
    }
  };

  // Filter Data Berdasarkan Search
  const filteredBookings = bookings.filter(
    (b) =>
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.cars?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCars = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'approved' || b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.total_price), 0);
  const availableCars = cars.filter((c) => c.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center">
            RM
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
            <span className="text-xs text-slate-400">Sistem Manajemen Rental Mobil</span>
          </div>
        </div>
        <a href="/" className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition">
          Lihat Web Pelanggan →
        </a>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Perlu Verifikasi</span>
            <p className="text-3xl font-extrabold text-amber-500 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Pesanan</span>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Estimasi Omset</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Armada Ready</span>
            <p className="text-3xl font-extrabold text-blue-600 mt-1">
              {availableCars} <span className="text-base font-normal text-slate-500">/ {cars.length}</span>
            </p>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
          <div className="flex w-full md:w-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📋 Verifikasi Pesanan ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === 'cars'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🚗 Status Armada Mobil ({cars.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto pb-2 md:pb-0">
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'bookings' ? 'pelanggan/mobil...' : 'nama/tipe mobil...'}`}
              className="p-2 text-xs border rounded-lg w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {activeTab === 'cars' && (
              <button
                onClick={() => setIsAddCarOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap"
              >
                + Tambah Armada
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-medium">Memuat data dashboard...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: VERIFIKASI PESANAN */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-4">Pelanggan</th>
                      <th className="p-4">Mobil</th>
                      <th className="p-4">Tgl Sewa</th>
                      <th className="p-4">Total Biaya</th>
                      <th className="p-4">Dokumen</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{booking.customer_name}</td>
                        <td className="p-4">{booking.cars?.name || 'Mobil N/A'}</td>
                        <td className="p-4 text-slate-600">{booking.start_date} s/d {booking.end_date}</td>
                        <td className="p-4 font-bold">Rp {Number(booking.total_price).toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          {booking.ktp_url ? (
                            <button onClick={() => setSelectedKtp(booking.ktp_url!)} className="text-xs bg-slate-100 border px-2 py-1 rounded">
                              🔍 Lihat KTP
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Belum upload</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100">
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1">
                            {booking.status === 'pending' && (
                              <>
                                <button onClick={() => handleUpdateBookingStatus(booking.id, 'approved')} className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">Setujui</button>
                                <button onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')} className="bg-amber-600 text-white text-xs px-2 py-1 rounded">Tolak</button>
                              </>
                            )}
                            <button onClick={() => handleDeleteBooking(booking.id)} className="bg-red-600 text-white text-xs px-2 py-1 rounded">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: STATUS ARMADA MOBIL */}
            {activeTab === 'cars' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-4">Nama Armada</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga / Hari</th>
                      <th className="p-4">Status Saat Ini</th>
                      <th className="p-4 text-center">Aksi / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{car.name}</td>
                        <td className="p-4 text-slate-600">{car.type}</td>
                        <td className="p-4 font-semibold text-slate-800">
                          Rp {car.price_per_day.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100">
                            {car.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-1">
                            <button disabled={car.status === 'available'} onClick={() => handleUpdateCarStatus(car.id, 'available')} className="bg-emerald-50 text-emerald-700 border text-xs px-2 py-1 rounded disabled:opacity-40">Tersedia</button>
                            <button disabled={car.status === 'rented'} onClick={() => handleUpdateCarStatus(car.id, 'rented')} className="bg-blue-50 text-blue-700 border text-xs px-2 py-1 rounded disabled:opacity-40">Disewa</button>
                            <button disabled={car.status === 'maintenance'} onClick={() => handleUpdateCarStatus(car.id, 'maintenance')} className="bg-amber-50 text-amber-700 border text-xs px-2 py-1 rounded disabled:opacity-40">Perbaikan</button>
                            <button onClick={() => handleDeleteCar(car.id)} className="bg-red-600 text-white text-xs px-2 py-1 rounded">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Tambah Mobil */}
      {isAddCarOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Tambah Armada Mobil Baru</h3>
            <form onSubmit={handleAddCar} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mobil</label>
                <input type="text" required placeholder="Toyota Avanza" className="w-full p-2 border rounded-lg" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe</label>
                  <select className="w-full p-2 border rounded-lg" value={carForm.type} onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}>
                    <option value="MPV">MPV</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas</label>
                  <input type="number" required className="w-full p-2 border rounded-lg" value={carForm.capacity} onChange={(e) => setCarForm({ ...carForm, capacity: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga / Hari (Rp)</label>
                <input type="number" required placeholder="350000" className="w-full p-2 border rounded-lg" value={carForm.price_per_day} onChange={(e) => setCarForm({ ...carForm, price_per_day: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Mobil</label>
                <input type="url" required placeholder="https://..." className="w-full p-2 border rounded-lg" value={carForm.image_url} onChange={(e) => setCarForm({ ...carForm, image_url: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddCarOpen(false)} className="w-1/2 py-2 border rounded-lg font-medium">Batal</button>
                <button type="submit" className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}