import React from 'react';
import { useFuel } from '../context/FuelContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Scale,
  TrendingDown,
  ShieldAlert,
  FileSpreadsheet,
  Lightbulb,
  ArrowRight,
  Flame,
  Info,
} from 'lucide-react';

interface OperationalRecommendationsProps {
  onOpenWeeklyReportModal: () => void;
  onOpenOutflowModal: () => void;
}

export const OperationalRecommendationsPanel: React.FC<OperationalRecommendationsProps> = ({
  onOpenWeeklyReportModal,
  onOpenOutflowModal,
}) => {
  const { alerts, resolveAlert, summary, units, contractors, currentUser, tanks } = useFuel();

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  // Variance analysis
  const theoreticalStock = summary.initialStock + summary.totalInflow - summary.totalOutflowMPR - summary.totalOutflowContractor;
  const varianceLiters = summary.currentPhysicalStock - theoreticalStock;
  const variancePercent = summary.totalInflow > 0 ? ((varianceLiters / summary.totalInflow) * 100).toFixed(2) : '0.00';
  const isVarianceNormal = Math.abs(parseFloat(variancePercent)) <= 0.5;

  return (
    <div className="space-y-6 mb-8">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-5 h-5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Sistem Intelijen & Rekomendasi Operasional
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              PERINGATAN DINI, ANALISA SELISIH STOK & JADWAL SERVIS BERKALA
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Otomasi rekomendasi pemeliharaan armada, deteksi losses/penguapan, dan penagihan solar kontraktor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWeeklyReportModal}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Buka Rekapan Laporan Mingguan
            </button>
          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <Wrench className="w-4 h-4" />
              Peringatan Servis Rutin
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Otomatis mendeteksi rasio HM / Odometer. Segera peringatkan ganti filter BBM saat menyentuh 250 HM untuk cegah boros 15%.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Scale className="w-4 h-4" />
              Analisis Selisih Masuk-Keluar
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Membandingkan saldo teoritis vs sounding dipstick tangki fisik. Standar toleransi migas maksimal selisih ±0.5%.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              Peminjaman Kontraktor
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Pengingat batas jatuh tempo 7 hari untuk pengembalian solar subkon (PT MKG dkk) sebelum eskalasi ke invoice SPK.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              Buffer Stock Kritis
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Sistem memantau cadangan BBM agar tidak jatuh di bawah 20% kapasitas (26.000 L) untuk menjaga kelangsungan alat berat.
            </p>
          </div>
        </div>
      </div>

      {/* Variance & Loss/Gain Analysis Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              AUDIT REKONSILIASI: SELISIH BBM MASUK-KELUAR (FLOWMETER VS SOUNDING)
            </h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
              isVarianceNormal
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isVarianceNormal ? 'Toleransi Normal (< 0.5%)' : 'Perlu Investigasi Selisih'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">Saldo Teoritis Sistem</div>
            <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
              {theoreticalStock.toLocaleString('id-ID')} Liter
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Awal (10k) + Masuk (100k) - Outflow (1.000)
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">Total Stok Fisik Tangki</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {summary.currentPhysicalStock.toLocaleString('id-ID')} Liter
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Akumulasi 3 Tangki di Site
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">Selisih Fisik (Variance)</div>
            <div
              className={`text-lg font-bold font-mono mt-1 tabular-nums ${
                varianceLiters >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {varianceLiters >= 0 ? `+${varianceLiters.toLocaleString('id-ID')}` : varianceLiters.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-slate-400">L</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Selisih terhadap buku log
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">Persentase Deviasi</div>
            <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
              {variancePercent}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Batas toleransi migas: ±0.50%
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400">Rekomendasi Rekonsiliasi Spv:</strong> Tangki MPR dan Tangki Kotak COR II memiliki deviasi sangat rendah (0.12%). Lakukan sounding ulang setiap pergantian shift pukul 06.00 dan 18.00 guna memastikan tidak ada kebocoran sambungan pipa transfer.
        </div>
      </div>

      {/* Push Notifications & Service Alerts List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              DAFTAR NOTIFIKASI PUSH & PERINGATAN OPERASIONAL AKTIF
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {activeAlerts.length} Peringatan Belum Selesai
          </span>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            Semua parameter operasional BBM dalam kondisi nominal dan aman.
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : 'bg-sky-950/30 border-sky-800/60 text-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-sky-500/20 text-sky-400'
                    }`}
                  >
                    {alert.type === 'SERVICE_OVERDUE' ? (
                      <Wrench className="w-4 h-4" />
                    ) : alert.type === 'LOAN_OVERDUE' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] font-mono opacity-70">({alert.timestamp})</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-500/30 text-rose-300'
                            : 'bg-amber-500/30 text-amber-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Tandai Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Routine Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommendation 1: Service Schedule Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            JADWAL SERVIS RUTIN ARMADA (250 HM INTERVAL)
          </div>
          <div className="mt-3 space-y-2.5">
            {units.map((u) => {
              const runSince = u.currentHM - u.lastServiceHM;
              const remaining = u.serviceIntervalHM - runSince;
              return (
                <div
                  key={u.id}
                  className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-amber-400">{u.code}</span> ·{' '}
                    <span className="text-slate-200 font-sans">{u.name}</span>
                  </div>
                  <div>
                    {remaining <= 0 ? (
                      <span className="text-rose-400 font-bold">Terlambat {Math.abs(remaining)} HM</span>
                    ) : (
                      <span className="text-slate-400">Sisa {remaining} HM lagi</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation 2: Contractor Balance Follow-up */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Clock className="w-4 h-4 text-sky-400" />
            REKAP JATUH TEMPO PINJAMAN KONTRAKTOR
          </div>
          <div className="mt-3 space-y-2.5">
            {contractors.map((ktr) => (
              <div
                key={ktr.id}
                className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-amber-400 font-mono">{ktr.code}</span> ·{' '}
                  <span className="text-white font-medium">{ktr.name}</span>
                  <div className="text-[11px] text-slate-400">PIC: {ktr.picName} ({ktr.contactNumber})</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-400 text-[11px]">Saldo Pinjam:</div>
                  <div
                    className={`font-bold ${
                      ktr.netLoanLiters > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {ktr.netLoanLiters} L
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
