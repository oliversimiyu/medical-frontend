// Core data types for the Medical Insurance Fraud Detection Platform

export interface Claim {
  id: string;
  patientId: string;
  providerId: string;
  claimDate: string;
  amount: number;
  procedureCode: string;
  diagnosis: string;
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'suspicious' | 'cleared';
  flags: string[];
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

export interface Patient {
  id: string;
  age: number;
  gender: string;
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
