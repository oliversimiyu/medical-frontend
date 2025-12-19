// CSV utilities for parsing and validation

import Papa from 'papaparse';

export const REQUIRED_CSV_COLUMNS = [
  'claimId',
  'patientId',
  'providerId',
  'claimDate',
  'amount',
  'procedureCode',
  'diagnosis'
];

export const validateCSVStructure = (headers: string[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const missing = REQUIRED_CSV_COLUMNS.filter(col => !headers.includes(col));
  
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const parseCSVFile = (file: File): Promise<{ data: unknown[]; errors: string[] }> => {
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
          errors
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
