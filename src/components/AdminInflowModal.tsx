import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { Truck, ArrowDownRight, DollarSign, X, Check } from 'lucide-react';

interface AdminInflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVendorId?: string;
}

export const AdminInflowModal: React.FC<AdminInflowModalProps> = ({
  isOpen,
  onClose,
  preselectedVendorId,
}) => {
  const { vendors, tanks, addInflow, currentUser } = useFuel();

  const [vendorId, setVendorId] = useState<string>(preselectedVendorId || vendors[0]?.id || '');
  const [doNumber, setDoNumber] = useState<string>(`DO-IN-${Date.now().toString().slice(-5)}`);
  const [volumeLiters, setVolumeLiters] = useState<number>(10000);
  const [purchasePricePerLiter, setPurchasePricePerLiter] = useState<number>(14850);
  const [tankId, setTankId] = useState<string>(tanks[0]?.id || '');
  const [deliveryTruckPlate, setDeliveryTruckPlate] = useState<string>('B 9128 TFU');
  const [driverVendor, setDriverVendor] = useState<string>('Supriyadi (Pertamina Trans)');
  const [densityObserved, setDensityObserved] = useState<number>(0.835);
  const [notes, setNotes] = useState<string>('');

  const handleVendorSelect = (id: string) => {
    setVendorId(id);
    const vendor = vendors.find((v) => v.id === id);
    if (vendor) {
      setPurchasePricePerLiter(vendor.currentPricePerLiter);
      setDoNumber(`DO-${vendor.code}-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (volumeLiters <= 0 || purchasePricePerLiter <= 0) return;

    addInflow({
      vendorId,
      doNumber,
      volumeLiters,
      purchasePricePerLiter,
      tankId,
      deliveryTruckPlate,
      driverVendor,
      densityObserved,
      notes,
    });

    onClose();
  };

  if (!isOpen) return null;

  const totalCost = volumeLiters * purchasePricePerLiter;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 space-y-4 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                FORMULIR PENERIMAAN BBM MASUK (DELIVERY ORDER VENDOR)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pencatatan pasokan solar industri oleh Administrator Gudang & Costing.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vendor Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilih Vendor Penyuplai *
              </label>
              <select
                required
                value={vendorId}
                onChange={(e) => handleVendorSelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.brandProduct})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Surat Jalan / Delivery Order (DO) *
              </label>
              <input
                type="text"
                required
                value={doNumber}
                onChange={(e) => setDoNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Volume & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Volume Masuk (Liter) *
              </label>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={volumeLiters}
                onChange={(e) => setVolumeLiters(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-sm font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Harga Beli per Liter (Rp) *
              </label>
              <input
                type="number"
                min="1000"
                required
                value={purchasePricePerLiter}
                onChange={(e) => setPurchasePricePerLiter(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Total cost calculated preview */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Nilai Pembelian Faktur:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              Rp {totalCost.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Target Tank & Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tangki Penampung Masuk *
              </label>
              <select
                required
                value={tankId}
                onChange={(e) => setTankId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                {tanks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Kapasitas: {t.capacityLiters.toLocaleString('id-ID')} L)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Densitas Observasi 15°C (kg/L)
              </label>
              <input
                type="number"
                step="0.001"
                value={densityObserved}
                onChange={(e) => setDensityObserved(parseFloat(e.target.value) || 0.835)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Delivery Truck & Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                No. Polisi Truk Tangki Vendor *
              </label>
              <input
                type="text"
                required
                value={deliveryTruckPlate}
                onChange={(e) => setDeliveryTruckPlate(e.target.value)}
                placeholder="Contoh: B 9231 TFU"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Driver Vendor *
              </label>
              <input
                type="text"
                required
                value={driverVendor}
                onChange={(e) => setDriverVendor(e.target.value)}
                placeholder="Nama pengemudi truk tangki"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Kualitas & Segel Tangki (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Nomor segel utuh, tes air negatif, warna jernih B35."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <ArrowDownRight className="w-4 h-4" />
              Simpan Penerimaan DO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
