const API = 'http://127.0.0.1:8000';

export async function getDashboardData() {
  const res = await fetch(`${API}/dashboard`);

  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }

  return res.json();
}

export async function getInsights() {
  const res = await fetch(`${API}/insights`);

  if (!res.ok) {
    throw new Error('Failed to load insights');
  }

  return res.json();
}

export async function getModelMetrics() {
  const res = await fetch(`${API}/metrics`);

  if (!res.ok) {
    throw new Error('Failed to load model metrics');
  }

  return res.json();
}