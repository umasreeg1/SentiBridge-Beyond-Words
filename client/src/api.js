const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchPatients() {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) throw new Error('Failed to fetch patients list');
  return res.json();
}

export async function fetchPatientInfo(id) {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch patient overview');
  return res.json();
}

export async function fetchInsightMap(id) {
  const res = await fetch(`${API_BASE}/patients/${id}/insight-map`);
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to fetch Therapist Insight Map');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function fetchPatientSelfView(id) {
  const res = await fetch(`${API_BASE}/patients/${id}/patient-view`);
  if (!res.ok) throw new Error('Failed to fetch patient reflection data');
  return res.json();
}

export async function updatePatientConsent(id, status, sharedSections) {
  const res = await fetch(`${API_BASE}/patients/${id}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, sharedSections })
  });
  if (!res.ok) throw new Error('Failed to update consent status');
  return res.json();
}

export async function submitPatientReflection(id, reflectionPayload) {
  const res = await fetch(`${API_BASE}/patients/${id}/reflections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reflectionPayload)
  });
  if (!res.ok) throw new Error('Failed to submit reflection');
  return res.json();
}

export async function generateInsightReportApi(patientId, forceDemo = false) {
  const res = await fetch(`${API_BASE}/generate-insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, forceDemo })
  });
  if (!res.ok) throw new Error('Failed to generate AI insight');
  return res.json();
}

export async function fetchScenarios() {
  const res = await fetch(`${API_BASE}/scenarios`);
  if (!res.ok) throw new Error('Failed to fetch scenarios');
  return res.json();
}
