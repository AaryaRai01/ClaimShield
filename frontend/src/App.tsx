import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { AnalyzeClaim } from '@/pages/AnalyzeClaim';
import { DataInsights } from '@/pages/DataInsights';
import { ModelAnalytics } from '@/pages/ModelAnalytics';
import { AboutModel } from '@/pages/AboutModel';
import type { PageKey } from '@/types';

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar current={page} onNavigate={setPage} />
      <main className="ml-64 p-6 lg:p-8 max-w-7xl">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'analyze' && <AnalyzeClaim />}
        {page === 'insights' && <DataInsights />}
        {page === 'model' && <ModelAnalytics />}
        {page === 'about' && <AboutModel />}
      </main>
    </div>
  );
}

export default App;
