import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { Contractor } from '../types/fuel';
import {
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle2,
  Plus,
  FileText,
  Clock,
  Phone,
  User,
} from 'lucide-react';

interface ContractorProps {
  onOpenLoanModalWithContractor?: (contractorId: string) => void;
  onOpenReturnModalWithContractor?: (contractorId: string) => void;
}

export const ContractorLoanSection: React.FC<ContractorProps> = ({
  onOpenLoanModalWithContractor,
  onOpenReturnModalWithContractor,
}) => {
  const { contractors, transactions, currentUser } = useFuel();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredContractors = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalBorrowedAll = contractors.reduce((acc, c) => acc + c.totalBorrowedLiters, 0);
  const totalReturnedAll = contractors.reduce((acc, c) => acc + c.totalReturnedLiters, 0);
  const netLoanAll = contractors.reduce((acc, c) => acc + c.netLoanLiters, 0);

  // Loan & return transactions
  const loanReturnTransactions = transactions.filter(
    (t) => t.type === 'LOAN_CONTRACTOR' || t.type === 'RETURN_CONTRACTOR'
  );

  return (
    <div className="space-y-6 mb-8">
      {/* Overview Banner for Contractor Loans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Akumulasi Peminjaman</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {totalBorrowedAll.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-400">Liter</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Solar dipinjamkan ke subkon</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Pengembalian Fisik</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {totalReturnedAll.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-400">Liter</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sudah diserahkan kembali ke tangki</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Saldo Netto Belum Kembali</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {netLoanAll.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-400">Liter</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">Tanggungan aktif kontraktor (PT MKG)</div>
        </div>
      </div>

      {/* Master Table DAFTAR KONTRAKTOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                DAFTAR KONTRAKTOR & SALDO PEMINJAMAN SOLAR
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kontrol ketat pinjaman BBM operasional mitra kerja lapangan dan pengembalian.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari kontraktor..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
                <th className="py-2.5 px-3">NO</th>
                <th className="py-2.5 px-3">KODE KONTRAKTOR</th>
                <th className="py-2.5 px-3">NAMA KONTRAKTOR / VENDOR</th>
                <th className="py-2.5 px-3">PIC & KONTAK</th>
                <th className="py-2.5 px-3 text-right">PEMINJAMAN (LITER)</th>
                <th className="py-2.5 px-3 text-right text-emerald-400">PENGEMBALIAN (LITER)</th>
                <th className="py-2.5 px-3 text-right font-bold text-rose-400">
                  TOTAL PEMINJAMAN NETTO (LITER)
                </th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
                  <th className="py-2.5 px-3 text-right">AKSI KONTROL</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredContractors.map((ktr, idx) => (
                <tr key={ktr.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{ktr.code}</td>
                  <td className="py-3 px-3 font-sans text-slate-200 font-medium">
                    {ktr.name}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">
                    <div>{ktr.picName}</div>
                    <div className="text-slate-500 font-mono">{ktr.contactNumber}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                    {ktr.totalBorrowedLiters.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">
                    {ktr.totalReturnedLiters.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">
                    <span
                      className={`text-sm ${
                        ktr.netLoanLiters > 0 ? 'text-rose-400 font-extrabold' : 'text-slate-400'
                      }`}
                    >
                      {ktr.netLoanLiters.toLocaleString('id-ID')} L
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ktr.netLoanLiters > 0
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {ktr.netLoanLiters > 0 ? 'Belum Lunas' : 'Nihil / Lunas'}
                    </span>
                  </td>
                  {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
                    <td className="py-3 px-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenLoanModalWithContractor && (
                          <button
                            onClick={() => onOpenLoanModalWithContractor(ktr.id)}
                            className="px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                            title="Beri Pinjaman Baru"
                          >
                            + Pinjam
                          </button>
                        )}
                        {onOpenReturnModalWithContractor && ktr.netLoanLiters > 0 && (
                          <button
                            onClick={() => onOpenReturnModalWithContractor(ktr.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-800/80 rounded transition-colors"
                            title="Catat Pengembalian Solar"
                          >
                            Kembalikan
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riwayat Slip Peminjaman & Pengembalian Kontraktor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              HISTORI SLIP PEMINJAMAN & BUKTI PENGEMBALIAN SOLAR
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {loanReturnTransactions.length} Transaksi Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
                <th className="py-2.5 px-3">NO SLIP</th>
                <th className="py-2.5 px-3">WAKTU</th>
                <th className="py-2.5 px-3">TIPE</th>
                <th className="py-2.5 px-3">KONTRAKTOR</th>
                <th className="py-2.5 px-3 text-right">VOLUME</th>
                <th className="py-2.5 px-3">TANGKI SUMBER / TUJUAN</th>
                <th className="py-2.5 px-3">KEPERLUAN / CATATAN</th>
                <th className="py-2.5 px-3 text-center">VERIFIKASI SPV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loanReturnTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">{trx.transactionNumber}</td>
                  <td className="py-3 px-3 text-slate-300">
                    {new Date(trx.timestamp).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    {trx.type === 'LOAN_CONTRACTOR' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        PEMINJAMAN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        PENGEMBALIAN
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans text-white font-medium">
                    {trx.contractorName}
                  </td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">
                    <span
                      className={
                        trx.type === 'LOAN_CONTRACTOR' ? 'text-rose-400' : 'text-emerald-400'
                      }
                    >
                      {trx.type === 'LOAN_CONTRACTOR' ? '-' : '+'}
                      {trx.volumeLiters.toLocaleString('id-ID')} L
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{trx.tankName}</td>
                  <td className="py-3 px-3 font-sans text-slate-300 text-[11px] max-w-xs truncate">
                    {trx.purpose || trx.supervisorNotes || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        trx.verifiedBySupervisor
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {trx.verifiedBySupervisor ? 'Terverifikasi' : 'Menunggu Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
