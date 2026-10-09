import React, { useState, useEffect } from 'react';
import DemoControlBar from './components/DemoControlBar';
import TherapistDashboard from './components/TherapistDashboard';
import TherapistInsightMap from './components/TherapistInsightMap';
import PatientReflection from './components/PatientReflection';
import BreathingActivity from './components/BreathingActivity';
import {
  fetchHealth, fetchPatients, fetchPatientInfo, fetchInsightMap,
  fetchPatientSelfView, updatePatientConsent, submitPatientReflection,
  generateInsightReportApi, fetchScenarios
} from './api';

export default function App() {
  const [activeView, setActiveView] = useState('therapist'); // 'therapist' | 'patient' | 'breathing'
  const [selectedPatientId, setSelectedPatientId] = useState('P-101');
  
  const [health, setHealth] = useState(null);
  const [patients, setPatients] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const [activePatientData, setActivePatientData] = useState(null);
  const [patientSelfData, setPatientSelfData] = useState(null);

  const [isInsightMapOpen, setIsInsightMapOpen] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Initial load
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [h, pts, sc] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchPatients().catch(() => []),
        fetchScenarios().catch(() => [])
      ]);
      setHealth(h);
      setPatients(pts);
      setScenarios(sc);

      if (pts.length > 0 && !selectedPatientId) {
        setSelectedPatientId(pts[0].id);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load detailed patient data when selectedPatientId changes
  useEffect(() => {
    if (!selectedPatientId) return;

    // Load Patient Self View for reflection editor
    fetchPatientSelfView(selectedPatientId)
      .then(data => setPatientSelfData(data))
      .catch(err => console.error('Error fetching patient self view:', err));

  }, [selectedPatientId]);

  // Open Therapist Insight Map (Enforcing Backend Access Control)
  const handleOpenInsightMap = async (patientId) => {
    const idToUse = patientId || selectedPatientId;
    setSelectedPatientId(idToUse);
    setIsInsightMapOpen(true);
    setConsentError(null);
    setActivePatientData(null);

    try {
      const data = await fetchInsightMap(idToUse);
      setActivePatientData(data);
    } catch (err) {
      console.error('Insight Map access failed:', err);
      if (err.status === 403 || err.data?.error === 'PATIENT_CONSENT_REQUIRED') {
        setConsentError(err.data || { message: err.message });
      } else {
        setConsentError({ message: 'Failed to retrieve report: ' + err.message });
      }
    }
  };

  // Regenerate AI Insight Report
  const handleRegenerateInsight = async (patientId) => {
    setIsRegenerating(true);
    try {
      await generateInsightReportApi(patientId, false);
      // Reload insight map
      const updatedData = await fetchInsightMap(patientId);
      setActivePatientData(updatedData);
      // Refresh patient list
      const pts = await fetchPatients();
      setPatients(pts);
    } catch (err) {
      alert('Error regenerating AI analysis: ' + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Patient Reflection Submit Handler
  const handleSubmitReflection = async (patientId, payload) => {
    const res = await submitPatientReflection(patientId, payload);
    // Refresh list & local state
    const pts = await fetchPatients();
    setPatients(pts);
    const selfData = await fetchPatientSelfView(patientId);
    setPatientSelfData(selfData);
    return res;
  };

  // Patient Consent Update Handler
  const handleUpdateConsent = async (patientId, status, sharedSections) => {
    const res = await updatePatientConsent(patientId, status, sharedSections);
    const pts = await fetchPatients();
    setPatients(pts);
    const selfData = await fetchPatientSelfView(patientId);
    setPatientSelfData(selfData);
    return res;
  };

  return (
    <div className="min-h-screen flex flex-col bg-clinical-50 text-clinical-900">
      
      {/* Top Demo Control Header Bar */}
      <DemoControlBar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        patients={patients}
        health={health}
        onRefresh={loadInitialData}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-clinical-600">Initializing SentiBridge Platform...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: THERAPIST DASHBOARD */}
            {activeView === 'therapist' && !isInsightMapOpen && (
              <TherapistDashboard
                patients={patients}
                onSelectPatient={(id) => setSelectedPatientId(id)}
                onOpenInsightMap={handleOpenInsightMap}
                onSwitchToPatientView={(id) => {
                  if (id) setSelectedPatientId(id);
                  setActiveView('patient');
                }}
              />
            )}

            {/* INSIGHT MAP MODAL / SCREEN D */}
            {activeView === 'therapist' && isInsightMapOpen && (
              <TherapistInsightMap
                patientData={activePatientData}
                onClose={() => setIsInsightMapOpen(false)}
                onRegenerateInsight={handleRegenerateInsight}
                isRegenerating={isRegenerating}
                consentError={consentError}
              />
            )}

            {/* VIEW 2: PATIENT REFLECTION & CONSENT */}
            {activeView === 'patient' && (
              <PatientReflection
                patientData={patientSelfData || patients.find(p => p.id === selectedPatientId)}
                scenarios={scenarios}
                onSubmitReflection={handleSubmitReflection}
                onUpdateConsent={handleUpdateConsent}
                isSubmitting={false}
              />
            )}

            {/* VIEW 3: BREATHING ACTIVITY */}
            {activeView === 'breathing' && (
              <BreathingActivity />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-clinical-200 py-4 text-center text-xs text-clinical-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SentiBridge — AI-Assisted Patient Insight Platform (Hackathon Prototype)</span>
          <span className="text-clinical-400">Not intended for clinical diagnosis or emergency use.</span>
        </div>
      </footer>

    </div>
  );
}
