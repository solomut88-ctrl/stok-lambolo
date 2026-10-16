import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { UnitMaster, UnitType } from '../types/fuel';
import { Fuel, Gauge, User, Truck, Check, X, AlertTriangle } from 'lucide-react';

interface OperatorDispensingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedUnit?: UnitMaster | null;
}

export const OperatorDispensingModal: React.FC<OperatorDispensingModalProps> = ({
  isOpen,
  onClose,
  preselectedUnit,
}) => {
  const { units, tanks, contractors, addOutflow, currentUser } = useFuel();

  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [customUnitCode, setCustomUnitCode] = useState<string>('');
  const [customUnitName, setCustomUnitName] = useState<string>('');
  const [unitType, setUnitType] = useState<UnitType>('LV');
  const [driverName, setDriverName] = useState<string>('');
  const [departmentOrContractor, setDepartmentOrContractor] = useState<string>('MPR / IMN - Pit Production');
  const [isContractor, setIsContractor] = useState<boolean>(false);
  const [volumeLiters, setVolumeLiters] = useState<number>(100);
  const [tankId, setTankId] = useState<string>(tanks[0]?.id || '');
  const [hourMeterOrKM, setHourMeterOrKM] = useState<number>(0);
  const [dispenserNozzle, setDispenserNozzle] = useState<string>('Nozzle 01 - High Flow');

  useEffect(() => {
    if (preselectedUnit) {
      setSelectedUnitId(preselectedUnit.id);
      setUnitType(preselectedUnit.type);
      setDriverName(preselectedUnit.assignedDriver);
      setDepartmentOrContractor(preselectedUnit.department);
      setHourMeterOrKM(preselectedUnit.currentHM + 10);
      setIsContractor(false);
    } else if (units.length > 0) {
      setSelectedUnitId(units[0].id);
      setUnitType(units[0].type);
      setDriverName(units[0].assignedDriver);
      setDepartmentOrContractor(units[0].department);
      setHourMeterOrKM(units[0].currentHM + 8);
    }
  }, [preselectedUnit, units]);

  const handleUnitChange = (id: string) => {
    setSelectedUnitId(id);
    const found = units.find((u) => u.id === id);
    if (found) {
      setUnitType(found.type);
      setDriverName(found.assignedDriver);
      setDepartmentOrContractor(found.department);
      setHourMeterOrKM(found.currentHM + 8);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (volumeLiters <= 0) return;

    addOutflow({
      unitId: selectedUnitId === 'CUSTOM' ? undefined : selectedUnitId,
      customUnitCode: selectedUnitId === 'CUSTOM' ? customUnitCode : undefined,
      customUnitName: selectedUnitId === 'CUSTOM' ? customUnitName : undefined,
      unitType,
      driverName,
      departmentOrContractor,
      volumeLiters,
      tankId,
      hourMeterOrKM,
      dispenserNozzle,
      isContractor,
    });

    onClose();
  };

  if (!isOpen) return null;

  const selectedTank = tanks.find((t) => t.id === tankId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 space-y-4 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                FORMULIR PENGISIAN BBM NOZZLE (DISPENSING UNIT)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pencatatan real-time pengisian unit lapangan sesuai SOP K3 & Logistik.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Shift & Tank Indicator */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Shift Aktif:</span>{' '}
            <strong className="text-white font-mono">Shift 1 (07:00 - 18:00)</strong>
          </div>
          <div>
            <span className="text-slate-400">Stok Tangki Sumber:</span>{' '}
            <strong className="text-amber-400 font-mono">
              {selectedTank ? selectedTank.currentStockLiters.toLocaleString('id-ID') : 0} L
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Unit Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilih ID Unit Terdaftar *
              </label>
              <select
                required
                value={selectedUnitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.code} - {u.name}
                  </option>
                ))}
                <option value="CUSTOM">+ Unit Lain / Kendaraan Vendor Eksternal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jenis / Tipe Unit *
              </label>
              <select
                required
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as UnitType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="LV">LV (Light Vehicle / Hilux / Triton)</option>
                <option value="EXCA">EXCA (Excavator PC200 / PC400)</option>
                <option value="DT">DT (Dump Truck Hauling)</option>
                <option value="GENSET">GENSET (Power Plant / Genset Site)</option>
                <option value="DOZER">DOZER (Bulldozer D85 / D8R)</option>
                <option value="GRADER">GRADER (Motor Grader)</option>
                <option value="FUEL_TRUCK">FUEL TRUCK (Armada Tangki)</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>
          </div>

          {/* If custom unit */}
          {selectedUnitId === 'CUSTOM' && (
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Kode Unit Baru *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UNIT-EXT-08"
                  value={customUnitCode}
                  onChange={(e) => setCustomUnitCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama / Merk Unit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crane Sany 50T"
                  value={customUnitName}
                  onChange={(e) => setCustomUnitName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Driver & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Driver / Operator Unit *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Nama lengkap driver"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Departemen / Kontraktor *
              </label>
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={departmentOrContractor}
                  onChange={(e) => setDepartmentOrContractor(e.target.value)}
                  placeholder="Contoh: Mining Operations / PT MKG"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <label className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isContractor}
                    onChange={(e) => setIsContractor(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Tandai sebagai Unit Milik Kontraktor (Subkon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Volume & Hour Meter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                Volume Pengisian BBM (Liter) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={volumeLiters}
                onChange={(e) => setVolumeLiters(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-2 text-sm font-bold font-mono text-amber-400 focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-1.5 mt-1.5">
                {[50, 100, 200, 500].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setVolumeLiters(quick)}
                    className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-mono"
                  >
                    +{quick}L
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hour Meter (HM) / Odometer KM *
              </label>
              <input
                type="number"
                required
                value={hourMeterOrKM}
                onChange={(e) => setHourMeterOrKM(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Wajib diisi untuk kalkulasi burn rate dan jadwal servis berkala.
              </p>
            </div>
          </div>

          {/* Source Tank & Nozzle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tangki Sumber Solar *
              </label>
              <select
                required
                value={tankId}
                onChange={(e) => setTankId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {tanks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Sisa: {t.currentStockLiters.toLocaleString('id-ID')} L)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nozzle Dispenser *
              </label>
              <select
                required
                value={dispenserNozzle}
                onChange={(e) => setDispenserNozzle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="Nozzle 01 - High Flow">Nozzle 01 - High Flow (Alat Berat)</option>
                <option value="Nozzle 02 - Direct Tank">Nozzle 02 - Direct Tank (Genset / Hauler)</option>
                <option value="Nozzle 03 - Standard Flow">Nozzle 03 - Standard Flow (LV Site)</option>
              </select>
            </div>
          </div>

          {/* Logging Authority note */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            Operator Penginput: <strong className="text-white">{currentUser.name}</strong> ({currentUser.title}). Data akan langsung masuk ke log transaksi untuk verifikasi Supervisor.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Fuel className="w-4 h-4" />
              Simpan & Keluarkan BBM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
