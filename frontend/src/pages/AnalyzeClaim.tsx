import { useState } from 'react';
import {
  User,
  Car,
  FileText,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/PageHeader';
import { FORM_OPTIONS } from '@/data/modelData';
import { predictClaim } from '@/lib/predict';
import type { ClaimForm, PredictionResult } from '@/types';

const DEFAULT_FORM: ClaimForm = {
  age: 38,
  monthsAsCustomer: 120,
  policyAnnualPremium: 1257,
  policyDeductible: 1000,
  incidentType: 'Single Vehicle Collision',
  collisionType: 'Rear Collision',
  incidentSeverity: 'Minor Damage',
  incidentHour: 14,
  numberOfVehicles: 1,
  propertyDamage: 'No',
  bodilyInjuries: 0,
  numberOfWitnesses: 1,
  policeReportAvailable: 'No',
  totalClaimAmount: 42000,
  vehicleClaimAmount: 35000,
};

export function AnalyzeClaim() {
  const [form, setForm] = useState<ClaimForm>(DEFAULT_FORM);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof ClaimForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await predictClaim(form);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert('Prediction failed. Make sure the FastAPI backend is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setResult(null);
  };

  const isSuspicious = result?.classification === 'Potentially Suspicious';

  return (
    <div>
      <PageHeader title="Analyze Claim" subtitle="Enter claim details to screen for suspicious patterns using the SVM model" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-5">
              <SectionHeader title="Policyholder Details" icon={<User className="w-5 h-5" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Age</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.age}
                    onChange={(e) => update('age', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Months as Customer</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.monthsAsCustomer}
                    onChange={(e) => update('monthsAsCustomer', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Annual Policy Premium ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.policyAnnualPremium}
                    onChange={(e) => update('policyAnnualPremium', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Policy Deductible ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.policyDeductible}
                    onChange={(e) => update('policyDeductible', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <SectionHeader title="Incident Details" icon={<Car className="w-5 h-5" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Incident Type</label>
                  <select className="input-field" value={form.incidentType} onChange={(e) => update('incidentType', e.target.value)}>
                    {FORM_OPTIONS.incidentType.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Collision Type</label>
                  <select className="input-field" value={form.collisionType} onChange={(e) => update('collisionType', e.target.value)}>
                    {FORM_OPTIONS.collisionType.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Incident Severity</label>
                  <select className="input-field" value={form.incidentSeverity} onChange={(e) => update('incidentSeverity', e.target.value)}>
                    {FORM_OPTIONS.incidentSeverity.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Incident Hour (0–23)</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    className="input-field"
                    value={form.incidentHour}
                    onChange={(e) => update('incidentHour', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Number of Vehicles Involved</label>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={form.numberOfVehicles}
                    onChange={(e) => update('numberOfVehicles', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <SectionHeader title="Evidence & Damage" icon={<FileText className="w-5 h-5" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Property Damage</label>
                  <select className="input-field" value={form.propertyDamage} onChange={(e) => update('propertyDamage', e.target.value)}>
                    {FORM_OPTIONS.propertyDamage.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Bodily Injuries</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={form.bodilyInjuries}
                    onChange={(e) => update('bodilyInjuries', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Number of Witnesses</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={form.numberOfWitnesses}
                    onChange={(e) => update('numberOfWitnesses', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Police Report Available</label>
                  <select className="input-field" value={form.policeReportAvailable} onChange={(e) => update('policeReportAvailable', e.target.value)}>
                    {FORM_OPTIONS.policeReportAvailable.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <SectionHeader title="Claim Financials" icon={<DollarSign className="w-5 h-5" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Total Claim Amount ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.totalClaimAmount}
                    onChange={(e) => update('totalClaimAmount', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-field">Vehicle Claim Amount ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.vehicleClaimAmount}
                    onChange={(e) => update('vehicleClaimAmount', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Analyze Claim Risk'}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-navy-700 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          {result ? (
            <ResultCard result={result} isSuspicious={isSuspicious} />
          ) : (
            <Card>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-navy-700">Awaiting Analysis</h3>
                <p className="text-sm text-navy-400 mt-2">
                  Fill in the claim details and click <span className="font-semibold">Analyze Claim Risk</span> to
                  see the SVM classification.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result, isSuspicious }: { result: PredictionResult; isSuspicious: boolean }) {
  const Icon = isSuspicious ? ShieldAlert : ShieldCheck;
  const accentBg = isSuspicious ? 'bg-danger-50' : 'bg-success-50';
  const accentText = isSuspicious ? 'text-danger-600' : 'text-success-600';
  const accentBorder = isSuspicious ? 'border-danger-200' : 'border-success-200';
  const actionIcon = isSuspicious ? AlertTriangle : CheckCircle2;

  const s = result.summary;

  const summaryItems = [
    { label: 'Age', value: `${s.age} yrs` },
    { label: 'Customer Since', value: `${s.monthsAsCustomer} mo` },
    { label: 'Incident Type', value: s.incidentType },
    { label: 'Severity', value: s.incidentSeverity },
    { label: 'Incident Hour', value: `${s.incidentHour}:00` },
    { label: 'Witnesses', value: s.numberOfWitnesses },
    { label: 'Police Report', value: s.policeReportAvailable },
    { label: 'Total Claim', value: `$${s.totalClaimAmount.toLocaleString()}` },
  ];

  return (
    <Card className={`border-2 ${accentBorder}`}>
      <div className="p-5">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${accentBg} mb-4`}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white ${accentText}`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Classification</p>
            <p className={`text-lg font-extrabold ${accentText}`}>{result.classification}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold text-navy-500">Fraud Probability</span>
            <span className="text-sm font-bold text-navy-900 font-mono">
              {(result.decisionScore * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold text-navy-500">Risk Indication</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isSuspicious ? 'bg-danger-500' : 'bg-success-500'}`}
                  style={{ width: `${result.riskIndication}%` }}
                />
              </div>
              <span className="text-sm font-bold text-navy-900 font-mono">{result.riskIndication}%</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${accentBg}`}>
            {(() => {
              const ActionIcon = actionIcon;
              return <ActionIcon className={`w-5 h-5 ${accentText} flex-shrink-0`} />;
            })()}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Recommended Action</p>
              <p className={`text-sm font-bold ${accentText}`}>{result.recommendedAction}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-navy-600 uppercase tracking-wide mb-3">Claim Summary</p>
          <div className="grid grid-cols-2 gap-2">
            {summaryItems.map((item, i) => (
              <div key={i} className="text-xs">
                <span className="text-navy-400">{item.label}</span>
                <p className="font-semibold text-navy-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-navy-400 mt-4 leading-relaxed">
          This screening is advisory only. It does not constitute a fraud accusation. Claims flagged
          as suspicious should be reviewed by a trained analyst before any determination is made.
        </p>
      </div>
    </Card>
  );
}
