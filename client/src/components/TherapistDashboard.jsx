import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Search, ShieldCheck, Lock,
  ChevronRight, FileText, Sparkles, Filter, AlertTriangle,
  UserCheck, Activity, Heart, ArrowUpRight, BarChart3, MessageSquare
} from 'lucide-react';
import PatientAnalyticsDashboard from './PatientAnalyticsDashboard';
import ClinicianConversationBridge from './ClinicianConversationBridge';

export default function TherapistDashboard({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenInsightMap,
  onSwitchToPatientView,
  patientDataMap,
  onRefreshSuggestions,
  isRefreshing
}) {
  const [activeTab, setActiveTab] = useState('DIRECTORY'); // 'DIRECTORY' | 'CONVERSATION_BRIDGE' | 'ANALYTICS'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConsent, setFilterConsent] = useState('ALL'); // ALL, APPROVED, PENDING

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const selectedFullPatientData = patientDataMap?.[selectedPatient?.id] || selectedPatient;

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConsent = filterConsent === 'ALL' ||
                           (filterConsent === 'APPROVED' && p.hasApprovedSharing) ||
                           (filterConsent === 'PENDING' && !p.hasApprovedSharing);
    return matchesSearch && matchesConsent;
  });

  const approvedCount = patients.filter(p => p.hasApprovedSharing).length;
  const pendingCount = patients.filter(p => !p.hasApprovedSharing).length;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar / Left Quick Nav */}
      <aside className="w-full lg:w-64 bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm space-y-6 shrink-0">
        <div>
          <div className="text-xs font-semibold uppercase text-clinical-400 tracking-wider mb-3">
            Clinical Portal Navigation
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('DIRECTORY')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'DIRECTORY'
                  ? 'bg-clinical-900 text-white shadow-sm'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Patient Directory</span>
              </span>
              <span className="text-xs bg-clinical-800 text-clinical-300 px-2 py-0.5 rounded-full">
                {patients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('CONVERSATION_BRIDGE')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'CONVERSATION_BRIDGE'
                  ? 'bg-clinical-900 text-white shadow-sm'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Conversation Bridge</span>
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                Guide
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-clinical-900 text-white shadow-sm'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span>Patient Analytics</span>
              </span>
              <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                Charts
              </span>
            </button>
          </nav>
        </div>

        <div className="border-t border-clinical-200 pt-4">
          <div className="text-xs font-semibold uppercase text-clinical-400 tracking-wider mb-3">
            Active Patient Selection
          </div>
          <div className="space-y-2">
            <select
              value={selectedPatient?.id || ''}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="w-full text-xs font-bold border border-clinical-300 rounded-xl p-2.5 bg-clinical-50 text-clinical-900"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.hasApprovedSharing ? 'Approved' : 'Unapproved'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-clinical-200 pt-4">
          <div className="text-xs font-semibold uppercase text-clinical-400 tracking-wider mb-3">
            Patient Sharing & Consent
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="flex items-center space-x-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Approved Reports</span>
              </span>
              <span className="font-bold text-emerald-700">{approvedCount}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="flex items-center space-x-1.5 font-medium">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Unapproved Drafts</span>
              </span>
              <span className="font-bold text-amber-700">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Prototype Clinical Ethics Notice */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-900 space-y-1.5">
          <div className="font-semibold flex items-center space-x-1 text-indigo-950">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Clinical Assistant Principles</span>
          </div>
          <p className="text-indigo-800 leading-relaxed text-[11px]">
            SentiBridge collects patient-reported reflections. AI summaries provide structured session preparation and do not diagnose mental health conditions.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">

        {/* Top Header Banner */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-clinical-900">Therapist Clinical Portal</h1>
                <span className="text-xs bg-clinical-100 text-clinical-700 font-semibold px-2.5 py-1 rounded-full border border-clinical-300">
                  Dr. Sarah Vance, LMFT
                </span>
              </div>
              <p className="text-sm text-clinical-500 mt-1">
                Review patient-reported reflections, difficult topics, Conversation Bridge guides, and analytics.
              </p>
            </div>

            <button
              onClick={() => onSwitchToPatientView()}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Simulate Patient Reflection Entry</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PATIENT DIRECTORY & ROSTERS */}
        {activeTab === 'DIRECTORY' && (
          <>
            {/* Upcoming Sessions Banner */}
            <div className="bg-gradient-to-r from-clinical-900 via-clinical-800 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-clinical-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm tracking-wide uppercase text-indigo-200">
                    Upcoming Clinical Consultations
                  </h2>
                </div>
                <span className="text-xs text-clinical-300">Today's Schedule</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {patients.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    className="bg-clinical-800/80 hover:bg-clinical-800 border border-clinical-700/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectPatient(p.id);
                      if (p.hasApprovedSharing) onOpenInsightMap(p.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400/30" />
                        <div>
                          <div className="font-semibold text-sm text-white">{p.name}</div>
                          <div className="text-[11px] text-clinical-300">{p.sessionType}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-clinical-700/50 text-xs">
                      <div className="flex items-center space-x-1 text-indigo-300 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(p.nextSession).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {p.hasApprovedSharing ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Insight Ready</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Consent Pending</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Directory Grid */}
            <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-clinical-900">Patient Directory</h2>
                  <p className="text-xs text-clinical-500">Select a patient to view clinical profile or access their approved pre-session map.</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-clinical-400" />
                    <input
                      type="text"
                      placeholder="Search patient name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-clinical-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-clinical-50/50"
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-clinical-100 p-1 rounded-xl border border-clinical-200">
                    <button
                      onClick={() => setFilterConsent('ALL')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        filterConsent === 'ALL' ? 'bg-white text-clinical-900 shadow-xs' : 'text-clinical-600 hover:text-clinical-900'
                      }`}
                    >
                      All ({patients.length})
                    </button>
                    <button
                      onClick={() => setFilterConsent('APPROVED')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        filterConsent === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-clinical-600 hover:text-clinical-900'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setFilterConsent('PENDING')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        filterConsent === 'PENDING' ? 'bg-amber-600 text-white shadow-xs' : 'text-clinical-600 hover:text-clinical-900'
                      }`}
                    >
                      Unapproved
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className={`border rounded-2xl p-5 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4 ${
                      selectedPatient?.id === patient.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-clinical-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={patient.avatarUrl}
                          alt={patient.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-clinical-100"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-base text-clinical-900">{patient.name}</h3>
                            <span className="text-xs text-clinical-500 font-normal">({patient.age} y/o)</span>
                          </div>
                          <p className="text-xs text-clinical-500">{patient.occupation}</p>
                        </div>
                      </div>

                      {/* Consent Status Badge */}
                      {patient.hasApprovedSharing ? (
                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sharing Approved</span>
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Consent Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="bg-clinical-50 rounded-xl p-3 text-xs space-y-2 border border-clinical-100">
                      <div className="flex items-center justify-between text-clinical-600">
                        <span className="font-medium">Last Patient Reflection:</span>
                        <span className="font-semibold text-clinical-800">
                          {new Date(patient.lastReflectionDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {patient.hasApprovedSharing ? (
                        <p className="text-clinical-700 italic text-[11px] line-clamp-2">
                          "Patient submitted structured reflection and approved clinical report access."
                        </p>
                      ) : (
                        <p className="text-amber-800 italic text-[11px] font-medium flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 inline mr-1" />
                          <span>Patient has saved draft reflection but has not yet authorized sharing.</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {patient.hasApprovedSharing ? (
                        <button
                          onClick={() => {
                            onSelectPatient(patient.id);
                            onOpenInsightMap(patient.id);
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-clinical-900 hover:bg-indigo-950 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Open Insight Map</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectPatient(patient.id);
                            onSwitchToPatientView(patient.id);
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Review Consent in Patient View</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CLINICIAN CONVERSATION BRIDGE (FEATURE THREE) */}
        {activeTab === 'CONVERSATION_BRIDGE' && (
          <ClinicianConversationBridge
            patientData={selectedFullPatientData}
            onRefreshSuggestions={onRefreshSuggestions}
            isRefreshing={isRefreshing}
          />
        )}

        {/* TAB 3: PATIENT PROGRESS & REFLECTION ANALYTICS (FEATURE FOUR) */}
        {activeTab === 'ANALYTICS' && (
          <PatientAnalyticsDashboard
            patientId={selectedPatient?.id}
            patientName={selectedPatient?.name}
            hasApprovedSharing={selectedPatient?.hasApprovedSharing}
          />
        )}

      </main>

    </div>
  );
}
