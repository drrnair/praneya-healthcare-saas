/**
 * Clinical Formatting Utilities
 * Formatting functions for clinical data display
 */

// Format lab values with units and reference ranges
export const formatLabValue = (value: number, unit: string, referenceRange?: { min: number; max: number }) => {
  const formattedValue = `${value} ${unit}`;
  if (referenceRange) {
    return `${formattedValue} (Ref: ${referenceRange.min}-${referenceRange.max} ${unit})`;
  }
  return formattedValue;
};

// Format biometric readings
export const formatBiometricReading = (type: string, value: any, unit: string) => {
  if (type === 'blood_pressure' && typeof value === 'object') {
    return `${value.systolic}/${value.diastolic} ${unit}`;
  }
  return `${value} ${unit}`;
};

// Format medication dosage
export const formatMedicationDosage = (amount: number, unit: string, frequency: string) => {
  return `${amount}${unit} ${frequency.replace('_', ' ')}`;
};

// Format clinical date/time
export const formatClinicalDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
