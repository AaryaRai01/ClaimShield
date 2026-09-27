export type PageKey =
  | 'dashboard'
  | 'analyze'
  | 'insights'
  | 'model'
  | 'about';

export interface ClaimForm {
  age: number;
  monthsAsCustomer: number;
  policyAnnualPremium: number;
  policyDeductible: number;
  incidentType: string;
  collisionType: string;
  incidentSeverity: string;
  incidentHour: number;
  numberOfVehicles: number;
  propertyDamage: string;
  bodilyInjuries: number;
  numberOfWitnesses: number;
  policeReportAvailable: string;
  totalClaimAmount: number;
  vehicleClaimAmount: number;
}

export type Classification = 'Normal' | 'Potentially Suspicious';

export interface PredictionResult {
  classification: Classification;
  decisionScore: number;
  riskIndication: number;
  recommendedAction: string;
  summary: ClaimForm;
}

export interface KernelMetric {
  kernel: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
}

export interface ConfusionMatrixData {
  actualNormal: number;
  actualFraud: number;
  predictedNormal: number;
  predictedFraud: number;
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}
