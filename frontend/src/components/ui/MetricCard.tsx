import type { ReactNode } from 'react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: ReactNode;
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'navy';
}

const accentStyles: Record<string, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
  success: { bg: 'bg-success-50', text: 'text-success-600' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600' },
  danger: { bg: 'bg-danger-50', text: 'text-danger-600' },
  navy: { bg: 'bg-navy-50', text: 'text-navy-600' },
};

export function MetricCard({ label, value, sublabel, icon, accent = 'brand' }: MetricCardProps) {
  const s = accentStyles[accent];
  return (
    <Card hover>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-navy-500 uppercase tracking-wide">{label}</span>
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${s.bg} ${s.text}`}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-extrabold text-navy-900">{value}</div>
        {sublabel && <div className="text-xs text-navy-400 mt-1">{sublabel}</div>}
      </div>
    </Card>
  );
}
