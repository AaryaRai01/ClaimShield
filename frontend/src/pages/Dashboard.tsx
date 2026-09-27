import { useEffect, useState } from 'react';

import {
  Database,
  Cpu,
  ListChecks,
  Target,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import { Card, SectionHeader } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/PageHeader';
import { getDashboardData } from '@/lib/api';
import type { PageKey } from '@/types';

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

interface DashboardData {
  rows: number;
  columns: number;
  selected_features: number;
  accuracy: number;
  normal_count: number;
  fraud_count: number;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const result = await getDashboardData();

        setData(result);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data from the backend.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-navy-600">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Dashboard data unavailable.'}
        </div>
      </div>
    );
  }

  const fraudDistribution = [
    {
      name: 'Normal',
      value: data.normal_count,
      color: '#16a34a',
    },
    {
      name: 'Fraud Reported',
      value: data.fraud_count,
      color: '#dc2626',
    },
  ];

  return (
    <div>
      <PageHeader
        title="ClaimShield Dashboard"
        subtitle="AI-Assisted Insurance Claim Risk Screening"
      />

      <Card className="mb-6">
        <div className="p-6 flex flex-col lg:flex-row items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy-900">
              SVM-Based Insurance Claim Fraud Pattern Classifier
            </h3>

            <p className="text-sm text-navy-600 mt-1 leading-relaxed max-w-3xl">
              ClaimShield analyzes claim characteristics using a Support Vector
              Machine trained on{' '}
              <span className="font-semibold text-navy-800">
                {data.rows.toLocaleString()} historical claims
              </span>{' '}
              to identify patterns that may require additional review. The
              system does not accuse any customer of fraud — it flags claims
              whose feature profile resembles known suspicious patterns so
              analysts can prioritize manual review.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Historical Claims"
          value={data.rows.toLocaleString()}
          sublabel="Training + test data"
          icon={<Database className="w-5 h-5" />}
          accent="navy"
        />

        <MetricCard
          label="Model"
          value="SVM"
          sublabel="Support Vector Machine"
          icon={<Cpu className="w-5 h-5" />}
          accent="brand"
        />

        <MetricCard
          label="Selected Features"
          value={data.selected_features}
          sublabel={`From ${data.columns} original columns`}
          icon={<ListChecks className="w-5 h-5" />}
          accent="success"
        />

        <MetricCard
          label="Test Accuracy"
          value={`${(data.accuracy * 100).toFixed(1)}%`}
          sublabel="RBF Kernel — selected model"
          icon={<Target className="w-5 h-5" />}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-1">
          <div className="p-5">
            <SectionHeader
              title="Normal vs Fraud-Reported"
              subtitle={`Distribution across ${data.rows.toLocaleString()} claims`}
            />

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fraudDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {fraudDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <SectionHeader
                title="Live Claim Screening"
                subtitle="Run a claim through the trained RBF SVM model"
              />

              <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-600 text-white flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-navy-900">
                      Real-Time Claim Classification
                    </h4>

                    <p className="text-sm text-navy-600 mt-1 leading-relaxed">
                      Enter claim details and run them through the same trained
                      preprocessing pipeline and RBF SVM model used during
                      evaluation. ClaimShield returns the claim classification,
                      fraud probability, and recommended review action.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-navy-400">
                    Input
                  </p>

                  <p className="text-sm font-bold text-navy-800 mt-1">
                    15 Claim Features
                  </p>

                  <p className="text-xs text-navy-500 mt-1">
                    Policy, incident, evidence and financial details
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-navy-400">
                    Model
                  </p>

                  <p className="text-sm font-bold text-navy-800 mt-1">
                    RBF SVM
                  </p>

                  <p className="text-xs text-navy-500 mt-1">
                    Selected after kernel comparison
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-navy-400">
                    Output
                  </p>

                  <p className="text-sm font-bold text-navy-800 mt-1">
                    Risk Screening
                  </p>

                  <p className="text-xs text-navy-500 mt-1">
                    Normal or potentially suspicious
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate('analyze')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors"
              >
                Analyze a Claim
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}