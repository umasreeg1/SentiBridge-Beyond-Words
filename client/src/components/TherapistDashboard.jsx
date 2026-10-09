import React, { useState } from 'react';
import {
  Users, Calendar, Clock, Search, ShieldCheck, Lock,
  ChevronRight, FileText, Sparkles, Filter, AlertTriangle,
  Heart, BarChart3, MessageSquare, Menu, ChevronLeft,
  Activity, CheckCircle2, UserCheck, ShieldAlert
} from 'lucide-react';
import PatientAnalyticsDashboard from './PatientAnalyticsDashboard';
import ClinicianConversationBridge from './ClinicianConversationBridge';
import TherapistInsightMap from './TherapistInsightMap';

export default function TherapistDashboard({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenInsightMap,
  onSwitchToPatientView,
  patientDataMap,
  onRefreshSuggestions,
  isRefreshing,
  activeInsightData,
  isLoadingInsight,
  isInsightMapOpen,
  onCloseInsightMap,
  consentError
}) {
  const [activeTab, setActiveTab] = React.useState('DIRECTORY'); // 'DIRECTORY' | 'INSIGHT_MAP' | 'CONVERSATION_BRIDGE' | 'ANALYTICS'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterConsent, setFilterConsent] = React.useState('ALL'); // ALL, APPROVED, PENDING

  React.useEffect(() => {
    if (isInsightMapOpen) {
      setActiveTab('INSIGHT_MAP');
    }
  }, [isInsightMapOpen]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const selectedFullPatientData = activeInsightData || patientDataMap?.[selectedPatient?.id] || selectedPatient;

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

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    if (tab !== 'INSIGHT_MAP' && onCloseInsightMap) {
      onCloseInsightMap();
    }
    if (tab === 'INSIGHT_MAP' && onOpenInsightMap && selectedPatient) {
      onOpenInsightMap(selectedPatient.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-6rem)]">
      
      {/* Collapsible SaaS Clinical Sidebar */}
      <aside className={`bg-white rounded-2xl border border-clinical-200 p-4 shadow-sm space-y-6 shrink-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-full lg:w-20' : 'w-full lg:w-64'
      }`}>
        
        {/* Toggle Collapse Header */}
        <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                CP
              </div>
              <span className="text-xs font-bold uppercase text-clinical-900 tracking-wider">
                Clinical Portal
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 text-clinical-500 hover:text-clinical-900 hover:bg-clinical-100 rounded-lg transition-colors mx-auto lg:mx-0"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Group */}
        <div className="space-y-4">
          {!isSidebarCollapsed && (
            <div className="text-[10px] font-bold uppercase text-clinical-400 tracking-wider">
              Main Operations
            </div>
          )}
          <nav className="space-y-1.5">
            <button
              onClick={() => handleSwitchTab('DIRECTORY')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl font-medium text-xs transition-all ${
                activeTab === 'DIRECTORY'
                  ? 'bg-clinical-900 text-white shadow-sm border-l-4 border-teal-400 font-bold'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
              title="Patient Directory"
            >
              <span className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                {!isSidebarCollapsed && <span>Patient Directory</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-clinical-800 text-clinical-300 px-2 py-0.5 rounded-full font-semibold">
                  {patients.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSwitchTab('INSIGHT_MAP')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl font-medium text-xs transition-all ${
                activeTab === 'INSIGHT_MAP'
                  ? 'bg-clinical-900 text-white shadow-sm border-l-4 border-indigo-400 font-bold'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
              title="AI Insight Map"
            >
              <span className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isSidebarCollapsed && <span>AI Insight Map</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {approvedCount} Ready
                </span>
              )}
            </button>

            <button
              onClick={() => handleSwitchTab('CONVERSATION_BRIDGE')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl font-medium text-xs transition-all ${
                activeTab === 'CONVERSATION_BRIDGE'
                  ? 'bg-clinical-900 text-white shadow-sm border-l-4 border-purple-400 font-bold'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
              title="Conversation Bridge"
            >
              <span className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
                {!isSidebarCollapsed && <span>Conversation Bridge</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Guide
                </span>
              )}
            </button>

            <button
              onClick={() => handleSwitchTab('ANALYTICS')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl font-medium text-xs transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-clinical-900 text-white shadow-sm border-l-4 border-teal-400 font-bold'
                  : 'text-clinical-600 hover:bg-clinical-100 hover:text-clinical-900'
              }`}
              title="Patient Analytics"
            >
              <span className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4 text-teal-400 shrink-0" />
                {!isSidebarCollapsed && <span>Patient Analytics</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                  Charts
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Active Patient Selector */}
        {!isSidebarCollapsed && (
          <div className="border-t border-clinical-100 pt-4 space-y-2">
            <div className="text-[10px] font-bold uppercase text-clinical-400 tracking-wider">
              Active Focus Patient
            </div>
            <select
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                onSelectPatient(e.target.value);
              }}
              className="w-full text-xs font-bold border border-clinical-300 rounded-xl p-2.5 bg-clinical-50 text-clinical-900 focus:ring-2 focus:ring-indigo-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.hasApprovedSharing ? 'Approved' : 'Unapproved'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Consent Summary Stats */}
        {!isSidebarCollapsed && (
          <div className="border-t border-clinical-100 pt-4 space-y-2 text-xs">
            <div className="text-[10px] font-bold uppercase text-clinical-400 tracking-wider">
              Sharing & Privacy Status
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="flex items-center space-x-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Approved Reports</span>
              </span>
              <span className="font-bold text-emerald-700">{approvedCount}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="flex items-center space-x-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Private Drafts</span>
              </span>
              <span className="font-bold text-amber-700">{pendingCount}</span>
            </div>
          </div>
        )}

        {/* Prototype Ethical Notice */}
        {!isSidebarCollapsed && (
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center space-x-1 text-indigo-950 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ethical AI Principles</span>
            </div>
            <p className="text-indigo-800 leading-relaxed text-[10px]">
              SentiBridge assists session preparation without diagnosing conditions or scoring distress objectively.
            </p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 overflow-x-hidden">

        {/* Top Header Banner */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-clinical-900 tracking-tight">Therapist Clinical Portal</h1>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full border border-indigo-200">
                  Dr. Sarah Vance, LMFT
                </span>
              </div>
              <p className="text-xs text-clinical-500 mt-1">
                Review patient-reported reflections, difficult topics, Conversation Bridge guides, and analytics.
              </p>
            </div>

            <button
              onClick={() => onSwitchToPatientView()}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Simulate Patient Reflection Entry</span>
            </button>
          </div>

          {/* Sub Navigation Bar for Quick Tab Access */}
          <div className="mt-5 pt-4 border-t border-clinical-100 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleSwitchTab('DIRECTORY')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'DIRECTORY'
                  ? 'bg-clinical-900 text-white shadow-xs'
                  : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
              }`}
            >
              Patient Directory ({patients.length})
            </button>

            <button
              onClick={() => handleSwitchTab('INSIGHT_MAP')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'INSIGHT_MAP'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
              }`}
            >
              AI Insight Map ({selectedPatient?.name})
            </button>

            <button
              onClick={() => handleSwitchTab('CONVERSATION_BRIDGE')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'CONVERSATION_BRIDGE'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
              }`}
            >
              Conversation Bridge
            </button>

            <button
              onClick={() => handleSwitchTab('ANALYTICS')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-clinical-100 text-clinical-600 hover:bg-clinical-200'
              }`}
            >
              Patient Analytics
            </button>
          </div>
        </div>

        {/* VIEW 1: PATIENT DIRECTORY & ROSTERS */}
        {activeTab === 'DIRECTORY' && (
          <>
            {/* Upcoming Sessions Banner */}
            <div className="bg-gradient-to-r from-clinical-900 via-clinical-800 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-clinical-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-xs tracking-wider uppercase text-indigo-200">
                    Upcoming Consultations Schedule
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
                      handleSwitchTab('INSIGHT_MAP');
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img src={p.avatarUrl} alt={p.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-400/30" />
                        <div>
                          <div className="font-bold text-sm text-white">{p.name}</div>
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
                  <h2 className="text-lg font-bold text-clinical-900">Patient Directory Roster</h2>
                  <p className="text-xs text-clinical-500">Select a patient to view profile or open their authorized Insight Map.</p>
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
                            handleSwitchTab('INSIGHT_MAP');
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

        {/* VIEW 2: THERAPIST INSIGHT MAP (EMBEDDED IN TAB) */}
        {activeTab === 'INSIGHT_MAP' && (
          <TherapistInsightMap
            patientData={selectedFullPatientData}
            onClose={() => {
              if (onCloseInsightMap) onCloseInsightMap();
              setActiveTab('DIRECTORY');
            }}
            onRegenerateInsight={onRefreshSuggestions}
            isRegenerating={isRefreshing}
            consentError={consentError}
          />
        )}

        {/* VIEW 3: CLINICIAN CONVERSATION BRIDGE (FEATURE THREE) */}
        {activeTab === 'CONVERSATION_BRIDGE' && (
          <ClinicianConversationBridge
            patientData={selectedFullPatientData}
            isLoading={isLoadingInsight}
            consentError={consentError}
            onRefreshSuggestions={onRefreshSuggestions}
            isRefreshing={isRefreshing}
          />
        )}

        {/* VIEW 4: PATIENT PROGRESS & REFLECTION ANALYTICS (FEATURE FOUR) */}
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
