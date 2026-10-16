import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { Tank } from '../types/fuel';
import { Database, Gauge, Thermometer, Droplet, ArrowRight, RefreshCw, Check } from 'lucide-react';

export const TankMonitoringPanel: React.FC = () => {
  const { tanks, triggerManualSounding, currentUser } = useFuel();
  const [selectedTankForSounding, setSelectedTankForSounding] = useState<Tank | null>(null);
  const [soundingCm, setSoundingCm] = useState<number>(0);
  const [density, setDensity] = useState<number>(0.835);
  const [tempC, setTempC] = useState<number>(28.5);
  const [soundingSuccess, setSoundingSuccess] = useState(false);

  const handleOpenSounding = (tank: Tank) => {
    setSelectedTankForSounding(tank);
    setSoundingCm(tank.soundingHeightCm);
    setDensity(tank.density);
    setTempC(tank.temperatureC);
    setSoundingSuccess(false);
  };

  const handleSaveSounding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTankForSounding) return;
    triggerManualSounding(selectedTankForSounding.id, soundingCm, density, tempC);
    setSoundingSuccess(true);
    setTimeout(() => {
      setSelectedTankForSounding(null);
      setSoundingSuccess(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            MONITORING TANGKI SOLAR FISIK (TOTAL KAPASITAS 130.000 LITER)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Level fisik sounding aktual, temperatur, densitas, dan kapasitas tampung per tangki.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Status Sensor / Dipstick: Online</span>
        </div>
      </div>

      {/* 3 Tanks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tanks.map((tank) => {
          const percentage = Math.round((tank.currentStockLiters / tank.capacityLiters) * 100);
          
          return (
            <div
              key={tank.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 font-medium tracking-wider">
                      {tank.code}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{tank.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 tabular-nums">
                    {percentage}%
                  </span>
                </div>

                {/* Tank Graphical Display */}
                <div className="my-4 flex items-center gap-4">
                  {/* Visual Cylindrical / Box Vessel */}
                  <div className="w-14 h-28 bg-slate-900 border-2 border-slate-700 rounded-lg relative overflow-hidden flex flex-col justify-end shadow-inner shrink-0">
                    {/* Measurement graduation marks */}
                    <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between py-1 px-1 pointer-events-none z-10 opacity-30">
                      <div className="border-t border-slate-400 w-2" />
                      <div className="border-t border-slate-400 w-1" />
                      <div className="border-t border-slate-400 w-2" />
                      <div className="border-t border-slate-400 w-1" />
                      <div className="border-t border-slate-400 w-2" />
                    </div>

                    {/* Fuel Liquid Fill */}
                    <div
                      className={`w-full transition-all duration-1000 relative ${
                        percentage > 100
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                          : percentage > 40
                          ? 'bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500'
                          : percentage > 20
                          ? 'bg-gradient-to-t from-orange-700 to-amber-500'
                          : 'bg-gradient-to-t from-rose-800 to-rose-500'
                      }`}
                      style={{ height: `${Math.min(100, Math.max(10, percentage))}%` }}
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Volume Details */}
                  <div className="space-y-1.5 flex-1">
                    <div>
                      <div className="text-[11px] text-slate-400">Stok Saat Ini</div>
                      <div className="text-lg font-bold font-mono text-white tabular-nums">
                        {tank.currentStockLiters.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-normal text-slate-400">L</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Kapasitas Maksimal</div>
                      <div className="text-xs font-mono text-slate-300 tabular-nums">
                        {tank.capacityLiters.toLocaleString('id-ID')} L
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Buffer Minimum:{' '}
                      <span className="font-mono text-slate-300">
                        {tank.minBufferLiters.toLocaleString('id-ID')} L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sounding Telemetry strip */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex flex-col">
                    <span>Tinggi Celup</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {tank.soundingHeightCm} cm
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span>Densitas 15°C</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {tank.density} kg/L
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span>Suhu Tangki</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {tank.temperatureC}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Kalibrasi Sounding */}
              <div className="mt-3 pt-2">
                <button
                  onClick={() => handleOpenSounding(tank)}
                  className="w-full py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-amber-400" />
                  Input Sounding & Suhu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Sounding Modal */}
      {selectedTankForSounding && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Formulir Sounding Dipstick · {selectedTankForSounding.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pengukuran celup fisik harian untuk verifikasi stok flowmeter.
                </p>
              </div>
              <button
                onClick={() => setSelectedTankForSounding(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSaveSounding} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tinggi Cairan (Dipstick Height in cm) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={soundingCm}
                  onChange={(e) => setSoundingCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Densitas Observasi (kg/L)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value) || 0.835)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Temperatur Tangki (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempC}
                    onChange={(e) => setTempC(parseFloat(e.target.value) || 28)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                Pencatat: <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.title})
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTankForSounding(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={soundingSuccess}
                  className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {soundingSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950" />
                      Tersimpan!
                    </>
                  ) : (
                    'Perbarui Sounding'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
