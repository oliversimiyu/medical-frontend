// Privacy utilities for masking sensitive data

export const maskPatientId = (id: string): string => {
  if (id.length <= 4) return '****';
  return '****' + id.slice(-4);
};

export const maskProviderId = (id: string): string => {
  if (id.length <= 3) return '***';
  return id.slice(0, 3) + '***';
};

export const maskPartial = (value: string, visibleChars: number = 4): string => {
  if (value.length <= visibleChars) return '*'.repeat(value.length);
  return '*'.repeat(value.length - visibleChars) + value.slice(-visibleChars);
};

export const isSensitiveField = (fieldName: string): boolean => {
  const sensitiveFields = ['patientId', 'ssn', 'dob', 'address', 'phone', 'email'];
  return sensitiveFields.some(field => 
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
};
