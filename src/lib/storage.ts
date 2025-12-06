// Local Storage utilities for Machining Hub

const STORAGE_PREFIX = 'machining_hub_';

export interface CalculationHistory {
  id: string;
  type: string;
  inputs: Record<string, number>;
  results: Record<string, number>;
  timestamp: number;
}

export interface ExperimentalData {
  id: string;
  type: 'kienzle' | 'taylor';
  dataPoints: Array<{ x: number; y: number }>;
  coefficients: Record<string, number>;
  rSquared: number;
  timestamp: number;
}

// Save calculation to history
export function saveCalculation(calculation: Omit<CalculationHistory, 'id' | 'timestamp'>): void {
  const history = getCalculationHistory();
  const newEntry: CalculationHistory = {
    ...calculation,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  // Keep only last 100 calculations
  const trimmed = history.slice(0, 100);
  localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(trimmed));
}

// Get calculation history
export function getCalculationHistory(): CalculationHistory[] {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}history`);
  return stored ? JSON.parse(stored) : [];
}

// Clear calculation history
export function clearCalculationHistory(): void {
  localStorage.removeItem(`${STORAGE_PREFIX}history`);
}

// Save experimental data
export function saveExperimentalData(data: Omit<ExperimentalData, 'id' | 'timestamp'>): void {
  const allData = getExperimentalData();
  const newEntry: ExperimentalData = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  allData.unshift(newEntry);
  localStorage.setItem(`${STORAGE_PREFIX}experimental`, JSON.stringify(allData.slice(0, 50)));
}

// Get experimental data
export function getExperimentalData(): ExperimentalData[] {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}experimental`);
  return stored ? JSON.parse(stored) : [];
}

// Save last used inputs for a calculator
export function saveLastInputs(calculatorId: string, inputs: Record<string, number>): void {
  localStorage.setItem(`${STORAGE_PREFIX}inputs_${calculatorId}`, JSON.stringify(inputs));
}

// Get last used inputs for a calculator
export function getLastInputs(calculatorId: string): Record<string, number> | null {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}inputs_${calculatorId}`);
  return stored ? JSON.parse(stored) : null;
}

// Export all data
export function exportAllData(): string {
  const data = {
    history: getCalculationHistory(),
    experimental: getExperimentalData(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

// Import data
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.history) {
      localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(data.history));
    }
    if (data.experimental) {
      localStorage.setItem(`${STORAGE_PREFIX}experimental`, JSON.stringify(data.experimental));
    }
    return true;
  } catch {
    return false;
  }
}
