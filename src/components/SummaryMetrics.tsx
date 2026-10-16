import React from 'react';
import { useFuel } from '../context/FuelContext';
import {
  Fuel,
  ArrowDownRight,
  ArrowUpRight,
  Truck,
  Building2,
  CheckCircle,
  AlertTriangle,
  Scale,
  Layers,
} from 'lucide-react';

export const SummaryMetrics: React.FC = () => {
  const { summary } = useFuel();

  const formatNumber = (num: number) => num.toLocaleString('id-ID');

  return (
    <div className="space-y-4 mb-8">
      {/* Top Banner KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* 1. Sisa Stok Fisik (Primary Hero KPI) */}
        <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Sisa Stok Fisik Saat Ini</span>
            <span className="font-mono text-[11px] text-amber-400">
              {summary.stockPercentage}% dari 130.000 L
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              {formatNumber(summary.currentPhysicalStock)} <span className="text-base font-normal text-slate-400">Liter</span>
            </div>
            {/* Progress bar to 130k */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-700 ${
                  summary.stockPercentage < 20
                    ? 'bg-rose-500'
                    : summary.stockPercentage < 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, summary.stockPercentage)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Status Stok:</span>
            <span
              className={`font-semibold font-mono text-xs ${
                summary.stockStatus === 'STOK AMAN'
                  ? 'text-emerald-400'
                  : summary.stockStatus === 'STOK WASPADA'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {summary.stockStatus}
            </span>
          </div>
        </div>

        {/* 2. Stok Awal */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stok Awal Awal</span>
            <Layers className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {formatNumber(summary.initialStock)} <span className="text-xs text-slate-400 font-normal">L</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Saldo baseline periode</div>
        </div>

        {/* 3. Total Solar Masuk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Solar Masuk</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
              +{formatNumber(summary.totalInflow)} <span className="text-xs text-slate-400 font-normal">L</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Dari 3 Vendor Rekanan</div>
        </div>

        {/* 4. Total Keluar MPR / IMN */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Keluar MPR</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-sky-400 font-mono tabular-nums">
              -{formatNumber(summary.totalOutflowMPR)} <span className="text-xs text-slate-400 font-normal">L</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Armada internal site</div>
        </div>

        {/* 5. Total Keluar Kontraktor */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Keluar Kontraktor</span>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
              -{formatNumber(summary.totalOutflowContractor)} <span className="text-xs text-slate-400 font-normal">L</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Konsumsi mitra subkon</div>
        </div>

        {/* 6. Peminjaman Netto (Belum Kembali) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Peminjaman Netto</span>
            <Scale className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-bold text-rose-400 font-mono tabular-nums">
              {formatNumber(summary.netLoanContractor)} <span className="text-xs text-slate-400 font-normal">L</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Belum kembali (PT MKG)</div>
        </div>
      </div>
    </div>
  );
};
