import React from 'react';
import { useFuel } from '../context/FuelContext';
import { ShieldCheck, UserCheck, Wrench, ArrowRight } from 'lucide-react';
import { UserRole } from '../types/fuel';

export const RoleAccessBanner: React.FC = () => {
  const { currentUser, setCurrentUserRole } = useFuel();

  const getRoleDetails = (role: UserRole) => {
    switch (role) {
      case 'supervisor':
        return {
          icon: ShieldCheck,
          badge: 'Supervisi & Otoritas Penuh',
          color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60',
          duty: 'Akses penuh seluruh data, verifikasi & validasi transaksi flowmeter/sounding, unduh laporan CSV/PDF, audit selisih BBM, dan persetujuan penyesuaian stok.',
          mandatory: 'Mandatori: Otorisasi & Verifikasi berkala setiap shift pengisian BBM.',
        };
      case 'admin':
        return {
          icon: UserCheck,
          badge: 'Administrasi & Kontrol Stok',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          duty: 'Input stok BBM masuk (DO & Vendor), input stok keluar internal, catat peminjaman/pengembalian kontraktor, update harga beli & konsumsi per unit, dan unduh data.',
          mandatory: 'Mandatori: Nomor DO resmi, vendor rekanan, harga per liter, nomor slip pinjaman.',
        };
      case 'operator':
        return {
          icon: Wrench,
          badge: 'Operator Nozzle & Dispenser',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          duty: 'Penginputan real-time pengisian per unit, input ID unit, jenis unit, nama driver, departemen/kontraktor, volume liter, dan pemantauan level tangki harian.',
          mandatory: 'Mandatori: ID Unit, Jenis Unit, Nama Driver, Tangki/Nozzle, Catatan Hour Meter/KM.',
        };
    }
  };

  const details = getRoleDetails(currentUser.role);
  const Icon = details.icon;

  return (
    <div className={`border rounded-xl p-4 transition-all ${details.color} mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {currentUser.name}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-300">
                {details.badge} ({currentUser.department})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {details.duty}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              {details.mandatory}
            </p>
          </div>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Uji Role:</span>
          {(['supervisor', 'admin', 'operator'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentUserRole(r)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-all ${
                currentUser.role === r
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
