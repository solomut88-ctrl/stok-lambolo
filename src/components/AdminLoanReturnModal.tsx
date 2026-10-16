import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { Building2, ArrowUpRight, ArrowDownLeft, X, Check } from 'lucide-react';

interface AdminLoanReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'LOAN' | 'RETURN';
  preselectedContractorId?: string;
}

export const AdminLoanReturnModal: React.FC<AdminLoanReturnModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'LOAN',
  preselectedContractorId,
}) => {
  const { contractors, tanks, addContractorLoan, addContractorReturn, currentUser } = useFuel();

  const [mode, setMode] = useState<'LOAN' | 'RETURN'>(defaultMode);
  const [contractorId, setContractorId] = useState<string>(
    preselectedContractorId || contractors[0]?.id || ''
  );
  const [volumeLiters, setVolumeLiters] = useState<number>(50);
  const [tankId, setTankId] = useState<string>(tanks[0]?.id || '');
  const [slipNumber, setSlipNumber] = useState<string>(
    defaultMode === 'LOAN' ? `PINJAM-SLIP-${Math.floor(100 + Math.random() * 900)}` : `KEMBALI-SLIP-${Math.floor(100 + Math.random() * 900)}`
  );
  const [purpose, setPurpose] = useState<string>(
    defaultMode === 'LOAN' ? 'Peminjaman operasional alat subkontraktor di pit barat' : 'Pengembalian tahap pelunasan pinjaman solar'
  );

  const selectedContractor = contractors.find((c) => c.id === contractorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (volumeLiters <= 0) return;

    if (mode === 'LOAN') {
      addContractorLoan({
        contractorId,
        volumeLiters,
        tankId,
        loanSlipNumber: slipNumber,
        purpose,
      });
    } else {
      addContractorReturn({
        contractorId,
        volumeLiters,
        tankId,
        returnSlipNumber: slipNumber,
        purpose,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                SLIP PEMINJAMAN / PENGEMBALIAN SOLAR KONTRAKTOR
              </h3>
              <p className="text-[11px] text-slate-400">
                Kontrol perputaran bbm mitra kerja dan subkontraktor site.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('LOAN');
              setSlipNumber(`PINJAM-SLIP-${Math.floor(100 + Math.random() * 900)}`);
            }}
            className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mode === 'LOAN'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Peminjaman Solar (Keluar)
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('RETURN');
              setSlipNumber(`KEMBALI-SLIP-${Math.floor(100 + Math.random() * 900)}`);
            }}
            className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mode === 'RETURN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Pengembalian Solar (Masuk)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Contractor selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pilih Mitra Kontraktor *
            </label>
            <select
              required
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} (Saldo Pinjaman: {c.netLoanLiters} L)
                </option>
              ))}
            </select>
          </div>

          {/* Contractor Status Preview */}
          {selectedContractor && (
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between font-mono">
              <div>
                <span className="text-slate-400">Total Pinjaman:</span>{' '}
                <span className="text-white font-bold">{selectedContractor.totalBorrowedLiters} L</span>
              </div>
              <div>
                <span className="text-slate-400">Total Kembali:</span>{' '}
                <span className="text-emerald-400 font-bold">{selectedContractor.totalReturnedLiters} L</span>
              </div>
              <div>
                <span className="text-slate-400">Sisa Netto:</span>{' '}
                <span className="text-rose-400 font-bold">{selectedContractor.netLoanLiters} L</span>
              </div>
            </div>
          )}

          {/* Volume & Slip Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${
                  mode === 'LOAN' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                Volume {mode === 'LOAN' ? 'Pinjaman' : 'Pengembalian'} (Liter) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={volumeLiters}
                onChange={(e) => setVolumeLiters(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Slip Resmi *
              </label>
              <input
                type="text"
                required
                value={slipNumber}
                onChange={(e) => setSlipNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Source / Destination Tank */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {mode === 'LOAN' ? 'Tangki Sumber Pengeluaran Solar *' : 'Tangki Penampung Pengembalian *'}
            </label>
            <select
              required
              value={tankId}
              onChange={(e) => setTankId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            >
              {tanks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Sisa Fisik: {t.currentStockLiters.toLocaleString('id-ID')} L)
                </option>
              ))}
            </select>
          </div>

          {/* Purpose / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Keperluan / Berita Acara Lapangan *
            </label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Jelaskan alasan peminjaman atau nomor BAP pengembalian solar..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            Dibuat oleh: <strong className="text-white">{currentUser.name}</strong> ({currentUser.title})
          </div>

          {/* Actions */}
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
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md ${
                mode === 'LOAN' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Check className="w-4 h-4" />
              Simpan Slip {mode === 'LOAN' ? 'Peminjaman' : 'Pengembalian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
