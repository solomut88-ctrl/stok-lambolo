import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { UserRole } from '../types/fuel';
import {
  Fuel,
  Bell,
  Download,
  ShieldCheck,
  User,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenInflowModal: () => void;
  onOpenOutflowModal: () => void;
  onOpenWeeklyReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenInflowModal,
  onOpenOutflowModal,
  onOpenWeeklyReportModal,
}) => {
  const {
    currentUser,
    setCurrentUserRole,
    alerts,
    transactions,
    exportToCSV,
    resetToDefaultData,
    summary,
  } = useFuel();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const pendingVerificationCount = transactions.filter((t) => !t.verifiedBySupervisor).length;
  const unresolvedAlertsCount = alerts.filter((a) => !a.resolved).length;

  const navItems = [
    { id: 'overview', label: 'Ringkasan & Tangki' },
    { id: 'slideshow', label: 'Slideshow Unit & Keluar' },
    { id: 'contractors', label: 'Peminjaman Kontraktor' },
    { id: 'vendors', label: 'Vendor & Harga BBM' },
    { id: 'transactions', label: 'Log Transaksi' },
    { id: 'recommendations', label: 'Rekomendasi & Servis' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentUserRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1, 2, 3 in 1 clean row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single brand mark wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Fuel className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white whitespace-nowrap">
              BBM <span className="text-amber-500">LAMBOLO</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Site Control System · 130.000 L
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.label}
                {item.id === 'transactions' && pendingVerificationCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono">
                    {pendingVerificationCount}
                  </span>
                )}
                {item.id === 'recommendations' && unresolvedAlertsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-rose-500/20 text-rose-300 rounded font-mono">
                    {unresolvedAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & User Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Notification Bell */}
          <button
            onClick={() => setActiveTab('recommendations')}
            title="Peringatan Operasional & Servis"
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Quick Action depending on Role */}
          {currentUser.role === 'operator' && (
            <button
              onClick={onOpenOutflowModal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <Fuel className="w-3.5 h-3.5" />
              Catat Pengisian Nozzle
            </button>
          )}

          {currentUser.role === 'admin' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenInflowModal}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
              >
                + Stok Masuk
              </button>
              <button
                onClick={onOpenOutflowModal}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
              >
                + BBM Keluar
              </button>
            </div>
          )}

          {currentUser.role === 'supervisor' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenWeeklyReportModal}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Laporan Mingguan
              </button>
              <button
                onClick={exportToCSV}
                title="Download Data Stok Lengkap (CSV)"
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh CSV
              </button>
            </div>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-semibold text-slate-200 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-amber-400 capitalize font-mono">
                  {currentUser.role === 'supervisor'
                    ? 'Supervisor (Full Akses)'
                    : currentUser.role === 'admin'
                    ? 'Admin MEC (Gudang & Stok)'
                    : 'Operator (Pengisian Unit)'}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                  Ganti Akun & Hak Akses:
                </div>

                {/* Supervisor Option */}
                <button
                  onClick={() => handleRoleSelect('supervisor')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    currentUser.role === 'supervisor' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-200">Anto Solomut (MEC 2026)</div>
                    <div className="text-[11px] text-slate-400">Supervisor · Verifikasi & Download Semua</div>
                  </div>
                  {currentUser.role === 'supervisor' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>

                {/* Admin Option */}
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    currentUser.role === 'admin' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-200">Sheflien A.S.</div>
                    <div className="text-[11px] text-slate-400">Admin MEC · Input Inflow, Outflow, Pinjam & Vendor</div>
                  </div>
                  {currentUser.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>

                {/* Operator Option */}
                <button
                  onClick={() => handleRoleSelect('operator')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    currentUser.role === 'operator' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-200">Ahmad Fauzi</div>
                    <div className="text-[11px] text-slate-400">Operator · Input Nozzle, Unit, Driver & Monitor</div>
                  </div>
                  {currentUser.role === 'operator' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>

                <div className="mt-2 pt-2 border-t border-slate-800 px-3">
                  <button
                    onClick={() => {
                      setResetConfirmOpen(true);
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left text-[11px] text-slate-400 hover:text-rose-400 py-1 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Data ke Default CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === item.id ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Reset ke Data Awal?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ini akan mengembalikan seluruh data stok, tangki, peminjaman PT MKG, transaksi, dan konsumsi unit ke template CSV master awal (109.000 L).
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
