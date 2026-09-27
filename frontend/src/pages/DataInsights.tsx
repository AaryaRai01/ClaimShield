import { useEffect, useState } from 'react';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Grid3x3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { Card, SectionHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/PageHeader';
import { getInsights } from '@/lib/api';

const tooltipStyle = {
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
};

function heatColor(v: number): string {
  const intensity = Math.abs(v);

  if (v >= 0) {
    const r = Math.round(220 + intensity * 35);
    const g = Math.round(238 - intensity * 50);
    const b = Math.round(238 - intensity * 80);
    return `rgb(${r}, ${g}, ${b})`;
  }

  return `rgb(
    ${Math.round(238 - intensity * 50)},
    ${Math.round(238 - intensity * 20)},
    ${Math.round(220 + intensity * 35)}
  )`;
}

interface FraudDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface ClaimAmountItem {
  range: string;
  normal: number;
  fraud: number;
}

interface SeverityItem {
  severity: string;
  fraudRate: number;
  normalRate: number;
}

interface InsightsData {
  fraud_distribution: FraudDistributionItem[];
  claim_amount_by_class: ClaimAmountItem[];
  fraud_rate_by_severity: SeverityItem[];
  correlation_features: string[];
  correlation_matrix: number[][];
}

export function DataInsights() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);

        const result = await getInsights();

        setData(result);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Unable to load data insights from the backend.');
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-navy-600">
        Loading data insights...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Data insights unavailable.'}
        </div>
      </div>
    );
  }

  const FRAUD_DISTRIBUTION = data.fraud_distribution;
  const CLAIM_AMOUNT_BY_CLASS = data.claim_amount_by_class;
  const FRAUD_RATE_BY_SEVERITY = data.fraud_rate_by_severity;
  const CORRELATION_MATRIX = data.correlation_matrix;
  const CORRELATION_FEATURES = data.correlation_features;

  const totalClaims = FRAUD_DISTRIBUTION.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div>
      <PageHeader
        title="Data Insights"
        subtitle="Key visualizations generated from the insurance_claims.csv dataset"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-5">
            <SectionHeader
              title="Fraud Class Distribution"
              subtitle={`Normal vs Fraud-Reported across ${totalClaims.toLocaleString()} claims`}
              icon={<PieChartIcon className="w-5 h-5" />}
            />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FRAUD_DISTRIBUTION}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    labelLine={false}
                  >
                    {FRAUD_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

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

        <Card>
          <div className="p-5">
            <SectionHeader
              title="Claim Amount Distribution by Fraud Class"
              subtitle="Count of claims per amount range, split by class"
              icon={<BarChart3 className="w-5 h-5" />}
            />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CLAIM_AMOUNT_BY_CLASS}
                  margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />

                  <Bar
                    dataKey="normal"
                    name="Normal"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="fraud"
                    name="Fraud Reported"
                    fill="#dc2626"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <SectionHeader
              title="Fraud Rate by Incident Severity"
              subtitle="Percentage of fraud-reported claims per severity level"
              icon={<TrendingUp className="w-5 h-5" />}
            />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FRAUD_RATE_BY_SEVERITY}
                  layout="vertical"
                  margin={{ top: 10, right: 20, bottom: 0, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    unit="%"
                    domain={[0, 100]}
                  />

                  <YAxis
                    dataKey="severity"
                    type="category"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={110}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />

                  <Bar
                    dataKey="fraudRate"
                    name="Fraud Rate"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <SectionHeader
              title="Feature Correlation Heatmap"
              subtitle="Pearson correlation across key numerical features"
              icon={<Grid3x3 className="w-5 h-5" />}
            />

            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `120px repeat(${CORRELATION_FEATURES.length}, 1fr)`,
                  }}
                >
                  <div />

                  {CORRELATION_FEATURES.map((feature) => (
                    <div
                      key={feature}
                      className="text-[10px] text-navy-500 font-semibold text-center px-1 py-1 truncate"
                      title={feature}
                    >
                      {feature.length > 10
                        ? `${feature.slice(0, 8)}..`
                        : feature}
                    </div>
                  ))}

                  {CORRELATION_MATRIX.map((row, i) => (
                    <div key={i} className="contents">
                      <div
                        className="text-[10px] text-navy-600 font-semibold flex items-center pr-2 truncate"
                        title={CORRELATION_FEATURES[i]}
                      >
                        {CORRELATION_FEATURES[i].length > 12
                          ? `${CORRELATION_FEATURES[i].slice(0, 10)}..`
                          : CORRELATION_FEATURES[i]}
                      </div>

                      {row.map((value, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-center text-[9px] font-mono font-semibold m-0.5 rounded h-8"
                          style={{
                            backgroundColor: heatColor(value),
                            color:
                              Math.abs(value) > 0.6
                                ? '#ffffff'
                                : '#334e68',
                          }}
                          title={`${CORRELATION_FEATURES[i]} × ${CORRELATION_FEATURES[j]}: ${value.toFixed(2)}`}
                        >
                          {value.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3 text-[10px] text-navy-400">
                  <span>-1.0</span>

                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{
                      background:
                        'linear-gradient(to right, rgb(188,238,255), rgb(238,238,238), rgb(255,188,188))',
                    }}
                  />

                  <span>+1.0</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}