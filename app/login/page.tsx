'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [role, setRole] = useState<'pelanggan' | 'admin'>('pelanggan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header App */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl mb-3">
            RM
          </div>
          <h2 className="text-2xl font-bold">Rental Mobil</h2>
          <p className="text-slate-400 text-sm mt-1">Silakan masuk ke akun Anda</p>
        </div>

        {/* Tab Switcher Role */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setRole('pelanggan')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              role === 'pelanggan'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pelanggan
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              role === 'admin'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Administrator
          </button>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Email / Username {role === 'admin' && 'Admin'}
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@rentalmobil.com' : 'nama@email.com'}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all text-sm mt-2"
          >
            Masuk sebagai {role === 'admin' ? 'Admin' : 'Pelanggan'}
          </button>

          {role === 'pelanggan' && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Belum punya akun?{' '}
              <a href="/register" className="text-blue-600 font-semibold hover:underline">
                Daftar Sekarang
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}