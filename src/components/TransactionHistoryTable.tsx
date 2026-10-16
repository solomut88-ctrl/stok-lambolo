import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { FuelTransaction, TransactionType } from '../types/fuel';
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Fuel,
  ArrowDownRight,
  ArrowUpRight,
  Truck,
  Building2,
  MessageSquare,
} from 'lucide-react';

export const TransactionHistoryTable: React.FC = () => {
  const {
    transactions,
    verifyTransaction,
    batchVerifyPending,
    currentUser,
    exportToCSV,
  } = useFuel();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [selectedTxForVerification, setSelectedTxForVerification] = useState<FuelTransaction | null>(null);
  const [supervisorNotes, setSupervisorNotes] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    // Search
    const searchMatch =
      t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vendorName && t.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.contractorName && t.contractorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.unitName && t.unitName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.driverName && t.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.tankName.toLowerCase().includes(searchQuery.toLowerCase());

    // Type
    const typeMatch = typeFilter === 'ALL' || t.type === typeFilter;

    // Verification
    const verificationMatch =
      verificationFilter === 'ALL' ||
      (verificationFilter === 'VERIFIED' && t.verifiedBySupervisor) ||
      (verificationFilter === 'PENDING' && !t.verifiedBySupervisor);

    return searchMatch && typeMatch && verificationMatch;
  });

  const pendingCount = transactions.filter((t) => !t.verifiedBySupervisor).length;

  const handleOpenVerification = (tx: FuelTransaction) => {
    setSelectedTxForVerification(tx);
    setSupervisorNotes(tx.supervisorNotes || 'Data transaksi telah dicocokkan dengan fisik flowmeter/sounding.');
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForVerification) return;
    verifyTransaction(selectedTxForVerification.id, supervisorNotes);
    setSelectedTxForVerification(null);
  };

  const getTransactionTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'INFLOW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
            <ArrowDownRight className="w-3 h-3" />
            MASUK (DO VENDOR)
          </span>
        );
      case 'OUTFLOW_INTERNAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 w-max">
            <ArrowUpRight className="w-3 h-3" />
            KELUAR (DISPENSING)
          </span>
        );
      case 'LOAN_CONTRACTOR':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-max">
            <Building2 className="w-3 h-3" />
            PINJAMAN KONTRAKTOR
          </span>
        );
      case 'RETURN_CONTRACTOR':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-max">
            <CheckCircle2 className="w-3 h-3" />
            KEMBALI KONTRAKTOR
          </span>
        );
      default:
        return <span className="text-[10px] text-slate-400 font-mono">{type}</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              LOG HISTORI TRANSAKSI KELUAR MASUK & AUDIT VERIFIKASI
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Jurnal pencatatan transaksi BBM terpusat oleh Admin, Operator, dan Otorisasi Supervisor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {currentUser.role === 'supervisor' && pendingCount > 0 && (
            <button
              onClick={batchVerifyPending}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              title="Verifikasi Semua Transaksi yang Menunggu Validasi"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verifikasi Massal ({pendingCount})
            </button>
          )}

          {(currentUser.role === 'supervisor' || currentUser.role === 'admin') && (
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download Log CSV
            </button>
          )}
        </div>
      </div>

      {/* Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari DO, Unit, Driver, Vendor, Kontraktor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">Semua Jenis Transaksi</option>
            <option value="INFLOW">BBM Masuk (DO Vendor)</option>
            <option value="OUTFLOW_INTERNAL">BBM Keluar (Dispensing)</option>
            <option value="LOAN_CONTRACTOR">Peminjaman Kontraktor</option>
            <option value="RETURN_CONTRACTOR">Pengembalian Kontraktor</option>
          </select>
        </div>

        {/* Verification Filter */}
        <div>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">Semua Status Otorisasi</option>
            <option value="PENDING">Menunggu Verifikasi SPV ({pendingCount})</option>
            <option value="VERIFIED">Sudah Terverifikasi SPV</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
              <th className="py-2.5 px-3">NO TRX / SLIP</th>
              <th className="py-2.5 px-3">WAKTU</th>
              <th className="py-2.5 px-3">JENIS TRANSAKSI</th>
              <th className="py-2.5 px-3">TANGKI SUMBER / TUJUAN</th>
              <th className="py-2.5 px-3">ENTITAS / DRIVER / KONTRAKTOR</th>
              <th className="py-2.5 px-3 text-right font-bold text-amber-400">VOLUME (L)</th>
              <th className="py-2.5 px-3">PENCATAT</th>
              <th className="py-2.5 px-3 text-center">VERIFIKASI SPV</th>
              {currentUser.role === 'supervisor' && (
                <th className="py-2.5 px-3 text-right">AKSI AUDIT</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                  Tidak ditemukan transaksi yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400 whitespace-nowrap">
                    {trx.transactionNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {new Date(trx.timestamp).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3">{getTransactionTypeBadge(trx.type)}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{trx.tankName}</td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    <div className="font-semibold">
                      {trx.vendorName || trx.contractorName || trx.unitName || '-'}
                    </div>
                    {(trx.driverName || trx.driverVendor) && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Driver/PIC: {trx.driverName || trx.driverVendor}
                        {trx.hourMeterOrKM ? ` · ${trx.hourMeterOrKM} HM/KM` : ''}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">
                    <span
                      className={
                        trx.type === 'INFLOW' || trx.type === 'RETURN_CONTRACTOR'
                          ? 'text-emerald-400 text-sm'
                          : 'text-amber-400 text-sm'
                      }
                    >
                      {trx.type === 'INFLOW' || trx.type === 'RETURN_CONTRACTOR' ? '+' : '-'}
                      {trx.volumeLiters.toLocaleString('id-ID')} L
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">
                    <div>{trx.recordedByName}</div>
                    <div className="text-slate-500 capitalize font-mono text-[10px]">
                      Role: {trx.recordedByRole}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {trx.verifiedBySupervisor ? (
                      <div className="flex flex-col items-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi
                        </span>
                        {trx.verifiedByName && (
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                            Oleh: {trx.verifiedByName.split(',')[0]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3" />
                        Menunggu SPV
                      </span>
                    )}
                  </td>
                  {currentUser.role === 'supervisor' && (
                    <td className="py-3 px-3 text-right font-sans">
                      {!trx.verifiedBySupervisor ? (
                        <button
                          onClick={() => handleOpenVerification(trx)}
                          className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors shadow-sm"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenVerification(trx)}
                          className="text-[11px] text-slate-400 hover:text-white underline font-mono"
                        >
                          Detail Audit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Supervisor Verification Audit Modal */}
      {selectedTxForVerification && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">
                  Otorisasi & Verifikasi Supervisor · {selectedTxForVerification.transactionNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxForVerification(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleConfirmVerification} className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Transaksi:</span>
                  <span className="text-white font-bold">{selectedTxForVerification.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume Transaksi:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {selectedTxForVerification.volumeLiters.toLocaleString('id-ID')} Liter
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tangki Penyimpan:</span>
                  <span className="text-slate-200">{selectedTxForVerification.tankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pihak / Unit:</span>
                  <span className="text-slate-200">
                    {selectedTxForVerification.vendorName ||
                      selectedTxForVerification.contractorName ||
                      selectedTxForVerification.unitName ||
                      '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diinput Oleh:</span>
                  <span className="text-slate-200">
                    {selectedTxForVerification.recordedByName} ({selectedTxForVerification.recordedByRole})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Verifikasi & Hasil Sounding Fisik *
                </label>
                <textarea
                  rows={3}
                  required
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="Contoh: Telah dicocokkan dengan flowmeter nozzle 01 dan dipstick tangki. Saldo sesuai."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 bg-indigo-950/30 rounded border border-indigo-900/50 text-[11px] text-indigo-300">
                Verifikator: <strong>{currentUser.name}</strong> ({currentUser.title})
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTxForVerification(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sahkan & Verifikasi Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
