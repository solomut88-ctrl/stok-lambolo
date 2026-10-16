import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { UnitMaster } from '../types/fuel';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Wrench,
  Fuel,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface SlideshowProps {
  onQuickDispenseUnit: (unit: UnitMaster) => void;
}

export const SlideshowUnitConsumption: React.FC<SlideshowProps> = ({ onQuickDispenseUnit }) => {
  const { units, recordServiceCompleted, currentUser } = useFuel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [serviceModalUnit, setServiceModalUnit] = useState<UnitMaster | null>(null);
  const [newServiceHM, setNewServiceHM] = useState<number>(0);

  // Auto-rotate slideshow every 4 seconds if playing
  useEffect(() => {
    if (!isPlaying || units.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % units.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, units.length]);

  const currentUnit = units[currentIndex] || units[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? units.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % units.length);
  };

  const handleOpenService = (unit: UnitMaster) => {
    setServiceModalUnit(unit);
    setNewServiceHM(unit.currentHM);
  };

  const handleConfirmService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceModalUnit) return;
    recordServiceCompleted(serviceModalUnit.id, newServiceHM);
    setServiceModalUnit(null);
  };

  if (!currentUnit) return null;

  const hoursSinceLastService = currentUnit.currentHM - currentUnit.lastServiceHM;
  const serviceProgressPercent = Math.min(
    100,
    Math.round((hoursSinceLastService / currentUnit.serviceIntervalHM) * 100)
  );
  const isMaintenanceDue = hoursSinceLastService >= currentUnit.serviceIntervalHM;

  return (
    <div className="space-y-6 mb-8">
      {/* Slideshow Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                Slideshow Interaktif
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">
                Unit {currentIndex + 1} dari {units.length}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              KONSUMSI BBM & STATUS OPERASIONAL PER UNIT
            </h2>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
              title={isPlaying ? 'Jeda Slideshow' : 'Mulai Putar Otomatis'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-mono">{isPlaying ? 'Auto-Play ON' : 'Paused'}</span>
            </button>
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Unit Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Unit Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Slide View */}
        <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Visual & Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm rounded-lg">
                {currentUnit.code}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {currentUnit.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>No. Polisi/Lambung: {currentUnit.plateNumber}</span>
                  <span>·</span>
                  <span>{currentUnit.department}</span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-amber-400" />
                  Total Konsumsi
                </div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                  {currentUnit.totalConsumptionLiters.toLocaleString('id-ID')}{' '}
                  <span className="text-xs text-slate-400 font-normal">Liter</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Akumulasi pengisian</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-sky-400" />
                  Burn Rate Rata-rata
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  {currentUnit.burnRatePerHour}{' '}
                  <span className="text-xs text-slate-400 font-normal">L/HM</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Efisiensi engine</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  Hour Meter (HM)
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  {currentUnit.currentHM.toLocaleString('id-ID')}{' '}
                  <span className="text-xs text-slate-400 font-normal">HM</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Jam operasional fisik</div>
              </div>
            </div>

            {/* Driver & Assignment */}
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                Driver / Operator Terjadwal:{' '}
                <strong className="text-white font-medium">{currentUnit.assignedDriver}</strong>
              </span>
            </div>
          </div>

          {/* Service & Operational Status Card */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Jadwal Servis Berkala (PM)</span>
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    isMaintenanceDue
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isMaintenanceDue ? 'PERLU SERVIS SEGERA' : 'KONDISI OPTIMAL'}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Operasional sejak servis:{' '}
                    <strong className="text-white">{hoursSinceLastService} HM</strong>
                  </span>
                  <span className="text-slate-400">
                    Interval:{' '}
                    <strong className="text-slate-300">{currentUnit.serviceIntervalHM} HM</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      serviceProgressPercent >= 95
                        ? 'bg-rose-500'
                        : serviceProgressPercent >= 80
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${serviceProgressPercent}%` }}
                  />
                </div>
              </div>

              {isMaintenanceDue && (
                <div className="mt-3 p-2 bg-rose-950/40 border border-rose-800/50 rounded text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>
                    Unit ini sudah melewati siklus {currentUnit.serviceIntervalHM} HM. Penggunaan solar dapat boros 12% akibat filter kotor.
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons for this Unit */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onQuickDispenseUnit(currentUnit)}
                className="flex-1 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Fuel className="w-3.5 h-3.5" />
                Isi BBM Unit Ini
              </button>

              {(currentUser.role === 'supervisor' || currentUser.role === 'admin') && (
                <button
                  onClick={() => handleOpenService(currentUnit)}
                  className="py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                  title="Reset Jam Servis Setelah Dilakukan Maintenance"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  Servis Selesai
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-800 scrollbar-none">
          {units.map((unit, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{unit.code}</span>
                <span className="text-[10px] opacity-75">
                  ({unit.totalConsumptionLiters} L)
                </span>
                {unit.status === 'MAINTENANCE_DUE' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabular DAFTAR UNIT MPR / IMN (from User Template) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              DAFTAR UNIT MPR / IMN & REKAP KONSUMSI SOLAR
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data konsumsi bahan bakar total, status armada, dan estimasi jam servis.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Total Unit Terdaftar: {units.length} Unit
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
                <th className="py-2.5 px-3">NO</th>
                <th className="py-2.5 px-3">KODE UNIT</th>
                <th className="py-2.5 px-3">NAMA UNIT & TIPE</th>
                <th className="py-2.5 px-3">DRIVER / OPERATOR</th>
                <th className="py-2.5 px-3 text-right">HOUR METER</th>
                <th className="py-2.5 px-3 text-right">BURN RATE</th>
                <th className="py-2.5 px-3 text-right font-bold text-amber-400">
                  TOTAL KONSUMSI UNIT (LITER)
                </th>
                <th className="py-2.5 px-3 text-center">STATUS UNIT</th>
                <th className="py-2.5 px-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {units.map((unit, index) => (
                <tr key={unit.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-500">{index + 1}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{unit.code}</td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    <div className="font-semibold">{unit.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{unit.plateNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{unit.assignedDriver}</td>
                  <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                    {unit.currentHM.toLocaleString('id-ID')} HM
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    {unit.burnRatePerHour} L/jam
                  </td>
                  <td className="py-3 px-3 text-right text-amber-400 font-bold text-sm tabular-nums">
                    {unit.totalConsumptionLiters.toLocaleString('id-ID')} L
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        unit.status === 'MAINTENANCE_DUE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : unit.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => onQuickDispenseUnit(unit)}
                      className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded transition-colors"
                    >
                      Isi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Maintenance Confirmation Modal */}
      {serviceModalUnit && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <Wrench className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">
                  Konfirmasi Servis Rutin · {serviceModalUnit.code}
                </h3>
              </div>
              <button
                onClick={() => setServiceModalUnit(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleConfirmService} className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Unit <strong>{serviceModalUnit.name}</strong> telah dilakukan servis berkala (ganti filter solar, oli engine, & kalibrasi nozzle).
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hour Meter Saat Servis Selesai (HM) *
                </label>
                <input
                  type="number"
                  required
                  value={newServiceHM}
                  onChange={(e) => setNewServiceHM(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400">
                Servis berikutnya akan dijadwalkan pada:{' '}
                <strong className="text-amber-400 font-mono">
                  {(newServiceHM + serviceModalUnit.serviceIntervalHM).toLocaleString('id-ID')} HM
                </strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalUnit(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  Simpan Riwayat Servis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
