'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const cars = [
    {
      id: 1,
      name: 'Toyota Avanza',
      type: 'MPV',
      seats: '7 Kursi',
      price: 'Rp 350.000',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 2,
      name: 'Toyota Avanza',
      type: 'MPV',
      seats: '7 Kursi',
      price: 'Rp 350.000',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 3,
      name: 'Toyota Innova Reborn',
      type: 'MPV',
      seats: '7 Kursi',
      price: 'Rp 600.000',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* --- HEADER / NAVBAR PERUSAHAAN & TOMBOL LOGIN --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo & Judul Aplikasi */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              RM
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Rental Mobil Perusahaan
              </h1>
              <p className="text-xs text-slate-500">
                Pilih armada terbaik untuk kebutuhan perjalanan Anda.
              </p>
            </div>
          </div>

          {/* Tombol Akses Login */}
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>

        </div>
      </header>

      {/* --- KONTEN DAFTAR MOBIL --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              {/* Gambar Mobil */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detail Mobil */}
              <div className="p-5">
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                  {car.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{car.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{car.seats}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-lg font-extrabold text-blue-600">{car.price}</span>
                    <span className="text-xs text-slate-400">/hari</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}