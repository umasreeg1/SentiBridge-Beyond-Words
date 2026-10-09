import React from 'react';
import { ShieldAlert, Sparkles, User, Stethoscope, RefreshCw, Cpu } from 'lucide-react';

export default function DemoControlBar({
  activeView,
  setActiveView,
  selectedPatientId,
  setSelectedPatientId,
  patients,
  health,
  onRefresh
}) {
  const currentPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <header className="bg-clinical-900 text-white border-b border-clinical-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Prototype Tag */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-inner">
              SB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SentiBridge</span>
                <span className="text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-medium">
                  Beyond Words
                </span>
              </div>
              <p className="text-xs text-clinical-400 flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3 text-amber-400 inline mr-1" />
                <span>Hackathon Prototype — AI-Assisted Patient Insight Platform</span>
              </p>
            </div>
          </div>

          {/* View Switcher Tabs (Therapist vs Patient) */}
          <div className="flex items-center bg-clinical-800 p-1 rounded-xl border border-clinical-700">
            <button
              onClick={() => setActiveView('therapist')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'therapist'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-clinical-300 hover:text-white hover:bg-clinical-700/50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Therapist View</span>
            </button>
            <button
              onClick={() => setActiveView('patient')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'patient'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-clinical-300 hover:text-white hover:bg-clinical-700/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient View</span>
            </button>
            <button
              onClick={() => setActiveView('breathing')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'breathing'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-clinical-300 hover:text-white hover:bg-clinical-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Breathing Activity</span>
            </button>
          </div>

          {/* Active Patient Selector & Server Status */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Patient Selector */}
            <div className="flex items-center space-x-1.5 bg-clinical-800 border border-clinical-700 rounded-lg px-2.5 py-1">
              <span className="text-clinical-400 font-medium">Demo Patient:</span>
              <select
                value={selectedPatientId || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id} className="bg-clinical-900 text-white">
                    {p.name} ({p.consentStatus === 'APPROVED' ? 'Sharing Approved' : 'Unapproved Draft'})
                  </option>
                ))}
              </select>
            </div>

            {/* AI Engine Status Badge */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                health?.activeMode === 'LIVE_GEMINI'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
              title={health?.activeMode === 'LIVE_GEMINI' ? 'Connected to Live Gemini API' : 'Operating in SentiBridge Demo Mode (AI Quota Exhausted)'}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{health?.activeMode === 'LIVE_GEMINI' ? 'LIVE GEMINI 3.8' : 'DEMO MODE (Quota Exhausted)'}</span>
            </div>

            <button
              onClick={onRefresh}
              className="p-1.5 text-clinical-400 hover:text-white hover:bg-clinical-800 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
