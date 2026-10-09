import React, { useState } from 'react';
import { MessageSquare, Quote, AlertCircle, Compass, HelpCircle, Copy, Check, Sparkles, RefreshCw, Info, Lock } from 'lucide-react';

export default function ClinicianConversationBridge({
  patientData,
  isLoading,
  consentError,
  onRefreshSuggestions,
  isRefreshing
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const isConsentDenied = Boolean(
    consentError ||
    (patientData && patientData.hasApprovedSharing === false) ||
    (patientData?.consentDetails && patientData.consentDetails.status !== 'APPROVED')
  );

  if (isConsentDenied) {
    return (
      <div className="bg-white rounded-2xl border border-clinical-200 p-8 text-center space-y-4 max-w-xl mx-auto shadow-sm my-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-clinical-900">Conversation Bridge Locked</h3>
        <p className="text-xs text-clinical-600 leading-relaxed max-w-md mx-auto">
          {consentError?.message || "Conversation Bridge requires patient consent authorization. Patient has saved reflection entries but has not approved clinician sharing."}
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 text-left max-w-md mx-auto font-medium">
          <strong>Privacy Protocol:</strong> To view Conversation Bridge prompts and evidence, switch to Patient View and click "Approve & Share with Clinician".
        </div>
      </div>
    );
  }

  if (isLoading || !patientData || (!patientData.journalEntries && !patientData.aiInsightReport)) {
    return (
      <div className="bg-white rounded-2xl border border-clinical-200 p-12 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-xs text-clinical-600 font-medium">Loading Conversation Bridge for {patientData?.name || 'patient'}...</p>
      </div>
    );
  }

  const aiReport = patientData.aiInsightReport || {};
  const allowedSections = patientData.consentDetails?.sharedSections || [];

  const starters = aiReport.suggestedConversationStarters || [];
  const openingQuestion = starters[0] || `"${patientData.name}, how would you like to structure our check-in today?"`;
  const followUpQuestions = starters.slice(1);

  const difficultTopics = (patientData.topicPreferences || [])
    .filter(t => t.status === 'DIFFICULT_TO_DISCUSS' || t.status === 'NOT_READY')
    .map(t => t.topic);

  const wantHelpTopics = (patientData.topicPreferences || [])
    .filter(t => t.status === 'WANT_HELP')
    .map(t => t.topic);

  const excerpts = patientData.journalEntries || [];

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-clinical-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-clinical-900">Clinician Conversation Bridge</h2>
            <span className="text-xs bg-indigo-100 text-indigo-800 border border-indigo-300 font-semibold px-2.5 py-0.5 rounded-full">
              Session Communication Aid
            </span>
          </div>
          <p className="text-xs text-clinical-500 mt-1">
            Grounded exclusively in {patientData.name}'s patient-approved reflections.
          </p>
        </div>

        <button
          onClick={() => onRefreshSuggestions && onRefreshSuggestions(patientData.id)}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Suggestions'}</span>
        </button>
      </div>

      {/* 1. A Gentle Way to Begin */}
      <div className="bg-gradient-to-r from-indigo-900 via-clinical-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>A Gentle Way to Begin (Opening Question)</span>
          </div>
          <button
            onClick={() => handleCopyText(openingQuestion, 'opening')}
            className="flex items-center space-x-1 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
          >
            {copiedIndex === 'opening' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 'opening' ? 'Copied' : 'Copy Question'}</span>
          </button>
        </div>

        <p className="text-sm md:text-base font-medium text-indigo-50 leading-relaxed italic">
          {openingQuestion}
        </p>

        {wantHelpTopics.length > 0 && (
          <div className="text-[11px] text-indigo-300 border-t border-indigo-800/80 pt-2 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Grounded in patient request for help with: <strong>{wantHelpTopics.join(', ')}</strong></span>
          </div>
        )}
      </div>

      {/* 2. You May Want to Explore (Follow-up Questions with Copy Button) */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-clinical-900 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>You May Want to Explore (Optional Follow-Up Questions)</span>
        </h3>

        <div className="space-y-3">
          {followUpQuestions.length > 0 ? (
            followUpQuestions.map((q, idx) => (
              <div key={idx} className="bg-clinical-50 border border-clinical-200 rounded-xl p-4 flex items-start justify-between gap-3 hover:border-indigo-300 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm text-clinical-900 font-medium leading-relaxed">{q}</p>
                    {excerpts[idx] && (
                      <p className="text-[11px] text-clinical-500 italic">
                        Evidence cite: "{excerpts[idx].mindContent?.substring(0, 90)}..."
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyText(q, idx)}
                  className="p-1.5 text-clinical-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors shrink-0"
                  title="Copy question"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-clinical-500 italic">No additional follow-up questions generated.</p>
          )}
        </div>
      </div>

      {/* 3. Grid: What Patient Says Helps & Topics to Approach Gently */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* What Patient Says Helps */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs uppercase tracking-wider border-b border-teal-200 pb-2">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>What the Patient Says Helps</span>
          </div>

          <div className="space-y-1.5 text-xs text-teal-950 pt-1">
            {(aiReport.patientStatedSupportPreferences || []).length > 0 ? (
              aiReport.patientStatedSupportPreferences.map((pref, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
                  <span className="font-medium">{pref}</span>
                </div>
              ))
            ) : (
              <p className="text-clinical-500 italic">General supportive preferences.</p>
            )}
          </div>
        </div>

        {/* Topics to Approach Gently */}
        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs uppercase tracking-wider border-b border-rose-200 pb-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Topics to Approach Gently</span>
          </div>

          <div className="space-y-1.5 text-xs text-rose-950 pt-1">
            {difficultTopics.length > 0 ? (
              difficultTopics.map((topic, idx) => (
                <div key={idx} className="flex items-center space-x-2 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span>{topic}</span>
                </div>
              ))
            ) : (
              <p className="text-clinical-500 italic">No topics explicitly marked sensitive.</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Ask Don't Assume Reminders */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
        <strong className="flex items-center space-x-1 text-amber-900 font-bold">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Ask, Don't Assume Clinical Principle</span>
        </strong>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          Questions above are optional AI suggestions. Always verify interpretations directly with the patient and respect their decision if they choose to skip a topic.
        </p>
      </div>

    </div>
  );
}
