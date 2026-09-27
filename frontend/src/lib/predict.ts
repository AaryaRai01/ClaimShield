import type { ClaimForm, PredictionResult } from '@/types';

export async function predictClaim(form: ClaimForm): Promise<PredictionResult> {
  const response = await fetch('http://127.0.0.1:8000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      months_as_customer: form.monthsAsCustomer,
      age: form.age,
      policy_annual_premium: form.policyAnnualPremium,
      policy_deductable: form.policyDeductible,
      incident_type: form.incidentType,
      collision_type: form.collisionType,
      incident_severity: form.incidentSeverity,
      incident_hour_of_the_day: form.incidentHour,
      number_of_vehicles_involved: form.numberOfVehicles,
      property_damage: form.propertyDamage.toUpperCase(),
      bodily_injuries: form.bodilyInjuries,
      witnesses: form.numberOfWitnesses,
      police_report_available: form.policeReportAvailable.toUpperCase(),
      total_claim_amount: form.totalClaimAmount,
      vehicle_claim: form.vehicleClaimAmount,
    }),
  });

  if (!response.ok) {
    throw new Error('Prediction request failed');
  }

  const data = await response.json();

  return {
    classification: data.prediction,
    decisionScore: data.fraud_probability,
    riskIndication: Number((data.fraud_probability * 100).toFixed(1)),
    recommendedAction: data.recommended_action,
    summary: form,
  };
}