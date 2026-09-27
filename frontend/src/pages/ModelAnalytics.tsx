import { useEffect, useState } from 'react';
import {
  Target,
  Crosshair,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

import { Card, SectionHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/PageHeader';
import { getModelMetrics } from '@/lib/api';

const tooltipStyle = {
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
};

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
}

interface KernelMetric {
  kernel: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
}

interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

interface RocPoint {
  fpr: number;
  tpr: number;
}

interface ModelAnalyticsData {
  selected_kernel: string;
  metrics: ModelMetrics;
  kernel_metrics: KernelMetric[];
  confusion_matrix: ConfusionMatrix;
  roc_curve: RocPoint[];
  test_size: number;
}

export function ModelAnalytics() {
  const [data, setData] = useState<ModelAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        const result = await getModelMetrics();

        setData(result);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Unable to load model analytics from the backend.');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-navy-600">
        Loading model analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Model analytics unavailable.'}
        </div>
      </div>
    );
  }

  const MODEL_METRICS = data.metrics;
  const KERNEL_METRICS = data.kernel_metrics;
  const CONFUSION_MATRIX = data.confusion_matrix;
  const ROC_CURVE = data.roc_curve;
  const BEST_KERNEL = data.selected_kernel;

  const { tn, fp, fn, tp } = CONFUSION_MATRIX;
  const total = tn + fp + fn + tp;

  const sensitivity =
    tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;

  const specificity =
    tn + fp > 0 ? (tn / (tn + fp)) * 100 : 0;

  const metricCards = [
    {
      label: 'Accuracy',
      value: MODEL_METRICS.accuracy,
      icon: Target,
      accent: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Precision',
      value: MODEL_METRICS.precision,
      icon: Crosshair,
      accent: 'text-success-600 bg-success-50',
    },
    {
      label: 'Recall',
      value: MODEL_METRICS.recall,
      icon: RefreshCw,
      accent: 'text-warning-600 bg-warning-50',
    },
    {
      label: 'F1 Score',
      value: MODEL_METRICS.f1,
      icon: Zap,
      accent: 'text-navy-600 bg-navy-50',
    },
    {
      label: 'ROC-AUC',
      value: MODEL_METRICS.rocAuc,
      icon: Activity,
      accent: 'text-danger-600 bg-danger-50',
    },
  ];

  const kernelBarData = KERNEL_METRICS.map((k) => ({
    kernel: k.kernel.replace(' SVM', ''),
    Accuracy: k.accuracy,
    Precision: k.precision,
    Recall: k.recall,
    'F1 Score': k.f1,
  }));

  const selectedKernelData = KERNEL_METRICS.find(
    (k) => k.kernel === BEST_KERNEL
  );

  return (
    <div>
      <PageHeader
        title="Model Analytics"
        subtitle="Performance metrics, confusion matrix, ROC curve, and kernel comparison"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {metricCards.map((m) => {
          const Icon = m.icon;

          return (
            <Card key={m.label} hover>
              <div className="p-4">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg ${m.accent} mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
                  {m.label}
                </p>

                <p className="text-2xl font-extrabold text-navy-900 mt-1">
                  {(m.value * 100).toFixed(1)}%
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="p-5">
            <SectionHeader
              title="Confusion Matrix"
              subtitle={`${BEST_KERNEL} on ${data.test_size}-claim test set`}
            />

            <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
              <div />

              <div className="text-center text-xs font-bold text-navy-500 pb-1">
                Pred. Normal
              </div>

              <div className="text-center text-xs font-bold text-navy-500 pb-1">
                Pred. Suspicious
              </div>

              <div className="flex items-center text-xs font-bold text-navy-500 pr-2">
                Actual Normal
              </div>

              <div className="flex flex-col items-center justify-center h-24 bg-success-50 border border-success-200 rounded-lg">
                <span className="text-2xl font-extrabold text-success-700">
                  {tn}
                </span>
                <span className="text-[10px] text-success-600 font-semibold">
                  TN
                </span>
              </div>

              <div className="flex flex-col items-center justify-center h-24 bg-danger-50 border border-danger-200 rounded-lg">
                <span className="text-2xl font-extrabold text-danger-700">
                  {fp}
                </span>
                <span className="text-[10px] text-danger-600 font-semibold">
                  FP
                </span>
              </div>

              <div className="flex items-center text-xs font-bold text-navy-500 pr-2">
                Actual Suspicious
              </div>

              <div className="flex flex-col items-center justify-center h-24 bg-danger-50 border border-danger-200 rounded-lg">
                <span className="text-2xl font-extrabold text-danger-700">
                  {fn}
                </span>
                <span className="text-[10px] text-danger-600 font-semibold">
                  FN
                </span>
              </div>

              <div className="flex flex-col items-center justify-center h-24 bg-success-50 border border-success-200 rounded-lg">
                <span className="text-2xl font-extrabold text-success-700">
                  {tp}
                </span>
                <span className="text-[10px] text-success-600 font-semibold">
                  TP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-navy-500 font-semibold uppercase">
                  Sensitivity
                </p>
                <p className="text-sm font-bold text-navy-800">
                  {sensitivity.toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-navy-500 font-semibold uppercase">
                  Specificity
                </p>
                <p className="text-sm font-bold text-navy-800">
                  {specificity.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <SectionHeader
              title="ROC Curve"
              subtitle={`AUC = ${MODEL_METRICS.rocAuc.toFixed(3)}`}
            />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ROC_CURVE}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 0,
                    left: -10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="fpr"
                    type="number"
                    domain={[0, 1]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{
                      value: 'False Positive Rate',
                      position: 'insideBottom',
                      offset: -2,
                      style: {
                        fontSize: 11,
                        fill: '#64748b',
                      },
                    }}
                  />

                  <YAxis
                    domain={[0, 1]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{
                      value: 'True Positive Rate',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        fontSize: 11,
                        fill: '#64748b',
                      },
                    }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => Number(v).toFixed(2)}
                  />

                  <ReferenceLine
                    stroke="#cbd5e1"
                    strokeDasharray="5 5"
                    segment={[
                      { x: 0, y: 0 },
                      { x: 1, y: 1 },
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="tpr"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    name={BEST_KERNEL}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="p-5">
          <SectionHeader
            title="Kernel Performance Comparison"
            subtitle="Linear vs Polynomial vs RBF — best performer is selected"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={kernelBarData}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 0,
                  left: -10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />

                <XAxis
                  dataKey="kernel"
                  tick={{
                    fontSize: 11,
                    fill: '#64748b',
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: '#64748b',
                  }}
                  domain={[0, 1]}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) =>
                    `${(Number(v) * 100).toFixed(1)}%`
                  }
                />

                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />

                <Bar
                  dataKey="Accuracy"
                  fill="#2563eb"
                  radius={[3, 3, 0, 0]}
                />

                <Bar
                  dataKey="Precision"
                  fill="#16a34a"
                  radius={[3, 3, 0, 0]}
                />

                <Bar
                  dataKey="Recall"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                />

                <Bar
                  dataKey="F1 Score"
                  fill="#627d98"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-5">
          <SectionHeader
            title="Kernel Metrics Table"
            subtitle="Detailed scores per kernel — selected model highlighted"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    Kernel
                  </th>

                  <th className="text-right py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    Accuracy
                  </th>

                  <th className="text-right py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    Precision
                  </th>

                  <th className="text-right py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    Recall
                  </th>

                  <th className="text-right py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    F1 Score
                  </th>

                  <th className="text-right py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    ROC-AUC
                  </th>

                  <th className="text-center py-2 px-3 text-xs font-bold text-navy-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {KERNEL_METRICS.map((k) => {
                  const isBest = k.kernel === BEST_KERNEL;

                  return (
                    <tr
                      key={k.kernel}
                      className={`border-b border-slate-100 ${
                        isBest ? 'bg-brand-50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-navy-800">
                        {k.kernel}
                      </td>

                      <td className="text-right py-3 px-3 font-mono text-navy-700">
                        {(k.accuracy * 100).toFixed(1)}%
                      </td>

                      <td className="text-right py-3 px-3 font-mono text-navy-700">
                        {(k.precision * 100).toFixed(1)}%
                      </td>

                      <td className="text-right py-3 px-3 font-mono text-navy-700">
                        {(k.recall * 100).toFixed(1)}%
                      </td>

                      <td className="text-right py-3 px-3 font-mono text-navy-700">
                        {(k.f1 * 100).toFixed(1)}%
                      </td>

                      <td className="text-right py-3 px-3 font-mono text-navy-700">
                        {k.rocAuc.toFixed(3)}
                      </td>

                      <td className="text-center py-3 px-3">
                        {isBest ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Selected
                          </span>
                        ) : (
                          <span className="text-[10px] text-navy-400 font-semibold">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-navy-400 mt-3">
            {BEST_KERNEL} is selected based on the strongest F1 performance
            on the current test split.
            {selectedKernelData && (
              <>
                {' '}
                It achieved an accuracy of{' '}
                {(selectedKernelData.accuracy * 100).toFixed(1)}%, F1 score of{' '}
                {(selectedKernelData.f1 * 100).toFixed(1)}%, and ROC-AUC of{' '}
                {selectedKernelData.rocAuc.toFixed(3)}.
              </>
            )}{' '}
            The test set contains {total} claims.
          </p>
        </div>
      </Card>
    </div>
  );
}