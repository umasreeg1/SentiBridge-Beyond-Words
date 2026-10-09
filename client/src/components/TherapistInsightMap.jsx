import React, { useState } from 'react';
import {
  Sparkles, ShieldCheck, Lock, User, Quote, MessageSquare, AlertCircle,
  HelpCircle, Compass, FileText, Calendar, CheckCircle2, Tag, Printer,
  RefreshCw, ArrowLeft, Info, Layers, ChevronRight
} from 'lucide-react';

export default function TherapistInsightMap({
  patientData,
  onClose,
  onRegenerateInsight,
  isRegenerating,
  consentError
}) {
  const [selectedTab, setSelectedTab] = useState('INSIGHT_MAP'); // INSIGHT_MAP, RAW_EXCERPTS, PREFERENCES

  if (consentError) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-md">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-clinical-900">Access Denied: Patient Consent Required</h2>
        <p className="text-sm text-clinical-600 leading-relaxed">
          {consentError.message || "This patient has saved reflection entries but has not authorized sharing this report with clinical providers."}
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-left">
          <strong>Clinical Ethics Guardrail:</strong> SentiBridge strictly enforces patient autonomy. Unapproved patient entries cannot be viewed in clinician endpoints until explicit consent is granted.
        </div>
        <button
          onClick={onClose}
          className="bg-clinical-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-clinical-800 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="bg-white rounded-2xl border border-clinical-200 p-12 text-center space-y-3 max-w-lg mx-auto my-8">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-sm text-clinical-600 font-medium">Loading Therapist Insight Map...</p>
      </div>
    );
  }

  const aiReport = patientData.aiInsightReport || {};
  const isDemo = aiReport.isDemoMode;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header Navigation & Controls */}
      <div className="bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-clinical-500 hover:text-clinical-900 hover:bg-clinical-100 rounded-xl transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-clinical-900">
                  Therapist Insight Map — {patientData.name}
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Patient-Approved Report</span>
                </span>
              </div>
              <p className="text-xs text-clinical-500 mt-0.5">
                Organized patient-reported concerns, journal quotes, and AI-assisted session preparation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRegenerateInsight(patientData.id)}
              disabled={isRegenerating}
              className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Generating...' : 'Refresh AI Analysis'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-clinical-900 hover:bg-clinical-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Clinical Map</span>
            </button>
          </div>

        </div>

        {/* Legend / Category Color Guide */}
        <div className="mt-4 pt-3 border-t border-clinical-100 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-clinical-600 uppercase text-[10px] tracking-wider">Source Legend:</span>
          
          <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg text-teal-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Direct Patient Report (Verbatim / Preference)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg text-purple-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>AI Synthesis & Topic Organization</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg text-indigo-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>AI Suggested Conversation Starters</span>
          </div>
        </div>
      </div>

      {/* Patient Demographics & Pre-Session Summary Card */}
      <div className="bg-gradient-to-r from-clinical-900 via-clinical-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-clinical-700/70 pb-4">
          <div className="flex items-center space-x-3.5">
            <img src={patientData.avatarUrl} alt={patientData.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/40" />
            <div>
              <h2 className="text-xl font-bold text-white">{patientData.name}</h2>
              <div className="text-xs text-clinical-300 flex items-center space-x-3 mt-0.5">
                <span>Age: {patientData.age}</span>
                <span>•</span>
                <span>Occupation: {patientData.occupation}</span>
                <span>•</span>
                <span>Session: {patientData.sessionType}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-right bg-clinical-800/80 p-3 rounded-xl border border-clinical-700">
            <div className="text-clinical-400 font-medium">Approved Sharing Date</div>
            <div className="font-semibold text-indigo-300 mt-0.5">
              {patientData.consentDetails?.approvedAt 
                ? new Date(patientData.consentDetails.approvedAt).toLocaleString()
                : 'Approved in Current Session'}
            </div>
          </div>
        </div>

        {/* AI Pre-Session Summary Box */}
        <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Pre-Session Summary (Synthesis of Patient Reports)</span>
            </div>
            {isDemo && (
              <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-semibold">
                Demo Mode — AI quota exhausted
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-clinical-100 leading-relaxed font-normal">
            {aiReport.concisePreSessionSummary || "No pre-session summary generated yet."}
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Direct Patient Reports & Excerpts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Recurring Topics & Cites (Traceable to Patient Entries) */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-clinical-900">
                  Recurring Themes & Traceable Cites
                </h3>
              </div>
              <span className="text-[11px] bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                AI Synthesis (Traceable to Patient Entries)
              </span>
            </div>

            <div className="space-y-3">
              {(aiReport.recurringTopics || []).length > 0 ? (
                aiReport.recurringTopics.map((item, idx) => (
                  <div key={idx} className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-sm text-purple-950 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>{item.topic}</span>
                    </div>

                    <div className="text-xs text-purple-900 space-y-1 pl-4 border-l-2 border-purple-300">
                      <span className="font-semibold text-purple-800 text-[11px] uppercase tracking-wider block">
                        Supporting Patient Evidence:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-clinical-700">
                        {item.supportingEntries.map((cite, cIdx) => (
                          <li key={cIdx}>{cite}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-clinical-500 italic">No recurring topics identified.</p>
              )}
            </div>
          </div>

          {/* Section 2: Important Patient Excerpts (Verbatim Patient Quotes) */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
              <div className="flex items-center space-x-2">
                <Quote className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-clinical-900">
                  Relevant Patient Journal Excerpts
                </h3>
              </div>
              <span className="text-[11px] bg-teal-50 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full border border-teal-200">
                Direct Patient Verbatim Words
              </span>
            </div>

            <div className="space-y-3">
              {(aiReport.importantExcerpts || []).length > 0 ? (
                aiReport.importantExcerpts.map((excerpt, idx) => (
                  <div key={idx} className="bg-teal-50/40 border border-teal-200/80 rounded-xl p-4 space-y-1">
                    <div className="flex items-start space-x-2 text-teal-950">
                      <Quote className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 rotate-180" />
                      <p className="text-xs md:text-sm font-medium italic leading-relaxed text-teal-900">
                        {excerpt}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-clinical-500 italic">No direct journal quotes submitted.</p>
              )}
            </div>
          </div>

          {/* Section 3: Conversation Bridge & Session Preparation */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-indigo-950">
                  Conversation Bridge — Pre-Session Guide
                </h3>
              </div>
              <span className="text-[11px] bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-300 w-max">
                Therapist Preparation Aid
              </span>
            </div>

            <p className="text-xs text-clinical-600 leading-relaxed">
              Synthesized from patient-approved reports to facilitate smooth, empathetic conversation opening.
            </p>

            {/* Conversation Starters List */}
            <div className="space-y-3">
              {(aiReport.suggestedConversationStarters || []).length > 0 ? (
                aiReport.suggestedConversationStarters.map((starter, idx) => (
                  <div key={idx} className="bg-white border border-indigo-200/90 rounded-xl p-4 flex items-start space-x-3 shadow-xs">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                        Suggested Opening Option {idx + 1}
                      </span>
                      <p className="text-xs md:text-sm text-clinical-800 font-medium leading-relaxed">
                        {starter}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-clinical-500 italic">No conversation starters generated.</p>
              )}
            </div>

            {/* Patient Choice & Autonomy Notice */}
            <div className="bg-white/80 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-900 flex items-center space-x-2 font-medium">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                <strong>Patient Autonomy Reminder:</strong> The patient may choose to skip any question, adjust topic order, or request writing time at any moment.
              </span>
            </div>
          </div>

          {/* Section 4: Reflection Journey Timeline */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-clinical-700" />
                <h3 className="font-bold text-base text-clinical-900">
                  Reflection Journey & Submission History
                </h3>
              </div>
              <span className="text-[11px] bg-clinical-100 text-clinical-700 font-semibold px-2.5 py-0.5 rounded-full">
                Saved Submissions
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {(patientData.journalEntries || []).map((entry, idx) => (
                <div key={entry.id || idx} className="flex items-start space-x-3 p-3 bg-clinical-50 rounded-xl border border-clinical-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-clinical-800 font-semibold">
                      <span>Reflection #{patientData.journalEntries.length - idx}</span>
                      <span className="text-[11px] text-clinical-500 font-normal">
                        {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-clinical-600 line-clamp-1 italic text-[11px]">
                      "{entry.mindContent || entry.difficultSituation || 'Structured Reflection'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Topics & Support Compass Preferences (1/3 width) */}
        <div className="space-y-6">

          {/* Topics Marked Difficult to Discuss */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 border-b border-clinical-100 pb-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-sm">Difficult to Discuss Topics</h4>
            </div>
            
            <p className="text-[11px] text-clinical-500">
              Topics explicitly marked by the patient as hard to bring up or not ready to discuss yet.
            </p>

            <div className="space-y-2">
              {(aiReport.topicsDifficultToDiscuss || []).map((topic, idx) => (
                <div key={idx} className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs font-semibold text-rose-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient-Stated Support Preferences (Support Compass) */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-teal-800 border-b border-clinical-100 pb-2.5">
              <Compass className="w-4 h-4 text-teal-600" />
              <h4 className="font-bold text-sm">Communication & Support Compass</h4>
            </div>

            <p className="text-[11px] text-clinical-500">
              Direct patient preferences for session communication and support delivery.
            </p>

            <div className="space-y-2">
              {(aiReport.patientStatedSupportPreferences || []).map((pref, idx) => (
                <div key={idx} className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-xs text-teal-950 flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{pref}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Life Map Indicators */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-clinical-900 border-b border-clinical-100 pb-2.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm">Patient Life Map Self-Report</h4>
            </div>

            {patientData.lifeMap ? (
              <div className="space-y-2 text-xs">
                {Object.entries(patientData.lifeMap).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-clinical-50">
                    <span className="text-clinical-600 capitalize">
                      {key.replace(/([AZ])/g, ' $1').trim()}:
                    </span>
                    <span className="font-semibold text-clinical-900">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-clinical-500 italic">No Life Map data provided.</p>
            )}
          </div>

          {/* Unanswered / Unclear Questions for Session */}
          <div className="bg-white rounded-2xl border border-clinical-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-clinical-900 border-b border-clinical-100 pb-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm">Unanswered Session Questions</h4>
            </div>

            <div className="space-y-2">
              {(aiReport.unansweredQuestions || []).map((q, idx) => (
                <div key={idx} className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950 font-medium">
                  {q}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
