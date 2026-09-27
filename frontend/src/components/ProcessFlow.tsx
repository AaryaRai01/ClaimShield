import { ChevronRight } from 'lucide-react';

interface ProcessFlowProps {
  steps: string[];
}

export function ProcessFlow({ steps }: ProcessFlowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isFinal = isLast && step.includes('Normal');
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                isFinal
                  ? 'bg-navy-900 text-white'
                  : i === steps.length - 1
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-navy-700 border border-slate-200'
              }`}
            >
              {step}
            </div>
            {!isLast && <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
