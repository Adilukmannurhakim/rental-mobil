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
  status: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'cars'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKtp, setSelectedKtp] = useState<string | null>(null);

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
    } else {
      alert('Gagal memperbarui status pesanan');
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
    } else {
      alert('Gagal memperbarui status armada');
    }
  };

  // Stat Calculations
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'approved' || b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.total_price), 0);
  const availableCars = cars.filter((c) => c.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Navigation */}
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
            <span className="text-xs text-slate-400 mt-1 block">Pesanan menunggu tindakan</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Pesanan</span>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{bookings.length}</p>
            <span className="text-xs text-slate-400 mt-1 block">Keseluruhan transaksi</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Estimasi Omset</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">Dari transaksi disetujui</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Armada Ready</span>
            <p className="text-3xl font-extrabold text-blue-600 mt-1">
              {availableCars} <span className="text-base font-normal text-slate-500">/ {cars.length}</span>
            </p>
            <span className="text-xs text-slate-400 mt-1 block">Siap disewa</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
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

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-medium">Memuat data dashboard...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: MANAJEMEN VERIFIKASI PESANAN */}
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
                      <th className="p-4 text-center">Aksi / Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{booking.customer_name}</p>
                          <a
                            href={`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            💬 {booking.customer_phone}
                          </a>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-slate-800">{booking.cars?.name || 'Mobil N/A'}</p>
                          <span className="text-xs text-slate-500">{booking.cars?.type}</span>
                        </td>
                        <td className="p-4 text-slate-600">
                          {booking.start_date} <br />
                          <span className="text-xs text-slate-400">s/d {booking.end_date}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          Rp {Number(booking.total_price).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          {booking.ktp_url ? (
                            <button
                              onClick={() => setSelectedKtp(booking.ktp_url!)}
                              className="text-xs bg-slate-100 border border-slate-300 text-slate-700 px-2 py-1 rounded hover:bg-slate-200"
                            >
                              🔍 Lihat KTP
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Belum upload</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : booking.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-1">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'approved')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-medium transition"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium transition"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            {booking.status === 'approved' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-medium transition"
                              >
                                Selesaikan Sewa
                              </button>
                            )}
                            {(booking.status === 'completed' || booking.status === 'rejected') && (
                              <span className="text-xs text-slate-400 font-medium">Selesai</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: MANAJEMEN ARMADA MOBIL */}
            {activeTab === 'cars' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-4">Nama Armada</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga / Hari</th>
                      <th className="p-4">Status Saat Ini</th>
                      <th className="p-4 text-center">Ubah Ketersediaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{car.name}</td>
                        <td className="p-4 text-slate-600">{car.type}</td>
                        <td className="p-4 font-semibold text-slate-800">
                          Rp {car.price_per_day.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              car.status === 'available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : car.status === 'rented'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {car.status === 'available'
                              ? 'TERSEDIA'
                              : car.status === 'rented'
                              ? 'DISEWA'
                              : 'PERBAIKAN'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={car.status === 'available'}
                              onClick={() => handleUpdateCarStatus(car.id, 'available')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 disabled:opacity-40 text-xs px-2.5 py-1 rounded transition font-medium"
                            >
                              Tersedia
                            </button>
                            <button
                              disabled={car.status === 'rented'}
                              onClick={() => handleUpdateCarStatus(car.id, 'rented')}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 disabled:opacity-40 text-xs px-2.5 py-1 rounded transition font-medium"
                            >
                              Disewa
                            </button>
                            <button
                              disabled={car.status === 'maintenance'}
                              onClick={() => handleUpdateCarStatus(car.id, 'maintenance')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 disabled:opacity-40 text-xs px-2.5 py-1 rounded transition font-medium"
                            >
                              Perbaikan
                            </button>
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

      {/* Modal Preview KTP */}
      {selectedKtp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Verifikasi Dokumen KTP</h3>
              <button
                onClick={() => setSelectedKtp(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            <img src={selectedKtp} alt="KTP Pelanggan" className="w-full rounded-lg border max-h-96 object-contain" />
            <button
              onClick={() => setSelectedKtp(null)}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}