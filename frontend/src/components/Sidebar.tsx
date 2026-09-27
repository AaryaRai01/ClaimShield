import {
  LayoutDashboard,
  FileSearch,
  BarChart3,
  Cpu,
  Info,
} from 'lucide-react';

import type { PageKey } from '@/types';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

const NAV_ITEMS: {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'analyze',
    label: 'Analyze Claim',
    icon: FileSearch,
  },
  {
    key: 'insights',
    label: 'Data Insights',
    icon: BarChart3,
  },
  {
    key: 'model',
    label: 'Model Analytics',
    icon: Cpu,
  },
  {
    key: 'about',
    label: 'About Model',
    icon: Info,
  },
];

export function Sidebar({
  current,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-navy-900 text-white flex flex-col">
      <div className="px-5 py-5 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img
              src="/claimshield-favicon.svg"
              alt="ClaimShield"
              className="w-12 h-12 object-contain scale-110"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              ClaimShield
            </h1>

            <p className="text-xs text-navy-300">
              SVM Fraud Classifier
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-navy-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />

          <div>
            <p className="text-xs font-semibold text-white">
              Model Active
            </p>

            <p className="text-[11px] text-navy-400">
              RBF Kernel · v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}