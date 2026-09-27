import {
  Database,
  Layers,
  GitBranch,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Server,
  Monitor,
  FileSpreadsheet,
  BrainCircuit,
} from 'lucide-react';

import { Card, SectionHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/PageHeader';

const SELECTED_FEATURES = [
  'months_as_customer',
  'age',
  'policy_annual_premium',
  'policy_deductable',
  'incident_type',
  'collision_type',
  'incident_severity',
  'incident_hour_of_the_day',
  'number_of_vehicles_involved',
  'property_damage',
  'bodily_injuries',
  'witnesses',
  'police_report_available',
  'total_claim_amount',
  'vehicle_claim',
];

const PIPELINE_STEPS = [
  {
    title: 'Dataset Loading',
    desc: 'Load insurance_claims.csv containing 1,000 historical insurance claim records and 40 original columns.',
  },
  {
    title: 'Missing Value Handling',
    desc: 'Replace "?" placeholders with missing values. Numeric fields use median imputation, while categorical fields use most-frequent imputation.',
  },
  {
    title: 'Feature Selection',
    desc: 'Select 15 claim-related attributes used for classification while excluding identifiers and fields not required by the live prediction form.',
  },
  {
    title: 'Categorical Encoding',
    desc: 'Convert categorical attributes such as incident type, severity, collision type and report availability using OneHotEncoder.',
  },
  {
    title: 'Numerical Scaling',
    desc: 'Standardize numerical attributes with StandardScaler so features operate on comparable scales for SVM training.',
  },
  {
    title: 'Train / Test Split',
    desc: 'Perform a stratified 80/20 split, producing 800 training records and 200 held-out test records while preserving class distribution.',
  },
  {
    title: 'SVM Kernel Training',
    desc: 'Train and compare Linear, Polynomial and RBF Support Vector Machine classifiers using the same preprocessing pipeline.',
  },
  {
    title: 'Model Evaluation',
    desc: 'Evaluate each kernel using accuracy, precision, recall, F1 score, ROC-AUC, ROC curve and confusion matrix.',
  },
  {
    title: 'Model Selection',
    desc: 'RBF SVM is selected using F1 score as the primary metric and ROC-AUC as the tie-breaker, producing an ROC-AUC of 0.814.',
  },
  {
    title: 'Deployment',
    desc: 'Save the complete preprocessing + RBF SVM pipeline as claimshield_svm.joblib and serve predictions through FastAPI.',
  },
];

const ARCHITECTURE = [
  {
    title: 'CSV Dataset',
    subtitle: 'insurance_claims.csv',
    icon: FileSpreadsheet,
  },
  {
    title: 'ML Pipeline',
    subtitle: 'Cleaning + Encoding + Scaling',
    icon: GitBranch,
  },
  {
    title: 'RBF SVM',
    subtitle: 'Classification Model',
    icon: BrainCircuit,
  },
  {
    title: 'FastAPI',
    subtitle: 'Backend API',
    icon: Server,
  },
  {
    title: 'React UI',
    subtitle: 'Live Claim Screening',
    icon: Monitor,
  },
];

export function AboutModel() {
  return (
    <div>
      <PageHeader
        title="About Model"
        subtitle="Architecture, machine learning pipeline, dataset, and SVM methodology"
      />

      {/* ARCHITECTURE */}
      <Card className="mb-4">
        <div className="p-5">
          <SectionHeader
            title="System Architecture"
            subtitle="End-to-end flow from insurance data to live claim screening"
            icon={<GitBranch className="w-5 h-5" />}
          />

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 mt-5">
            {ARCHITECTURE.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex flex-1 items-center gap-2"
                >
                  <div className="flex-1 min-w-0 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg bg-brand-50 text-brand-600 mb-2">
                      <Icon className="w-5 h-5" />
                    </div>

                    <p className="text-sm font-bold text-navy-900">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-navy-500 mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {index < ARCHITECTURE.length - 1 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-navy-300 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 bg-brand-50 border border-brand-100 rounded-lg">
            <p className="text-xs text-navy-600 leading-relaxed">
              ClaimShield follows a complete machine learning application
              architecture: historical claim data is processed through a
              reusable scikit-learn pipeline, classified by the trained RBF
              SVM model, exposed through a FastAPI backend, and consumed by the
              React frontend for real-time claim screening and analytics.
            </p>
          </div>
        </div>
      </Card>

      {/* DATASET + FEATURES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-1">
          <div className="p-5">
            <SectionHeader
              title="Dataset"
              icon={<Database className="w-5 h-5" />}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-xs font-semibold text-navy-500">
                  File
                </span>

                <span className="text-xs font-mono font-bold text-navy-800">
                  insurance_claims.csv
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-extrabold text-navy-900">
                    1,000
                  </p>
                  <p className="text-[10px] text-navy-500 font-semibold uppercase">
                    Rows
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-extrabold text-navy-900">
                    40
                  </p>
                  <p className="text-[10px] text-navy-500 font-semibold uppercase">
                    Columns
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-extrabold text-success-600">
                    753
                  </p>
                  <p className="text-[10px] text-navy-500 font-semibold uppercase">
                    Normal
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-extrabold text-danger-600">
                    247
                  </p>
                  <p className="text-[10px] text-navy-500 font-semibold uppercase">
                    Fraud Reported
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-xs font-semibold text-navy-500">
                  Target
                </span>

                <span className="text-sm font-mono font-bold text-navy-800">
                  fraud_reported
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-xs font-semibold text-navy-500">
                  Train / Test
                </span>

                <span className="text-sm font-bold text-navy-800">
                  80% / 20%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="p-5">
            <SectionHeader
              title="Selected Features"
              subtitle="15 attributes used by the deployed SVM pipeline"
              icon={<Layers className="w-5 h-5" />}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SELECTED_FEATURES.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-brand-100 text-brand-700 text-[10px] font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span
                    className="text-xs font-mono font-semibold text-navy-700 truncate"
                    title={feature}
                  >
                    {feature}
                  </span>

                  <CheckCircle2 className="w-3.5 h-3.5 text-success-500 ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* PIPELINE */}
      <Card className="mb-4">
        <div className="p-5">
          <SectionHeader
            title="Machine Learning Pipeline"
            subtitle="How ClaimShield converts raw insurance data into an SVM prediction"
            icon={<GitBranch className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-4">
            {PIPELINE_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-3"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold">
                    {index + 1}
                  </div>

                  {index < PIPELINE_STEPS.length - 1 && (
                    <div className="w-px h-8 bg-slate-200 mt-1" />
                  )}
                </div>

                <div className="pb-4">
                  <h4 className="text-sm font-bold text-navy-800">
                    {step.title}
                  </h4>

                  <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* SVM */}
      <Card>
        <div className="p-5">
          <SectionHeader
            title="Why Support Vector Machine?"
            subtitle="Classification algorithm used by ClaimShield"
            icon={<Cpu className="w-5 h-5" />}
          />

          <p className="text-sm text-navy-600 leading-relaxed max-w-5xl">
            A{' '}
            <span className="font-semibold text-navy-800">
              Support Vector Machine (SVM)
            </span>{' '}
            is a supervised classification algorithm that separates classes
            using a decision boundary with the largest possible margin between
            them. It is suitable for ClaimShield because the dataset contains
            both numerical and categorical claim attributes and the task is a
            binary classification problem: normal versus suspicious claim
            patterns. Kernel functions also allow SVM to model relationships
            that are not perfectly linear.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-navy-800">
                  Linear
                </span>
              </div>

              <p className="text-xs text-navy-500">
                Uses a straight decision boundary and provides a useful
                baseline for comparison.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-navy-800">
                  Polynomial
                </span>
              </div>

              <p className="text-xs text-navy-500">
                Models curved boundaries through polynomial relationships
                between features.
              </p>
            </div>

            <div className="p-3 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-700">
                  RBF — Selected
                </span>
              </div>

              <p className="text-xs text-navy-500">
                Captures nonlinear patterns and achieved the strongest
                tie-broken evaluation result with ROC-AUC 0.814.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}