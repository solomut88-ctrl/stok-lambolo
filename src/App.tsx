import React, { useState } from 'react';
import { FuelProvider, useFuel } from './context/FuelContext';
import { Navbar } from './components/Navbar';
import { RoleAccessBanner } from './components/RoleAccessBanner';
import { SummaryMetrics } from './components/SummaryMetrics';
import { TankMonitoringPanel } from './components/TankMonitoringPanel';
import { SlideshowUnitConsumption } from './components/SlideshowUnitConsumption';
import { VendorAnalysisSection } from './components/VendorAnalysisSection';
import { ContractorLoanSection } from './components/ContractorLoanSection';
import { TransactionHistoryTable } from './components/TransactionHistoryTable';
import { OperationalRecommendationsPanel } from './components/OperationalRecommendationsPanel';
import { OperatorDispensingModal } from './components/OperatorDispensingModal';
import { AdminInflowModal } from './components/AdminInflowModal';
import { AdminLoanReturnModal } from './components/AdminLoanReturnModal';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { UnitMaster } from './types/fuel';
import {
  Layers,
  Fuel,
  Building2,
  Truck,
  FileText,
  Lightbulb,
  Plus,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { currentUser, summary } = useFuel();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals state
  const [outflowModalOpen, setOutflowModalOpen] = useState(false);
  const [inflowModalOpen, setInflowModalOpen] = useState(false);
  const [loanReturnModalOpen, setLoanReturnModalOpen] = useState(false);
  const [loanReturnMode, setLoanReturnMode] = useState<'LOAN' | 'RETURN'>('LOAN');
  const [weeklyReportModalOpen, setWeeklyReportModalOpen] = useState(false);

  // Preselection state
  const [preselectedUnit, setPreselectedUnit] = useState<UnitMaster | null>(null);
  const [preselectedContractorId, setPreselectedContractorId] = useState<string | undefined>(undefined);
  const [preselectedVendorId, setPreselectedVendorId] = useState<string | undefined>(undefined);

  const handleQuickDispenseUnit = (unit: UnitMaster) => {
    setPreselectedUnit(unit);
    setOutflowModalOpen(true);
  };

  const handleOpenLoanWithContractor = (contractorId: string) => {
    setPreselectedContractorId(contractorId);
    setLoanReturnMode('LOAN');
    setLoanReturnModalOpen(true);
  };

  const handleOpenReturnWithContractor = (contractorId: string) => {
    setPreselectedContractorId(contractorId);
    setLoanReturnMode('RETURN');
    setLoanReturnModalOpen(true);
  };

  const handleOpenInflowWithVendor = (vendorId: string) => {
    setPreselectedVendorId(vendorId);
    setInflowModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInflowModal={() => {
          setPreselectedVendorId(undefined);
          setInflowModalOpen(true);
        }}
        onOpenOutflowModal={() => {
          setPreselectedUnit(null);
          setOutflowModalOpen(true);
        }}
        onOpenWeeklyReportModal={() => setWeeklyReportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Role Access & Responsibility Banner */}
        <RoleAccessBanner />

        {/* Global Summary Metrics (Always visible or in overview) */}
        <SummaryMetrics />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <TankMonitoringPanel />
            <SlideshowUnitConsumption onQuickDispenseUnit={handleQuickDispenseUnit} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContractorLoanSection
                onOpenLoanModalWithContractor={handleOpenLoanWithContractor}
                onOpenReturnModalWithContractor={handleOpenReturnWithContractor}
              />
              <VendorAnalysisSection onOpenInflowWithVendor={handleOpenInflowWithVendor} />
            </div>
            <TransactionHistoryTable />
            <OperationalRecommendationsPanel
              onOpenWeeklyReportModal={() => setWeeklyReportModalOpen(true)}
              onOpenOutflowModal={() => setOutflowModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'slideshow' && (
          <div className="space-y-6">
            <SlideshowUnitConsumption onQuickDispenseUnit={handleQuickDispenseUnit} />
            <TransactionHistoryTable />
          </div>
        )}

        {activeTab === 'contractors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  MANAJEMEN KONTRAKTOR & PINJAMAN SOLAR
                </h2>
                <p className="text-xs text-slate-400">
                  Pantau saldo peminjaman netto PT MKG, PT FSI, PT MALEO, PT WIJAYA, CV DS.
                </p>
              </div>
              {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLoanReturnMode('LOAN');
                      setLoanReturnModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Pinjaman Baru
                  </button>
                  <button
                    onClick={() => {
                      setLoanReturnMode('RETURN');
                      setLoanReturnModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    + Pengembalian
                  </button>
                </div>
              )}
            </div>
            <ContractorLoanSection
              onOpenLoanModalWithContractor={handleOpenLoanWithContractor}
              onOpenReturnModalWithContractor={handleOpenReturnWithContractor}
            />
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  VENDOR PENYUPLAI BBM & ANALISA HARGA BELI
                </h2>
                <p className="text-xs text-slate-400">
                  PT Pertamina Patra Niaga, PT AKR Corporindo Tbk, PT Petro Andalan Nusantara.
                </p>
              </div>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setPreselectedVendorId(undefined);
                    setInflowModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Input DO Vendor Masuk
                </button>
              )}
            </div>
            <VendorAnalysisSection onOpenInflowWithVendor={handleOpenInflowWithVendor} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionHistoryTable />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <OperationalRecommendationsPanel
              onOpenWeeklyReportModal={() => setWeeklyReportModalOpen(true)}
              onOpenOutflowModal={() => setOutflowModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            BBM Lambolo · Sistem Kontrol Pengeluaran & Peminjaman Stok Solar
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Kapasitas: 130.000 L · Site Lambolo / MPR-IMN
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <OperatorDispensingModal
        isOpen={outflowModalOpen}
        onClose={() => setOutflowModalOpen(false)}
        preselectedUnit={preselectedUnit}
      />

      <AdminInflowModal
        isOpen={inflowModalOpen}
        onClose={() => setInflowModalOpen(false)}
        preselectedVendorId={preselectedVendorId}
      />

      <AdminLoanReturnModal
        isOpen={loanReturnModalOpen}
        onClose={() => setLoanReturnModalOpen(false)}
        defaultMode={loanReturnMode}
        preselectedContractorId={preselectedContractorId}
      />

      <WeeklyReportModal
        isOpen={weeklyReportModalOpen}
        onClose={() => setWeeklyReportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FuelProvider>
      <DashboardContent />
    </FuelProvider>
  );
}
