import React, { useState } from 'react';
import {
  Heart, Compass, BookOpen, Layers, ShieldCheck, Lock, CheckCircle2,
  ChevronRight, ArrowLeft, Send, Sparkles, AlertCircle, HelpCircle, Eye, EyeOff
} from 'lucide-react';

export default function PatientReflection({
  patientData,
  scenarios = [],
  onSubmitReflection,
  onUpdateConsent,
  isSubmitting
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Life Map, 2: Topics, 3: Journal, 4: Scenarios, 5: Support Compass, 6: Consent & Review

  // Form State
  const [lifeMap, setLifeMap] = useState(patientData?.lifeMap || {
    academicWorkPressure: 'Moderate',
    familyExpectations: 'Moderate',
    relationships: 'Moderate',
    sleepAndRoutine: 'Moderate',
    selfConfidence: 'Moderate',
    futureConcerns: 'Moderate',
    otherConcerns: ''
  });

  const [topicPreferences, setTopicPreferences] = useState(patientData?.topicPreferences || [
    { topic: "Academic & Work Stress", status: "WANT_HELP" },
    { topic: "Family Communication", status: "DIFFICULT_TO_DISCUSS" },
    { topic: "Sleep & Nighttime Anxiety", status: "WANT_HELP" },
    { topic: "Self-Confidence", status: "DIFFICULT_TO_DISCUSS" },
    { topic: "Future & Career Goals", status: "WANT_HELP text-xs" }
  ]);

  const [journalEntry, setJournalEntry] = useState({
    mindContent: patientData?.journalEntries?.[0]?.mindContent || '',
    difficultSituation: patientData?.journalEntries?.[0]?.difficultSituation || '',
    therapistUnderstand: patientData?.journalEntries?.[0]?.therapistUnderstand || '',
    helpfulSupport: patientData?.journalEntries?.[0]?.helpfulSupport || ''
  });

  const [situationStories, setSituationStories] = useState(patientData?.situationStories || []);

  const [supportCompass, setSupportCompass] = useState(patientData?.supportCompass || {
    beingListenedTo: true,
    practicalSuggestions: true,
    timeToThink: true,
    writingInsteadOfSpeaking: false,
    helpMakingAPlan: true,
    otherPreferences: ''
  });

  const [consentStatus, setConsentStatus] = useState(patientData?.consentDetails?.status || 'APPROVED');
  const [sharedSections, setSharedSections] = useState(
    patientData?.consentDetails?.sharedSections || ['lifeMap', 'topicPreferences', 'journalExcerpts', 'supportCompass', 'scenarios']
  );

  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(null);

  // Handlers
  const handleTopicStatusChange = (topicName, newStatus) => {
    setTopicPreferences(prev => {
      const exists = prev.find(t => t.topic === topicName);
      if (exists) {
        return prev.map(t => t.topic === topicName ? { ...t, status: newStatus } : t);
      } else {
        return [...prev, { topic: topicName, status: newStatus }];
      }
    });
  };

  const handleScenarioSelect = (scenarioId, optionText) => {
    setSituationStories(prev => {
      const filtered = prev.filter(s => s.scenarioId !== scenarioId);
      return [...filtered, { scenarioId, chosenOption: optionText, patientExplanation: '' }];
    });
  };

  const handleScenarioExplanation = (scenarioId, text) => {
    setSituationStories(prev => prev.map(s => s.scenarioId === scenarioId ? { ...s, patientExplanation: text } : s));
  };

  const toggleSectionShare = (sectionKey) => {
    setSharedSections(prev => 
      prev.includes(sectionKey) ? prev.filter(k => k !== sectionKey) : [...prev, sectionKey]
    );
  };

const handleSubmit = async (shouldApproveSharing) => {
  if (!patientData?.id) {
    alert("Unable to save: no patient is selected.");
    return;
  }

  const payload = {
    lifeMap,
    topicPreferences,
    journalEntry,
    situationStories,
    supportCompass,
    autoApprove: shouldApproveSharing
  };

  setSubmitSuccessMsg(null);

  try {
    // Save the reflection first.
    await onSubmitReflection(patientData.id, payload);

    // Explicitly save the patient's consent choice.
    const consentStatus = shouldApproveSharing ? "APPROVED" : "REJECTED";

    await onUpdateConsent(
      patientData.id,
      consentStatus,
      shouldApproveSharing ? sharedSections : []
    );

    setSubmitSuccessMsg(
      shouldApproveSharing
        ? "Reflection saved. Sharing approved for the selected sections."
        : "Reflection saved as a private draft. Therapist sharing is paused."
    );
  } catch (err) {
    console.error("Reflection or consent submission failed:", err);
    alert("Could not save your choice: " + err.message);
  }
};

  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-clinical-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-teal-400" />
              <h1 className="text-xl font-bold text-white">Patient Guided Reflection</h1>
            </div>
            <p className="text-xs text-teal-200 mt-1">
              Welcome, {patientData?.name}. Take your time to reflect before your upcoming session. You have full control over what you choose to share.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-teal-950/60 p-2.5 rounded-xl border border-teal-500/30 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-teal-100 font-medium">Your Privacy & Consent Are Protected</span>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 pt-4 border-t border-teal-700/60 flex items-center justify-between text-xs font-semibold text-teal-200">
          {[
            { id: 1, name: 'Life Map' },
            { id: 2, name: 'Topics' },
            { id: 3, name: 'Mind Journal' },
            { id: 4, name: 'Stories' },
            { id: 5, name: 'Support' },
            { id: 6, name: 'Review & Share' }
          ].map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                currentStep === step.id 
                  ? 'bg-teal-500 text-white font-bold shadow-xs' 
                  : 'text-teal-300 hover:text-white hover:bg-teal-800/60'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-teal-950/60 flex items-center justify-center text-[10px]">
                {step.id}
              </span>
              <span className="hidden sm:inline">{step.name}</span>
            </button>
          ))}
        </div>
      </div>

      {submitSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-4 flex items-center space-x-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submitSuccessMsg}</span>
        </div>
      )}

      {/* STEP 1: LIFE MAP */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>1. Life Map Reflection</span>
            </h2>
            <p className="text-xs text-clinical-500">Rate your current stress or pressure level across various life areas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'academicWorkPressure', label: 'Academic or Work Pressure' },
              { key: 'familyExpectations', label: 'Family Expectations & Pressure' },
              { key: 'relationships', label: 'Social & Romantic Relationships' },
              { key: 'sleepAndRoutine', label: 'Sleep Quality & Daily Routine' },
              { key: 'selfConfidence', label: 'Self-Confidence & Esteem' },
              { key: 'futureConcerns', label: 'Future & Life Direction Concerns' }
            ].map(item => (
              <div key={item.key} className="bg-clinical-50 p-4 rounded-xl border border-clinical-200 space-y-2">
                <label className="text-xs font-bold text-clinical-800 block">{item.label}</label>
                <select
                  value={lifeMap[item.key] || 'Moderate'}
                  onChange={(e) => setLifeMap({ ...lifeMap, [item.key]: e.target.value })}
                  className="w-full text-xs border border-clinical-300 rounded-lg p-2 bg-white font-medium text-clinical-900 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low / Managing Well">Low / Managing Well</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Very High / Overwhelming">Very High / Overwhelming</option>
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-clinical-800 block">Other Concerns (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Financial strain, health concerns, living situation..."
              value={lifeMap.otherConcerns || ''}
              onChange={(e) => setLifeMap({ ...lifeMap, otherConcerns: e.target.value })}
              className="w-full text-xs border border-clinical-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Topic Preferences</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TOPIC PREFERENCES */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <span>2. Session Topic Preferences</span>
            </h2>
            <p className="text-xs text-clinical-500">Let your therapist know how you feel about discussing these topics today.</p>
          </div>

          <div className="space-y-3">
            {[
              "Academic & Exam Stress",
              "Family Communication & Expectations",
              "Sleep & Nighttime Anxiety",
              "Self-Confidence & Perfectionism",
              "Future & Career Path Decisions",
              "Relationship Dynamics"
            ].map(topicName => {
              const currentPref = topicPreferences.find(t => t.topic === topicName)?.status || "NOT_SET";
              return (
                <div key={topicName} className="p-4 rounded-xl border border-clinical-200 bg-clinical-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-bold text-xs text-clinical-900">{topicName}</span>
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { value: "WANT_HELP", label: "I want help with this", color: "bg-emerald-600 text-white" },
                      { value: "DIFFICULT_TO_DISCUSS", label: "Difficult to discuss", color: "bg-amber-600 text-white" },
                      { value: "NOT_READY", label: "Not ready to discuss", color: "bg-rose-600 text-white" },
                      { value: "NOT_RELEVANT", label: "Not relevant", color: "bg-clinical-400 text-white" }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleTopicStatusChange(topicName, opt.value)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                          currentPref === opt.value
                            ? `${opt.color} border-transparent shadow-xs`
                            : "bg-white text-clinical-700 border-clinical-300 hover:bg-clinical-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-1 text-clinical-600 hover:text-clinical-900 font-semibold text-xs py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Mind Journal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MIND JOURNAL */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>3. Mind Journal Prompts</span>
            </h2>
            <p className="text-xs text-clinical-500">Express your thoughts in your own words. Write as much or as little as you feel comfortable.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                What has been on your mind recently?
              </label>
              <textarea
                rows={3}
                placeholder="Share thoughts, recurring worries, or experiences..."
                value={journalEntry.mindContent}
                onChange={(e) => setJournalEntry({ ...journalEntry, mindContent: e.target.value })}
                className="w-full text-xs border border-clinical-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 font-normal leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                What situation has felt difficult or challenging lately?
              </label>
              <textarea
                rows={2}
                placeholder="Describe a recent moment or trigger..."
                value={journalEntry.difficultSituation}
                onChange={(e) => setJournalEntry({ ...journalEntry, difficultSituation: e.target.value })}
                className="w-full text-xs border border-clinical-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 font-normal leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                What would you like your therapist to understand about your experience?
              </label>
              <textarea
                rows={2}
                placeholder="Key things you want your therapist to know..."
                value={journalEntry.therapistUnderstand}
                onChange={(e) => setJournalEntry({ ...journalEntry, therapistUnderstand: e.target.value })}
                className="w-full text-xs border border-clinical-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 font-normal leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                What support or session format would be most helpful today?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Practical boundary strategies, quiet listening..."
                value={journalEntry.helpfulSupport}
                onChange={(e) => setJournalEntry({ ...journalEntry, helpfulSupport: e.target.value })}
                className="w-full text-xs border border-clinical-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 font-normal leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-1 text-clinical-600 hover:text-clinical-900 font-semibold text-xs py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Situation Stories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SITUATION STORIES */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>4. Situation Stories (Everyday Scenarios)</span>
              </h2>
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-medium">
                No Diagnostic Scoring
              </span>
            </div>
            <p className="text-xs text-clinical-500 mt-1">
              Select how you usually respond in everyday situations. This helps your therapist understand your communication habits. You may skip any scenario.
            </p>
          </div>

          <div className="space-y-6">
            {scenarios.map(sc => {
              const selectedOption = situationStories.find(s => s.scenarioId === sc.id)?.chosenOption;
              const explanationText = situationStories.find(s => s.scenarioId === sc.id)?.patientExplanation || '';

              return (
                <div key={sc.id} className="bg-clinical-50 border border-clinical-200 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-clinical-900">{sc.title}</h3>
                  <p className="text-xs text-clinical-600 italic">{sc.description}</p>

                  <div className="space-y-2 pt-1">
                    {sc.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleScenarioSelect(sc.id, opt)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                          selectedOption === opt
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-clinical-800 border-clinical-300 hover:bg-clinical-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    <button
                      onClick={() => handleScenarioSelect(sc.id, 'None of these / Prefer to skip')}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedOption === 'None of these / Prefer to skip'
                          ? 'bg-clinical-700 text-white border-clinical-700'
                          : 'bg-white text-clinical-500 border-dashed border-clinical-300 hover:bg-clinical-100'
                      }`}
                    >
                      None of these / Skip this scenario
                    </button>
                  </div>

                  {selectedOption && selectedOption !== 'None of these / Prefer to skip' && (
                    <div className="pt-2 space-y-1">
                      <label className="text-[11px] font-bold text-clinical-700 block">
                        Why did you choose this response? (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Explain briefly..."
                        value={explanationText}
                        onChange={(e) => handleScenarioExplanation(sc.id, e.target.value)}
                        className="w-full text-xs border border-clinical-300 rounded-lg p-2 bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-1 text-clinical-600 hover:text-clinical-900 font-semibold text-xs py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Support Compass</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUPPORT COMPASS */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <span>5. Support Compass Preferences</span>
            </h2>
            <p className="text-xs text-clinical-500">Check the support approaches that feel most helpful to you during therapy sessions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'beingListenedTo', label: 'Being listened to without immediate solutions' },
              { key: 'practicalSuggestions', label: 'Practical, actionable suggestions & coping tools' },
              { key: 'timeToThink', label: 'Extra processing time before answering questions' },
              { key: 'writingInsteadOfSpeaking', label: 'Writing thoughts down when speaking is difficult' },
              { key: 'helpMakingAPlan', label: 'Help making a step-by-step plan together' }
            ].map(item => (
              <label
                key={item.key}
                className={`p-4 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  supportCompass[item.key]
                    ? 'bg-teal-50 border-teal-300 text-teal-950 font-semibold shadow-xs'
                    : 'bg-clinical-50 border-clinical-200 text-clinical-700 hover:bg-clinical-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(supportCompass[item.key])}
                  onChange={(e) => setSupportCompass({ ...supportCompass, [item.key]: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-xs">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-clinical-800 block">
              Other Support Preferences (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Starting sessions with 2 minutes of quiet time..."
              value={supportCompass.otherPreferences || ''}
              onChange={(e) => setSupportCompass({ ...supportCompass, otherPreferences: e.target.value })}
              className="w-full text-xs border border-clinical-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-1 text-clinical-600 hover:text-clinical-900 font-semibold text-xs py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <span>Next: Review & Patient Consent</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PATIENT CONSENT & SHARING WORKFLOW (SCREEN E) */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-clinical-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>6. Review & Consent Authorization</span>
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                Patient Control Screen
              </span>
            </div>
            <p className="text-xs text-clinical-500 mt-1">
              You are in control of your information. Review your selections and choose which sections your therapist can access.
            </p>
          </div>

          {/* Section Sharing Toggles */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-clinical-700">
              Select Sections to Include in Clinical Report:
            </h3>

            {[
              { key: 'lifeMap', label: 'Life Map Stress Ratings', desc: 'Ratings on academic/work, sleep, and relationship stress.' },
              { key: 'topicPreferences', label: 'Topic Preferences', desc: 'Topics marked as "want help", "difficult", or "not ready".' },
              { key: 'journalExcerpts', label: 'Mind Journal Excerpts', desc: 'Your written thoughts and explanations.' },
              { key: 'scenarios', label: 'Everyday Situation Responses', desc: 'Your choices in scenario stories.' },
              { key: 'supportCompass', label: 'Support & Session Preferences', desc: 'Your preferred ways of receiving support.' }
            ].map(sec => {
              const isShared = sharedSections.includes(sec.key);
              return (
                <div
                  key={sec.key}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isShared ? 'bg-emerald-50/60 border-emerald-200' : 'bg-clinical-50 border-clinical-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-clinical-900 flex items-center space-x-2">
                      <span>{sec.label}</span>
                      {isShared ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">Included</span>
                      ) : (
                        <span className="text-[10px] text-clinical-500 bg-clinical-200 px-2 py-0.5 rounded font-medium">Excluded</span>
                      )}
                    </div>
                    <p className="text-[11px] text-clinical-500 mt-0.5">{sec.desc}</p>
                  </div>

                  <button
                    onClick={() => toggleSectionShare(sec.key)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                      isShared 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-white text-clinical-700 border border-clinical-300 hover:bg-clinical-100'
                    }`}
                  >
                    {isShared ? <Eye className="w-4 h-4 inline" /> : <EyeOff className="w-4 h-4 inline" />}
                    <span>{isShared ? 'Sharing' : 'Hidden'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Buttons for Consent Approval vs Pause/Draft */}
          <div className="bg-clinical-50 border border-clinical-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-clinical-900">Final Confirmation & Consent Choice</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A: Approve & Share */}
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Share Report with Therapist</span>
              </button>

              {/* Option B: Save as Private Draft / Unapproved */}
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 bg-clinical-800 hover:bg-clinical-900 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Save as Private Draft (Pause Sharing)</span>
              </button>

            </div>

            <p className="text-[11px] text-clinical-500 text-center">
              You can change your consent settings or revoke therapist access at any time prior to your session.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
