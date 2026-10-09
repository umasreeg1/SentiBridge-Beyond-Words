import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { patients, predefinedScenarios } from './store.js';
import { generateInsightReport, generateDemoInsight } from './services/geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SentiBridge backend' });
});

// GET /health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SentiBridge backend' });
});

// 1. Health check API endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'online',
    appName: 'SentiBridge API Server',
    version: '1.0.0',
    hasGeminiApiKey: hasKey,
    activeMode: hasKey ? 'LIVE_GEMINI' : 'DEMO_MODE',
    disclaimer: 'Hackathon Prototype — Not clinically validated for diagnostic use'
  });
});

// 2. Get list of predefined scenarios for Patient Reflection
app.get('/api/scenarios', (req, res) => {
  res.json(predefinedScenarios);
});

// 3. Get all patients summary (for Therapist Dashboard)
app.get('/api/patients', (req, res) => {
  const patientSummaries = patients.map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    occupation: p.occupation,
    nextSession: p.nextSession,
    sessionType: p.sessionType,
    avatarUrl: p.avatarUrl,
    status: p.status,
    lastReflectionDate: p.lastReflectionDate,
    hasApprovedSharing: p.hasApprovedSharing,
    consentStatus: p.consentDetails?.status || 'PENDING_REVIEW'
  }));
  res.json(patientSummaries);
});

// 4. Get individual patient basic info
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Return non-sensitive profile overview
  res.json({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    occupation: patient.occupation,
    nextSession: patient.nextSession,
    sessionType: patient.sessionType,
    avatarUrl: patient.avatarUrl,
    status: patient.status,
    lastReflectionDate: patient.lastReflectionDate,
    hasApprovedSharing: patient.hasApprovedSharing,
    consentDetails: patient.consentDetails
  });
});

// 5. Get Therapist Insight Map for patient (ENFORCING BACKEND CONSENT CONTROL)
app.get('/api/patients/:id/insight-map', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // BACKEND ACCESS CONTROL ENFORCEMENT:
  // Must check if patient approved sharing!
  if (!patient.hasApprovedSharing || patient.consentDetails?.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'PATIENT_CONSENT_REQUIRED',
      message: 'Access Denied: The patient has not approved sharing their reflection report with clinical providers.',
      patientId: patient.id,
      consentStatus: patient.consentDetails?.status || 'PENDING_REVIEW',
      approvedAt: patient.consentDetails?.approvedAt || null
    });
  }

  // Filter sensitive sections based on patient sharedSections preference if specified
  const allowedSections = patient.consentDetails.sharedSections || [
    'lifeMap', 'topicPreferences', 'journalExcerpts', 'supportCompass', 'scenarios'
  ];

  const filteredPatientData = {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    occupation: patient.occupation,
    nextSession: patient.nextSession,
    sessionType: patient.sessionType,
    avatarUrl: patient.avatarUrl,
    lastReflectionDate: patient.lastReflectionDate,
    consentDetails: patient.consentDetails,
    lifeMap: allowedSections.includes('lifeMap') ? patient.lifeMap : null,
    topicPreferences: allowedSections.includes('topicPreferences') ? patient.topicPreferences : [],
    journalEntries: allowedSections.includes('journalExcerpts') ? patient.journalEntries : [],
    situationStories: allowedSections.includes('scenarios') ? patient.situationStories : [],
    supportCompass: allowedSections.includes('supportCompass') ? patient.supportCompass : null,
    aiInsightReport: patient.aiInsightReport
  };

  res.json(filteredPatientData);
});

// 6. Patient endpoint to view their own raw reflection data for review/editing before approving
app.get('/api/patients/:id/patient-view', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  // Patients always have access to review their own unshared/shared data
  res.json(patient);
});

// 7. Update Consent / Approval status (Screen E Workflow)
app.post('/api/patients/:id/consent', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { status, sharedSections } = req.body;
  // Valid status: 'APPROVED', 'REJECTED', 'PENDING_REVIEW'

  if (!['APPROVED', 'REJECTED', 'PENDING_REVIEW'].includes(status)) {
    return res.status(400).json({ error: 'Invalid consent status value' });
  }

  patient.consentDetails = {
    status: status,
    approvedAt: status === 'APPROVED' ? new Date().toISOString() : null,
    sharedSections: sharedSections || ['lifeMap', 'topicPreferences', 'journalExcerpts', 'supportCompass', 'scenarios']
  };

  patient.hasApprovedSharing = (status === 'APPROVED');
  patient.status = status === 'APPROVED' ? 'Active' : (status === 'REJECTED' ? 'Consent Declined' : 'Pending Consent Review');

  console.log(`🔒 Patient ${patient.id} consent updated to: ${status}`);

  res.json({
    success: true,
    patientId: patient.id,
    hasApprovedSharing: patient.hasApprovedSharing,
    consentDetails: patient.consentDetails
  });
});

// 8. Submit new patient reflection form
app.post('/api/patients/:id/reflections', async (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { lifeMap, topicPreferences, journalEntry, situationStories, supportCompass, autoApprove } = req.body;

  if (lifeMap) patient.lifeMap = lifeMap;
  if (topicPreferences) patient.topicPreferences = topicPreferences;
  if (situationStories) patient.situationStories = situationStories;
  if (supportCompass) patient.supportCompass = supportCompass;

  if (journalEntry && (journalEntry.mindContent || journalEntry.difficultSituation)) {
    const newEntry = {
      id: `j-${patient.id}-${Date.now()}`,
      date: new Date().toISOString(),
      mindContent: journalEntry.mindContent || '',
      difficultSituation: journalEntry.difficultSituation || '',
      therapistUnderstand: journalEntry.therapistUnderstand || '',
      helpfulSupport: journalEntry.helpfulSupport || ''
    };
    patient.journalEntries = [newEntry, ...(patient.journalEntries || [])];
  }

  patient.lastReflectionDate = new Date().toISOString();

  // If autoApprove is specified, set consent accordingly
  if (autoApprove === true) {
    patient.hasApprovedSharing = true;
    patient.consentDetails = {
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      sharedSections: ['lifeMap', 'topicPreferences', 'journalExcerpts', 'supportCompass', 'scenarios']
    };
    patient.status = 'Active';
  } else if (autoApprove === false) {
    patient.hasApprovedSharing = false;
    patient.consentDetails = {
      status: 'PENDING_REVIEW',
      approvedAt: null,
      sharedSections: []
    };
    patient.status = 'Pending Consent Review';
  }

  // Generate updated AI Insight Report
  try {
    const insight = await generateInsightReport(patient);
    patient.aiInsightReport = insight;
  } catch (err) {
    console.error('Error generating AI insight:', err);
    patient.aiInsightReport = generateDemoInsight(patient, 'Fallback after background generation error');
  }

  res.json({
    success: true,
    message: 'Reflection saved successfully',
    patientId: patient.id,
    hasApprovedSharing: patient.hasApprovedSharing,
    consentStatus: patient.consentDetails.status,
    aiInsightReport: patient.hasApprovedSharing ? patient.aiInsightReport : null
  });
});

// 9. Generate or Regenerate AI Insight Report explicitly
app.post('/api/generate-insight', async (req, res) => {
  const { patientId, forceDemo } = req.body;
  let targetPatient = null;

  if (patientId) {
    targetPatient = patients.find(p => p.id === patientId);
  }

  const patientDataToUse = targetPatient || req.body.patientData;

  if (!patientDataToUse) {
    return res.status(400).json({ error: 'Patient ID or patientData payload is required' });
  }

  try {
    let report;
    if (forceDemo) {
      report = generateDemoInsight(patientDataToUse, 'Manually requested Demo Mode');
    } else {
      report = await generateInsightReport(patientDataToUse);
    }

    if (targetPatient) {
      targetPatient.aiInsightReport = report;
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      error: 'AI_GENERATION_FAILED',
      message: error.message,
      fallbackReport: generateDemoInsight(patientDataToUse, `Error: ${error.message}`)
    });
  }
});

// 10. Patient Progress & Reflection Analytics Endpoint
app.get('/api/patients/:id/analytics', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Backend Access Control Enforcement
  if (!patient.hasApprovedSharing || patient.consentDetails?.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'PATIENT_CONSENT_REQUIRED',
      message: 'Access Denied: The patient has not approved sharing reflection analytics with clinical providers.',
      patientId: patient.id,
      consentStatus: patient.consentDetails?.status || 'PENDING_REVIEW'
    });
  }

  const allowedSections = patient.consentDetails.sharedSections || [];

  // A. Reflection Activity Timeline (by date)
  const timelineData = (patient.journalEntries || []).map((j, idx) => ({
    date: new Date(j.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    fullDate: j.date,
    reflectionsCount: 1,
    sessionLabel: `Session #${patient.journalEntries.length - idx}`
  })).reverse();

  // B. Topic Distribution Frequency
  const topicCounts = {};
  if (allowedSections.includes('topicPreferences')) {
    (patient.topicPreferences || []).forEach(t => {
      const category = t.status === 'WANT_HELP' ? 'Help Requested' :
                       t.status === 'DIFFICULT_TO_DISCUSS' ? 'Difficult Topic' :
                       t.status === 'NOT_READY' ? 'Not Ready' : 'Not Relevant';
      topicCounts[t.topic] = { topic: t.topic, count: 1, category };
    });
  }
  const topicDistribution = Object.values(topicCounts);

  // C. Communication Preferences Breakdown
  const supportPrefsData = [];
  if (allowedSections.includes('supportCompass') && patient.supportCompass) {
    if (patient.supportCompass.beingListenedTo) supportPrefsData.push({ name: 'Dedicated Listening', value: 85 });
    if (patient.supportCompass.practicalSuggestions) supportPrefsData.push({ name: 'Practical Tools', value: 90 });
    if (patient.supportCompass.timeToThink) supportPrefsData.push({ name: 'Processing Time', value: 95 });
    if (patient.supportCompass.writingInsteadOfSpeaking) supportPrefsData.push({ name: 'Written Notes', value: 75 });
    if (patient.supportCompass.helpMakingAPlan) supportPrefsData.push({ name: 'Step Plan', value: 80 });
  }

  // D. Reflection Section Completion Breakdown
  const completionData = [
    { section: 'Life Map', status: allowedSections.includes('lifeMap') ? 'Shared' : 'Hidden', score: allowedSections.includes('lifeMap') ? 100 : 0 },
    { section: 'Topic Preferences', status: allowedSections.includes('topicPreferences') ? 'Shared' : 'Hidden', score: allowedSections.includes('topicPreferences') ? 100 : 0 },
    { section: 'Mind Journal', status: allowedSections.includes('journalExcerpts') ? 'Shared' : 'Hidden', score: allowedSections.includes('journalExcerpts') ? 100 : 0 },
    { section: 'Situation Stories', status: allowedSections.includes('scenarios') ? 'Shared' : 'Hidden', score: allowedSections.includes('scenarios') ? 100 : 0 },
    { section: 'Support Compass', status: allowedSections.includes('supportCompass') ? 'Shared' : 'Hidden', score: allowedSections.includes('supportCompass') ? 100 : 0 }
  ];

  res.json({
    patientId: patient.id,
    patientName: patient.name,
    isSyntheticDemoData: false,
    disclaimer: 'Patient-reported activity metrics. Not diagnostic scores.',
    timelineData,
    topicDistribution,
    supportPrefsData,
    completionData
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SentiBridge Backend Server listening on http://localhost:${PORT}`);
  console.log(`💡 Gemini API Key status: ${process.env.GEMINI_API_KEY ? 'CONFIGURED' : 'NOT SET (DEMO MODE)'}`);
});
