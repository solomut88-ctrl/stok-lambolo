export type UserRole = 'supervisor' | 'admin' | 'operator';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  badgeNumber: string;
  avatarUrl?: string;
}

export type UnitType = 'LV' | 'EXCA' | 'DT' | 'GENSET' | 'DOZER' | 'GRADER' | 'FUEL_TRUCK' | 'OTHER';

export interface UnitMaster {
  id: string; // e.g. 'UNIT-01'
  code: string; // 'UNIT-01'
  name: string; // 'LV Hilux 4x4'
  type: UnitType;
  plateNumber: string;
  department: string;
  currentHM: number; // Hour Meter / Odometer (km or hours)
  lastServiceHM: number;
  serviceIntervalHM: number; // e.g., every 250 HM
  totalConsumptionLiters: number;
  burnRatePerHour: number; // e.g., 8.5 L/hr
  assignedDriver: string;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE_DUE' | 'IN_SHOP';
}

export interface Tank {
  id: string;
  code: string;
  name: string; // e.g. 'Tangki MPR / IMN', 'Tangki Kotak COR II', 'Tangki Tabung COR II'
  capacityLiters: number;
  currentStockLiters: number;
  minBufferLiters: number;
  type: 'STATIONARY' | 'MOBILE' | 'CYLINDRICAL' | 'RECTANGULAR';
  lastSoundingTime: string;
  soundingHeightCm: number;
  density: number; // e.g., 0.835 kg/L
  temperatureC: number;
}

export interface Contractor {
  id: string;
  code: string; // 'KTR-01'
  name: string; // 'PT MKG'
  picName: string;
  contactNumber: string;
  totalBorrowedLiters: number; // PEMINJAMAN
  totalReturnedLiters: number; // PENGEMBALIAN
  netLoanLiters: number; // TOTAL PEMINJAMAN NETTO
  creditLimitLiters: number;
  status: 'ACTIVE' | 'WARNING' | 'SUSPENDED';
}

export interface Vendor {
  id: string;
  code: string; // 'VND-01'
  name: string; // 'PT Pertamina Patra Niaga'
  brandProduct: string; // 'Solar B35 Industri'
  contactPerson: string;
  phone: string;
  currentPricePerLiter: number;
  lastPurchasePrice: number;
  totalSuppliedLiters: number;
  averageLeadTimeDays: number;
  paymentTerms: string;
  rating: number; // 1-5
}

export type TransactionType = 'INFLOW' | 'OUTFLOW_INTERNAL' | 'LOAN_CONTRACTOR' | 'RETURN_CONTRACTOR' | 'SOUNDING_ADJUSTMENT';

export interface FuelTransaction {
  id: string;
  transactionNumber: string; // e.g. 'TRX-202610-001'
  timestamp: string; // ISO string
  type: TransactionType;
  volumeLiters: number;
  tankId: string;
  tankName: string;
  
  // Specific for INFLOW
  vendorId?: string;
  vendorName?: string;
  doNumber?: string; // Delivery Order
  purchasePricePerLiter?: number;
  totalCostRp?: number;
  deliveryTruckPlate?: string;
  driverVendor?: string;
  densityObserved?: number;

  // Specific for OUTFLOW & Operator logging
  unitId?: string;
  unitCode?: string;
  unitName?: string;
  unitType?: UnitType;
  driverName?: string;
  departmentOrContractor?: string;
  hourMeterOrKM?: number;
  dispenserNozzle?: string;

  // Specific for CONTRACTOR LOAN / RETURN
  contractorId?: string;
  contractorName?: string;
  loanSlipNumber?: string;
  purpose?: string;

  // Audit & Verification
  recordedByRole: UserRole;
  recordedByName: string;
  verifiedBySupervisor: boolean;
  verifiedAt?: string;
  verifiedByName?: string;
  supervisorNotes?: string;
  needsReviewReason?: string;
}

export interface ServiceAlert {
  id: string;
  unitId: string;
  unitCode: string;
  unitName: string;
  type: 'SERVICE_OVERDUE' | 'CRITICAL_STOCK' | 'LOAN_OVERDUE' | 'VARIANCE_SPIKE' | 'UNUSUAL_CONSUMPTION';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface OperationalSummary {
  totalCapacity: number; // 130,000 L
  initialStock: number; // 10,000 L
  totalInflow: number; // 100,000 L
  totalOutflowMPR: number; // 800 L
  totalOutflowContractor: number; // 200 L
  netLoanContractor: number; // 50 L
  currentPhysicalStock: number; // 109,000 L
  stockStatus: 'STOK AMAN' | 'STOK WASPADA' | 'STOK KRITIS';
  stockPercentage: number;
  weightedAveragePricePerLiter: number;
  varianceVolumeLiters: number; // Loss/gain vs theoretical
}
