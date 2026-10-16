import React from 'react';
import { useFuel } from '../context/FuelContext';
import {
  FileSpreadsheet,
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ isOpen, onClose }) => {
  const { summary, tanks, units, contractors, vendors, exportToCSV, currentUser } = useFuel();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const valuationRp = summary.currentPhysicalStock * summary.weightedAveragePricePerLiter;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 space-y-6 my-6 text-slate-100">
        
        {/* Modal Top Actions (no-print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              REKAPAN LAPORAN OTOMATIS MINGGUAN BBM SOLAR (SITE LEVEL)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export CSV
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Document Body (Printable) */}
        <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl print:p-0 print:shadow-none space-y-6 text-xs">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-lg font-black tracking-tight uppercase text-slate-950 font-serif">
                PT MULTI PRIMA RESOURCES (MPR) / IMN
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Departemen Logistik, Supply Chain & Fuel Management
              </div>
              <div className="text-[11px] text-slate-500">
                Site Project: Lambolo - Pomalaa Mining & Infrastructure Area
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1 bg-slate-100 border border-slate-300 font-mono font-bold text-xs rounded text-slate-900 inline-block">
                DOKUMEN RESMI INTERNAL
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Nomor: <span className="font-mono">RPT-BBM/2026/W41</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Periode: <strong className="text-slate-800">Minggu II (09 - 15 Okt 2026)</strong>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-1">
            <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              REKAPITULASI MINGGUAN KELUAR MASUK & KONTROL STOK BBM SOLAR
            </h1>
            <p className="text-[11px] text-slate-500">
              Kapasitas Penyimpanan Total Site: 130.000 Liter · Status: STOK AMAN
            </p>
          </div>

          {/* Table 1: Executive Balance (The exact template items) */}
          <div>
            <h3 className="font-bold text-xs text-slate-900 mb-2 font-mono uppercase bg-slate-100 p-1.5 border border-slate-300">
              1. RINGKASAN NERACA STOK SOLAR REAL-TIME
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-700">
                  <th className="border border-slate-300 p-2 text-right">STOK AWAL (L)</th>
                  <th className="border border-slate-300 p-2 text-right">SOLAR MASUK (L)</th>
                  <th className="border border-slate-300 p-2 text-right">KELUAR MPR (L)</th>
                  <th className="border border-slate-300 p-2 text-right">KELUAR KONTRAKTOR (L)</th>
                  <th className="border border-slate-300 p-2 text-right text-rose-600">PINJAMAN NETTO (L)</th>
                  <th className="border border-slate-300 p-2 text-right font-bold text-slate-950">SISA STOK FISIK (L)</th>
                  <th className="border border-slate-300 p-2 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-right font-semibold">
                  <td className="border border-slate-300 p-2">{summary.initialStock.toLocaleString('id-ID')}</td>
                  <td className="border border-slate-300 p-2 text-emerald-700">+{summary.totalInflow.toLocaleString('id-ID')}</td>
                  <td className="border border-slate-300 p-2 text-sky-700">-{summary.totalOutflowMPR.toLocaleString('id-ID')}</td>
                  <td className="border border-slate-300 p-2 text-amber-700">-{summary.totalOutflowContractor.toLocaleString('id-ID')}</td>
                  <td className="border border-slate-300 p-2 text-rose-600 font-bold">{summary.netLoanContractor.toLocaleString('id-ID')}</td>
                  <td className="border border-slate-300 p-2 font-black text-sm text-slate-900 bg-amber-50">
                    {summary.currentPhysicalStock.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">
                    {summary.stockStatus} ({summary.stockPercentage}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Tank Status */}
          <div>
            <h3 className="font-bold text-xs text-slate-900 mb-2 font-mono uppercase bg-slate-100 p-1.5 border border-slate-300">
              2. MONITORING ALOKASI TANGKI PENAMPUNGAN (130.000 LITER)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-mono">
                  <th className="border border-slate-300 p-2 text-left">NAMA TANGKI</th>
                  <th className="border border-slate-300 p-2 text-right">KAPASITAS TAMPUNG</th>
                  <th className="border border-slate-300 p-2 text-right">STOK FISIK AKTUAL</th>
                  <th className="border border-slate-300 p-2 text-right">PERSENTASE TAMPUNG</th>
                  <th className="border border-slate-300 p-2 text-center">TINGGI SOUNDING</th>
                  <th className="border border-slate-300 p-2 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {tanks.map((t) => {
                  const pct = Math.round((t.currentStockLiters / t.capacityLiters) * 100);
                  return (
                    <tr key={t.id}>
                      <td className="border border-slate-300 p-2 font-sans font-medium">{t.name}</td>
                      <td className="border border-slate-300 p-2 text-right">{t.capacityLiters.toLocaleString('id-ID')} L</td>
                      <td className="border border-slate-300 p-2 text-right font-bold">{t.currentStockLiters.toLocaleString('id-ID')} L</td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-amber-700">{pct}%</td>
                      <td className="border border-slate-300 p-2 text-center">{t.soundingHeightCm} cm</td>
                      <td className="border border-slate-300 p-2 text-center font-sans">
                        <span className="text-[10px] font-bold text-emerald-700">Optimal</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table 3: Contractor Loan Ledger & Units Split Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Contractor Summary */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 mb-2 font-mono uppercase bg-slate-100 p-1.5 border border-slate-300">
                3. REKAP PEMINJAMAN KONTRAKTOR
              </h3>
              <table className="w-full border-collapse border border-slate-300 text-[11px] font-mono">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="border border-slate-300 p-1.5 text-left">KONTRAKTOR</th>
                    <th className="border border-slate-300 p-1.5 text-right">PINJAM</th>
                    <th className="border border-slate-300 p-1.5 text-right">KEMBALI</th>
                    <th className="border border-slate-300 p-1.5 text-right">SALDO</th>
                  </tr>
                </thead>
                <tbody>
                  {contractors.map((c) => (
                    <tr key={c.id}>
                      <td className="border border-slate-300 p-1.5 font-sans font-medium">{c.name}</td>
                      <td className="border border-slate-300 p-1.5 text-right">{c.totalBorrowedLiters}</td>
                      <td className="border border-slate-300 p-1.5 text-right text-emerald-700">{c.totalReturnedLiters}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-bold text-rose-600">
                        {c.netLoanLiters} L
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unit Consumption */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 mb-2 font-mono uppercase bg-slate-100 p-1.5 border border-slate-300">
                4. KONSUMSI BBM PER UNIT (TOP CONSUMERS)
              </h3>
              <table className="w-full border-collapse border border-slate-300 text-[11px] font-mono">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="border border-slate-300 p-1.5 text-left">KODE UNIT</th>
                    <th className="border border-slate-300 p-1.5 text-left">NAMA UNIT</th>
                    <th className="border border-slate-300 p-1.5 text-right">KONSUMSI</th>
                    <th className="border border-slate-300 p-1.5 text-right">JAM (HM)</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id}>
                      <td className="border border-slate-300 p-1.5 font-bold">{u.code}</td>
                      <td className="border border-slate-300 p-1.5 font-sans truncate max-w-[120px]">{u.name}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-bold text-amber-700">
                        {u.totalConsumptionLiters} L
                      </td>
                      <td className="border border-slate-300 p-1.5 text-right">{u.currentHM}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vendor Average Cost Section */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded">
            <div className="flex justify-between items-center font-mono">
              <div>
                <span className="font-bold text-slate-800">Harga Rata-Rata Suplai Vendor:</span>{' '}
                <span className="font-bold text-slate-950">
                  Rp {summary.weightedAveragePricePerLiter.toLocaleString('id-ID')} / Liter
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-800">Total Valuasi Fisik di Site:</span>{' '}
                <span className="font-bold text-emerald-700">
                  Rp {valuationRp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Approvals */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">Dibuat & Dicatat Oleh:</div>
              <div className="font-bold text-slate-900 mt-1">Sheflien A.S.</div>
              <div className="text-[10px] text-slate-500">Administrator Gudang & Stok BBM (MEC)</div>
              <div className="mt-8 text-[11px] font-mono text-slate-400">
                [Tanda Tangan Digital Terverifikasi]
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Diperiksa & Disahkan Oleh:</div>
              <div className="font-bold text-slate-900 mt-1">Anto Solomut (MEC 2026)</div>
              <div className="text-[10px] text-slate-500">Supervisor Logistik & Fuel Management</div>
              <div className="mt-8 text-[11px] font-mono text-emerald-700 font-bold">
                ✓ OTORISASI SUPERVISOR VALID (15 OKTOBER 2026)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
