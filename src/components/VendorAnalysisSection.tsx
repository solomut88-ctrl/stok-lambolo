import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { Vendor } from '../types/fuel';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Truck,
  CheckCircle2,
  Calculator,
  Plus,
  Edit2,
  Phone,
  Calendar,
} from 'lucide-react';

export const VendorAnalysisSection: React.FC<{ onOpenInflowWithVendor?: (vendorId: string) => void }> = ({
  onOpenInflowWithVendor,
}) => {
  const { vendors, transactions, summary, currentUser } = useFuel();
  const [selectedVendorForEdit, setSelectedVendorForEdit] = useState<Vendor | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const handleOpenEdit = (v: Vendor) => {
    setSelectedVendorForEdit(v);
    setEditPrice(v.currentPricePerLiter);
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorForEdit) return;
    // In our app context, vendor price can be updated
    selectedVendorForEdit.currentPricePerLiter = editPrice;
    setSelectedVendorForEdit(null);
  };

  // Calculate delivery order stats for each vendor
  const vendorStats = vendors.map((v) => {
    const doList = transactions.filter((t) => t.type === 'INFLOW' && t.vendorId === v.id);
    const totalVolume = doList.reduce((acc, t) => acc + t.volumeLiters, 0);
    const totalExpenditure = doList.reduce(
      (acc, t) => acc + (t.totalCostRp || t.volumeLiters * (t.purchasePricePerLiter || v.currentPricePerLiter)),
      0
    );
    const avgPrice = totalVolume > 0 ? Math.round(totalExpenditure / totalVolume) : v.currentPricePerLiter;
    return {
      vendor: v,
      deliveryCount: doList.length,
      totalVolume,
      totalExpenditure,
      avgPrice,
      latestDO: doList[0] || null,
    };
  });

  return (
    <div className="space-y-6 mb-8">
      {/* Weighted Average Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                Index Harga Pasokan Solar
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              HARGA RATA-RATA PEMBELIAN BBM (WEIGHTED AVERAGE COST)
            </h2>
            <p className="text-xs text-slate-300">
              Dihitung proporsional dari seluruh batch pengiriman vendor rekanan: 
              <span className="font-mono text-slate-400"> (Total Nilai Transaksi / Total Liter Masuk)</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-700/80 p-3.5 rounded-xl flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Harga Rata-Rata Saat Ini</div>
              <div className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
                {formatRp(summary.weightedAveragePricePerLiter)}{' '}
                <span className="text-xs font-normal text-slate-400">/ Liter</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-l border-slate-800 pl-3">
              <div>Total Masuk: <span className="font-mono text-white">{summary.totalInflow.toLocaleString('id-ID')} L</span></div>
              <div>Estimasi Nilai: <span className="font-mono text-emerald-400">{formatRp(summary.totalInflow * summary.weightedAveragePricePerLiter)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendorStats.map(({ vendor, deliveryCount, totalVolume, totalExpenditure, avgPrice, latestDO }) => {
          const priceDiff = vendor.currentPricePerLiter - summary.weightedAveragePricePerLiter;
          return (
            <div
              key={vendor.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      {vendor.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">{vendor.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{vendor.brandProduct}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    ★ {vendor.rating}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Harga Beli Terkini</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold font-mono text-white tabular-nums">
                        {formatRp(vendor.currentPricePerLiter)}
                      </span>
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleOpenEdit(vendor)}
                          className="p-1 hover:text-amber-400 text-slate-500 transition-colors"
                          title="Ubah Harga Beli Vendor"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800">
                    <span className="text-slate-400 text-[11px]">Harga Rata-Rata Vendor</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      {formatRp(avgPrice)} / L
                    </span>
                  </div>

                  <div className="text-[10px] flex items-center justify-between text-slate-400 pt-0.5">
                    <span>Deviasi thd Pasar:</span>
                    <span
                      className={`font-mono font-medium ${
                        priceDiff > 0 ? 'text-rose-400' : priceDiff < 0 ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {priceDiff > 0 ? `+${formatRp(priceDiff)}` : `${formatRp(priceDiff)}`}
                    </span>
                  </div>
                </div>

                {/* Supply volume & contacts */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Total Pasokan BBM:</span>
                    <span className="font-mono font-semibold text-white tabular-nums">
                      {totalVolume.toLocaleString('id-ID')} Liter
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Total Nilai Pembelian:</span>
                    <span className="font-mono text-emerald-400 tabular-nums">
                      {formatRp(totalExpenditure)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Syarat Pembayaran:</span>
                    <span className="text-slate-300 font-mono">{vendor.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>PIC Sales & Telepon:</span>
                    <span className="text-slate-300">{vendor.contactPerson} ({vendor.phone})</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {currentUser.role === 'admin' && onOpenInflowWithVendor && (
                <div className="mt-4 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onOpenInflowWithVendor(vendor.id)}
                    className="w-full py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    Input Pengiriman DO Baru
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Riwayat DO Pengiriman Vendor Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              RIWAYAT PENGIRIMAN & PENERIMAAN BBM MASUK DARI VENDOR
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar nomor Delivery Order (DO), truk tangki, densitas, dan verifikasi muatan.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
                <th className="py-2.5 px-3">NO DO / TRX</th>
                <th className="py-2.5 px-3">TANGGAL & JAM</th>
                <th className="py-2.5 px-3">NAMA VENDOR</th>
                <th className="py-2.5 px-3">TANGKI PENERIMA</th>
                <th className="py-2.5 px-3">NO. POLISI TRUK</th>
                <th className="py-2.5 px-3 text-right">HARGA / LITER</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-400">VOLUME MASUK</th>
                <th className="py-2.5 px-3 text-right">TOTAL BIAYA</th>
                <th className="py-2.5 px-3 text-center">STATUS VERIFIKASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions
                .filter((t) => t.type === 'INFLOW')
                .map((trx) => (
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
                    <td className="py-3 px-3 font-sans text-slate-200 font-medium">
                      {trx.vendorName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{trx.tankName}</td>
                    <td className="py-3 px-3 text-slate-400">{trx.deliveryTruckPlate || '-'}</td>
                    <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                      {formatRp(trx.purchasePricePerLiter || 0)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      +{trx.volumeLiters.toLocaleString('id-ID')} L
                    </td>
                    <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                      {formatRp(trx.totalCostRp || trx.volumeLiters * (trx.purchasePricePerLiter || 0))}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          trx.verifiedBySupervisor
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {trx.verifiedBySupervisor ? 'Terverifikasi SPV' : 'Menunggu Validasi'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {selectedVendorForEdit && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Update Harga Beli · {selectedVendorForEdit.name}
              </h3>
              <button
                onClick={() => setSelectedVendorForEdit(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Harga Beli per Liter Baru (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendorForEdit(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
                >
                  Simpan Harga Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
