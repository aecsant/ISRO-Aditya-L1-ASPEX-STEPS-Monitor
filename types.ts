export interface StepsDataPoint {
  timestamp: number; // Unix timestamp
  displayTime: string; // HH:MM:SS
  protonFluxLow: number; // counts/s (Simulated 20-80 keV)
  protonFluxHigh: number; // counts/s (Simulated >80 keV)
  alphaParticles: number; // counts/s
  electronFlux: number; // counts/s
}

export enum DataStatus {
  CONNECTING = 'CONNECTING',
  LIVE = 'LIVE',
  BUFFERING = 'BUFFERING',
  OFFLINE = 'OFFLINE',
}

export interface SystemHealth {
  instrumentTemp: number; // Celsius
  voltage: number; // Volts
  integrationTime: number; // ms
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
}

export interface AnalysisResult {
  summary: string;
  hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';
  lastUpdated: string;
}