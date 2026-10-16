import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Tank,
  Contractor,
  UnitMaster,
  Vendor,
  FuelTransaction,
  ServiceAlert,
  OperationalSummary,
  UnitType,
} from '../types/fuel';
import {
  INITIAL_USERS,
  INITIAL_TANKS,
  INITIAL_CONTRACTORS,
  INITIAL_UNITS,
  INITIAL_VENDORS,
  INITIAL_TRANSACTIONS,
  INITIAL_ALERTS,
} from '../data/initialData';

interface FuelContextType {
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  users: UserProfile[];
  
  tanks: Tank[];
  contractors: Contractor[];
  units: UnitMaster[];
  vendors: Vendor[];
  transactions: FuelTransaction[];
  alerts: ServiceAlert[];
  
  summary: OperationalSummary;
  
  // Actions
  addInflow: (data: {
    vendorId: string;
    doNumber: string;
    volumeLiters: number;
    purchasePricePerLiter: number;
    tankId: string;
    deliveryTruckPlate: string;
    driverVendor: string;
    densityObserved?: number;
    notes?: string;
  }) => void;

  addOutflow: (data: {
    unitId?: string;
    customUnitCode?: string;
    customUnitName?: string;
    unitType: UnitType;
    driverName: string;
    departmentOrContractor: string;
    volumeLiters: number;
    tankId: string;
    hourMeterOrKM?: number;
    dispenserNozzle: string;
    isContractor: boolean;
  }) => void;

  addContractorLoan: (data: {
    contractorId: string;
    volumeLiters: number;
    tankId: string;
    loanSlipNumber: string;
    purpose: string;
  }) => void;

  addContractorReturn: (data: {
    contractorId: string;
    volumeLiters: number;
    tankId: string;
    returnSlipNumber: string;
    purpose: string;
  }) => void;

  verifyTransaction: (transactionId: string, supervisorNotes?: string) => void;
  batchVerifyPending: () => void;
  resolveAlert: (alertId: string) => void;
  recordServiceCompleted: (unitId: string, currentHM: number) => void;
  resetToDefaultData: () => void;
  exportToCSV: () => void;
  triggerManualSounding: (tankId: string, heightCm: number, density: number, tempC: number) => void;
}

const FuelContext = createContext<FuelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TANKS: 'petrotrack_tanks_v1',
  CONTRACTORS: 'petrotrack_contractors_v1',
  UNITS: 'petrotrack_units_v1',
  VENDORS: 'petrotrack_vendors_v1',
  TRANSACTIONS: 'petrotrack_transactions_v1',
  ALERTS: 'petrotrack_alerts_v1',
  CURRENT_ROLE: 'petrotrack_current_role_v1',
};

export const FuelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    return (saved as UserRole) || 'supervisor';
  });

  const [tanks, setTanks] = useState<Tank[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TANKS);
    return saved ? JSON.parse(saved) : INITIAL_TANKS;
  });

  const [contractors, setContractors] = useState<Contractor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRACTORS);
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTORS;
  });

  const [units, setUnits] = useState<UnitMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNITS);
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [transactions, setTransactions] = useState<FuelTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [alerts, setAlerts] = useState<ServiceAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Current active user profile
  const currentUser = INITIAL_USERS.find((u) => u.role === currentUserRole) || INITIAL_USERS[0];

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TANKS, JSON.stringify(tanks));
  }, [tanks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(contractors));
  }, [contractors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  // Check and trigger routine maintenance alerts based on Unit HM and fuel consumption
  useEffect(() => {
    units.forEach((unit) => {
      const hoursSinceService = unit.currentHM - unit.lastServiceHM;
      if (hoursSinceService >= unit.serviceIntervalHM && unit.status !== 'MAINTENANCE_DUE') {
        // Create an alert if not already present
        const exists = alerts.some((a) => a.unitId === unit.id && a.type === 'SERVICE_OVERDUE' && !a.resolved);
        if (!exists) {
          const newAlert: ServiceAlert = {
            id: `ALT-SRV-${unit.id}-${Date.now()}`,
            unitId: unit.id,
            unitCode: unit.code,
            unitName: unit.name,
            type: 'SERVICE_OVERDUE',
            severity: 'CRITICAL',
            title: `Jadwal Servis Rutin Terlampaui (${unit.code})`,
            message: `${unit.name} telah beroperasi selama ${hoursSinceService} HM sejak servis terakhir (Batas interval ${unit.serviceIntervalHM} HM). Diperlukan penggantian filter solar & oli segera!`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            resolved: false,
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }
    });
  }, [units]);

  // Calculate Operational Summary
  const initialStock = 10000;
  const totalCapacity = 130000;

  // Inflow total
  const totalInflow = transactions
    .filter((t) => t.type === 'INFLOW')
    .reduce((sum, t) => sum + t.volumeLiters, 0);

  // Outflow MPR
  const totalOutflowMPR = transactions
    .filter(
      (t) =>
        t.type === 'OUTFLOW_INTERNAL' &&
        (!t.departmentOrContractor || !t.departmentOrContractor.toLowerCase().includes('kontraktor'))
    )
    .reduce((sum, t) => sum + t.volumeLiters, 0);

  // Outflow Kontraktor (direct consumption or dispensed)
  const totalOutflowContractor = transactions
    .filter(
      (t) =>
        t.type === 'OUTFLOW_INTERNAL' &&
        t.departmentOrContractor &&
        t.departmentOrContractor.toLowerCase().includes('kontraktor')
    )
    .reduce((sum, t) => sum + t.volumeLiters, 0);

  // Net loan contractor: borrowed - returned
  const totalBorrowed = contractors.reduce((sum, c) => sum + c.totalBorrowedLiters, 0);
  const totalReturned = contractors.reduce((sum, c) => sum + c.totalReturnedLiters, 0);
  const netLoanContractor = Math.max(0, totalBorrowed - totalReturned);

  // Current Physical Stock in tanks
  const currentPhysicalStock = tanks.reduce((sum, t) => sum + t.currentStockLiters, 0);

  const stockPercentage = Math.round((currentPhysicalStock / totalCapacity) * 100);

  let stockStatus: 'STOK AMAN' | 'STOK WASPADA' | 'STOK KRITIS' = 'STOK AMAN';
  if (stockPercentage < 20) {
    stockStatus = 'STOK KRITIS';
  } else if (stockPercentage < 35) {
    stockStatus = 'STOK WASPADA';
  }

  // Weighted average price across vendors
  const totalCostSupplied = transactions
    .filter((t) => t.type === 'INFLOW')
    .reduce((sum, t) => sum + (t.totalCostRp || (t.volumeLiters * (t.purchasePricePerLiter || 0))), 0);

  const weightedAveragePricePerLiter = totalInflow > 0 ? Math.round(totalCostSupplied / totalInflow) : 14965;

  // Variance volume: Theoretical = Initial + Inflow - OutflowMPR - OutflowContractor
  const theoreticalStock = initialStock + totalInflow - totalOutflowMPR - totalOutflowContractor;
  const varianceVolumeLiters = currentPhysicalStock - theoreticalStock;

  const summary: OperationalSummary = {
    totalCapacity,
    initialStock,
    totalInflow,
    totalOutflowMPR,
    totalOutflowContractor,
    netLoanContractor,
    currentPhysicalStock,
    stockStatus,
    stockPercentage,
    weightedAveragePricePerLiter,
    varianceVolumeLiters,
  };

  // ACTIONS

  // 1. Add BBM Masuk (Admin)
  const addInflow: FuelContextType['addInflow'] = ({
    vendorId,
    doNumber,
    volumeLiters,
    purchasePricePerLiter,
    tankId,
    deliveryTruckPlate,
    driverVendor,
    densityObserved = 0.835,
    notes,
  }) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    const tank = tanks.find((t) => t.id === tankId);
    if (!tank || !vendor) return;

    const totalCostRp = volumeLiters * purchasePricePerLiter;

    const newTx: FuelTransaction = {
      id: `TRX-IN-${Date.now()}`,
      transactionNumber: doNumber || `DO-${vendor.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      type: 'INFLOW',
      volumeLiters,
      tankId: tank.id,
      tankName: tank.name,
      vendorId: vendor.id,
      vendorName: vendor.name,
      doNumber,
      purchasePricePerLiter,
      totalCostRp,
      deliveryTruckPlate,
      driverVendor,
      densityObserved,
      recordedByRole: currentUser.role,
      recordedByName: currentUser.name,
      verifiedBySupervisor: false,
      supervisorNotes: notes,
    };

    // Update tank stock
    setTanks((prev) =>
      prev.map((t) => (t.id === tankId ? { ...t, currentStockLiters: t.currentStockLiters + volumeLiters } : t))
    );

    // Update vendor total supplied and current price
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              totalSuppliedLiters: v.totalSuppliedLiters + volumeLiters,
              lastPurchasePrice: purchasePricePerLiter,
              currentPricePerLiter: purchasePricePerLiter,
            }
          : v
      )
    );

    setTransactions((prev) => [newTx, ...prev]);
  };

  // 2. Add BBM Keluar / Dispensing (Operator & Admin)
  const addOutflow: FuelContextType['addOutflow'] = ({
    unitId,
    customUnitCode,
    customUnitName,
    unitType,
    driverName,
    departmentOrContractor,
    volumeLiters,
    tankId,
    hourMeterOrKM,
    dispenserNozzle,
    isContractor,
  }) => {
    const tank = tanks.find((t) => t.id === tankId);
    if (!tank) return;

    const existingUnit = units.find((u) => u.id === unitId);
    const unitCode = existingUnit ? existingUnit.code : customUnitCode || 'UNIT-EXT';
    const unitName = existingUnit ? existingUnit.name : customUnitName || 'Unit Eksternal / Armada';

    const newTx: FuelTransaction = {
      id: `TRX-OUT-${Date.now()}`,
      transactionNumber: `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      type: 'OUTFLOW_INTERNAL',
      volumeLiters,
      tankId: tank.id,
      tankName: tank.name,
      unitId: existingUnit?.id,
      unitCode,
      unitName,
      unitType,
      driverName,
      departmentOrContractor: isContractor ? `${departmentOrContractor} (Kontraktor)` : departmentOrContractor,
      hourMeterOrKM,
      dispenserNozzle,
      recordedByRole: currentUser.role,
      recordedByName: currentUser.name,
      verifiedBySupervisor: false,
    };

    // Deduct stock from tank
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? { ...t, currentStockLiters: Math.max(0, t.currentStockLiters - volumeLiters) }
          : t
      )
    );

    // Update unit consumption & HM if registered unit
    if (existingUnit) {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.id === existingUnit.id) {
            const updatedHM = hourMeterOrKM && hourMeterOrKM > u.currentHM ? hourMeterOrKM : u.currentHM;
            const updatedConsumption = u.totalConsumptionLiters + volumeLiters;
            const hoursOperated = updatedHM - u.lastServiceHM;
            const isDue = hoursOperated >= u.serviceIntervalHM;
            return {
              ...u,
              currentHM: updatedHM,
              totalConsumptionLiters: updatedConsumption,
              assignedDriver: driverName || u.assignedDriver,
              status: isDue ? 'MAINTENANCE_DUE' : 'ACTIVE',
            };
          }
          return u;
        })
      );
    }

    setTransactions((prev) => [newTx, ...prev]);
  };

  // 3. Add Contractor Loan (Admin)
  const addContractorLoan: FuelContextType['addContractorLoan'] = ({
    contractorId,
    volumeLiters,
    tankId,
    loanSlipNumber,
    purpose,
  }) => {
    const contractor = contractors.find((c) => c.id === contractorId);
    const tank = tanks.find((t) => t.id === tankId);
    if (!contractor || !tank) return;

    const newTx: FuelTransaction = {
      id: `TRX-LN-${Date.now()}`,
      transactionNumber: loanSlipNumber || `PINJAM-${contractor.code}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      type: 'LOAN_CONTRACTOR',
      volumeLiters,
      tankId: tank.id,
      tankName: tank.name,
      contractorId: contractor.id,
      contractorName: contractor.name,
      loanSlipNumber,
      purpose,
      recordedByRole: currentUser.role,
      recordedByName: currentUser.name,
      verifiedBySupervisor: false,
    };

    // Deduct tank physical stock
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? { ...t, currentStockLiters: Math.max(0, t.currentStockLiters - volumeLiters) }
          : t
      )
    );

    // Update contractor balance
    setContractors((prev) =>
      prev.map((c) => {
        if (c.id === contractorId) {
          const newBorrowed = c.totalBorrowedLiters + volumeLiters;
          const newNet = newBorrowed - c.totalReturnedLiters;
          return {
            ...c,
            totalBorrowedLiters: newBorrowed,
            netLoanLiters: newNet,
            status: newNet > 0 ? 'WARNING' : 'ACTIVE',
          };
        }
        return c;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
  };

  // 4. Add Contractor Return (Admin)
  const addContractorReturn: FuelContextType['addContractorReturn'] = ({
    contractorId,
    volumeLiters,
    tankId,
    returnSlipNumber,
    purpose,
  }) => {
    const contractor = contractors.find((c) => c.id === contractorId);
    const tank = tanks.find((t) => t.id === tankId);
    if (!contractor || !tank) return;

    const newTx: FuelTransaction = {
      id: `TRX-RT-${Date.now()}`,
      transactionNumber: returnSlipNumber || `KEMBALI-${contractor.code}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      type: 'RETURN_CONTRACTOR',
      volumeLiters,
      tankId: tank.id,
      tankName: tank.name,
      contractorId: contractor.id,
      contractorName: contractor.name,
      loanSlipNumber: returnSlipNumber,
      purpose,
      recordedByRole: currentUser.role,
      recordedByName: currentUser.name,
      verifiedBySupervisor: false,
    };

    // Return to physical stock in tank
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? { ...t, currentStockLiters: t.currentStockLiters + volumeLiters }
          : t
      )
    );

    // Update contractor balance
    setContractors((prev) =>
      prev.map((c) => {
        if (c.id === contractorId) {
          const newReturned = c.totalReturnedLiters + volumeLiters;
          const newNet = Math.max(0, c.totalBorrowedLiters - newReturned);
          return {
            ...c,
            totalReturnedLiters: newReturned,
            netLoanLiters: newNet,
            status: newNet === 0 ? 'ACTIVE' : 'WARNING',
          };
        }
        return c;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
  };

  // 5. Verify Transaction (Supervisor Only)
  const verifyTransaction: FuelContextType['verifyTransaction'] = (transactionId, supervisorNotes) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              verifiedBySupervisor: true,
              verifiedAt: new Date().toISOString(),
              verifiedByName: currentUser.name,
              supervisorNotes: supervisorNotes || tx.supervisorNotes || 'Divalidasi dan disetujui Supervisor.',
            }
          : tx
      )
    );
  };

  const batchVerifyPending: FuelContextType['batchVerifyPending'] = () => {
    setTransactions((prev) =>
      prev.map((tx) =>
        !tx.verifiedBySupervisor
          ? {
              ...tx,
              verifiedBySupervisor: true,
              verifiedAt: new Date().toISOString(),
              verifiedByName: currentUser.name,
              supervisorNotes: 'Verifikasi massal validasi shift harian oleh Supervisor.',
            }
          : tx
      )
    );
  };

  // 6. Maintenance & Alerts
  const resolveAlert: FuelContextType['resolveAlert'] = (alertId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  };

  const recordServiceCompleted: FuelContextType['recordServiceCompleted'] = (unitId, currentHM) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              lastServiceHM: currentHM,
              currentHM,
              status: 'ACTIVE',
            }
          : u
      )
    );

    // Resolve associated alerts
    setAlerts((prev) =>
      prev.map((a) =>
        a.unitId === unitId && a.type === 'SERVICE_OVERDUE' ? { ...a, resolved: true } : a
      )
    );
  };

  // 7. Manual Sounding Tank Calibration
  const triggerManualSounding: FuelContextType['triggerManualSounding'] = (tankId, heightCm, density, tempC) => {
    setTanks((prev) =>
      prev.map((t) => {
        if (t.id === tankId) {
          return {
            ...t,
            soundingHeightCm: heightCm,
            density,
            temperatureC: tempC,
            lastSoundingTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return t;
      })
    );
  };

  // 8. Reset to default data
  const resetToDefaultData = () => {
    setTanks(INITIAL_TANKS);
    setContractors(INITIAL_CONTRACTORS);
    setUnits(INITIAL_UNITS);
    setVendors(INITIAL_VENDORS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAlerts(INITIAL_ALERTS);
    localStorage.removeItem(STORAGE_KEYS.TANKS);
    localStorage.removeItem(STORAGE_KEYS.CONTRACTORS);
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.VENDORS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
  };

  // 9. Export to CSV (Supervisor & Admin)
  const exportToCSV = () => {
    const headers = [
      'No Transaksi',
      'Tanggal/Waktu',
      'Tipe Transaksi',
      'Volume (Liter)',
      'Tangki',
      'Vendor/Kontraktor/Unit',
      'Driver/PIC',
      'Harga/Liter (Rp)',
      'Total Biaya (Rp)',
      'Pencatat (Role)',
      'Status Verifikasi Spv',
      'Catatan Supervisor',
    ];

    const rows = transactions.map((t) => [
      t.transactionNumber,
      new Date(t.timestamp).toLocaleString('id-ID'),
      t.type,
      t.volumeLiters,
      t.tankName,
      t.vendorName || t.contractorName || t.unitName || '-',
      t.driverName || t.driverVendor || '-',
      t.purchasePricePerLiter || '-',
      t.totalCostRp || '-',
      `${t.recordedByName} (${t.recordedByRole})`,
      t.verifiedBySupervisor ? 'Terverifikasi' : 'Belum Diverifikasi',
      t.supervisorNotes || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PetroTrack_Data_Stok_BBM_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FuelContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        users: INITIAL_USERS,
        tanks,
        contractors,
        units,
        vendors,
        transactions,
        alerts,
        summary,
        addInflow,
        addOutflow,
        addContractorLoan,
        addContractorReturn,
        verifyTransaction,
        batchVerifyPending,
        resolveAlert,
        recordServiceCompleted,
        resetToDefaultData,
        exportToCSV,
        triggerManualSounding,
      }}
    >
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) {
    throw new Error('useFuel must be used within a FuelProvider');
  }
  return context;
};
