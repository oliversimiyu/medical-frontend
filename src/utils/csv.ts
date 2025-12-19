// CSV utilities for parsing and validation

import Papa from 'papaparse';

// Required columns based on dataset specification
export const REQUIRED_INPATIENT_COLUMNS = [
  'ClaimID',
  'PatientID',
  'ProviderID',
  'AdmissionDate',
  'DischargeDate',
  'ClmDiagnosisCode_1',
  'ClmProcedureCode_1',
  'TotalClaimAmount'
];

export const REQUIRED_OUTPATIENT_COLUMNS = [
  'ClaimID',
  'PatientID',
  'ProviderID',
  'ServiceDate',
  'ClmProcedureCode_1',
  'TotalClaimAmount'
];

export const REQUIRED_CSV_COLUMNS = [
  'ClaimID',
  'PatientID',
  'ProviderID',
  'TotalClaimAmount'
];

export const validateCSVStructure = (headers: string[]): { valid: boolean; errors: string[]; claimType?: 'inpatient' | 'outpatient' } => {
  const errors: string[] = [];
  
  // Detect claim type based on columns
  const hasAdmissionDate = headers.includes('AdmissionDate');
  const hasServiceDate = headers.includes('ServiceDate');
  
  let claimType: 'inpatient' | 'outpatient' | undefined;
  let requiredColumns: string[];
  
  if (hasAdmissionDate) {
    claimType = 'inpatient';
    requiredColumns = REQUIRED_INPATIENT_COLUMNS;
  } else if (hasServiceDate) {
    claimType = 'outpatient';
    requiredColumns = REQUIRED_OUTPATIENT_COLUMNS;
  } else {
    // Fallback to basic validation
    requiredColumns = REQUIRED_CSV_COLUMNS;
  }
  
  const missing = requiredColumns.filter(col => !headers.includes(col));
  
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    claimType
  };
};

// Convert CSV row to Claim object
export const csvRowToClaim = (row: Record<string, string>, claimType: 'inpatient' | 'outpatient'): Record<string, unknown> => {
  const amount = parseFloat(row.TotalClaimAmount) || 0;
  const fraudScore = parseFloat(row.PotentialFraud) || 0;
  
  return {
    id: row.ClaimID,
    claimDate: row.ClaimStartDate || row.ServiceDate || new Date().toISOString().split('T')[0],
    amount,
    claimType,
    patientId: row.PatientID,
    providerId: row.ProviderID,
    doctorName: row.AttendingPhysician,
    procedureId: row.ClmProcedureCode_1,
    diagnosisCode: row.ClmDiagnosisCode_1,
    numberOfProcedures: parseInt(row.NumberOfProcedures) || 1,
    diagnosisRelatedGroup: row.DiagnosisRelatedGroup,
    admissionDate: row.AdmissionDate,
    dischargeDate: row.DischargeDate,
    serviceDate: row.ServiceDate,
    fraudScore,
    riskLevel: fraudScore > 0.7 ? 'high' : fraudScore > 0.4 ? 'medium' : 'low',
    status: 'pending',
    flags: fraudScore > 0.5 ? ['Suspicious Pattern'] : []
  };
};

export const parseCSVFile = (file: File): Promise<{ data: unknown[]; errors: string[]; claimType?: 'inpatient' | 'outpatient' }> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        
        if (results.errors.length > 0) {
          errors.push(...results.errors.map(e => e.message));
        }
        
        const headers = results.meta.fields || [];
        const validation = validateCSVStructure(headers);
        
        if (!validation.valid) {
          errors.push(...validation.errors);
        }
        
        resolve({
          data: results.data,
          errors,
          claimType: validation.claimType
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [error.message]
        });
      }
    });
  });
};

export const validateFileType = (file: File): boolean => {
  return file.name.endsWith('.csv') || file.type === 'text/csv';
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};
