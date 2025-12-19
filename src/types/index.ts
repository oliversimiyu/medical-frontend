// Core data types for the Medical Insurance Fraud Detection Platform

export interface Claim {
  // Basic Claim Info
  id: string;
  claimDate: string;
  amount: number;
  claimType: 'inpatient' | 'outpatient';
  
  // Patient Reference
  patientId: string;
  
  // Provider Reference
  providerId: string;
  doctorName?: string;
  
  // Medical Details
  procedureId: string;
  diagnosisCode: string; // ICD-10
  numberOfProcedures?: number;
  diagnosisRelatedGroup?: string;
  
  // Dates (for inpatient)
  admissionDate?: string;
  dischargeDate?: string;
  serviceDate?: string; // for outpatient
  
  // Fraud Detection
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'suspicious' | 'cleared';
  flags: string[];
}

export interface Patient {
  id: string;
  
  // Demographic Attributes
  age: number;
  gender: string;
  county: string;
  residenceType: 'urban' | 'rural';
  maritalStatus: string;
  employmentStatus: string;
  incomeCategory: string;
  
  // Health Status Attributes
  chronicConditions: string[]; // ICD-10 Codes
  numberOfChronicConditions: number;
  diseaseSeverityIndex: number;
  comorbidities: string[];
  riskCategory: 'low' | 'moderate' | 'high';
  
  // Utilization Behavior
  numberOfClaims: number;
  totalClaimAmount: number;
  averageClaimValue: number;
  frequencyOfVisitsMonthly: number;
  frequencyOfVisitsAnnually: number;
  numberOfProvidersVisited: number;
  referralCount: number;
  visitTypes: { inpatient: number; outpatient: number };
  
  // Temporal Patterns
  claimSeasonality: string;
  timeBetweenVisits: number; // days
  timeSinceLastClaim: number; // days
  
  // Network Attributes
  numberOfLinkedProviders: number;
  numberOfLinkedInsuranceAgents: number;
  commonProviderAgentPairs: Array<{ providerId: string; agentId: string }>;
  
  // Derived Features
  claimToDiagnosisRatio: number;
  costPerChronicCondition: number;
  treatmentDiversityIndex: number;
  fraudPropensityScore: number;
}

export interface Provider {
  id: string;
  facilityName: string;
  facilityType: 'clinic' | 'hospital' | 'pharmacy';
  county: string;
  town: string;
  ownershipType: 'private' | 'public';
  numberOfClaimsSubmitted: number;
  averageClaimAmount: number;
  claimFrequencyPerMonth: number;
  numberOfUniquePatients: number;
  numberOfUniqueInsuranceAgents: number;
  claimRejectionRate: number;
  fraudLabel: boolean; // Binary fraud classification
}

export interface InsuranceAgent {
  id: string;
  providerId: string;
  claimId: string;
  approvalDate: string;
  approvalStatus: 'approved' | 'rejected' | 'pending';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'patient' | 'provider' | 'claim';
  suspicious: boolean;
  data?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  claimId?: string;
}

export interface UploadHistory {
  id: string;
  filename: string;
  uploadDate: string;
  recordCount: number;
  status: 'success' | 'failed' | 'processing';
}

export interface InvestigationNote {
  id: string;
  claimId: string;
  note: string;
  author: string;
  timestamp: string;
}
