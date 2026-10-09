import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Insight Engine Service using Gemini API
 */

export async function generateInsightReport(patientData) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API Key is available
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    console.log("ℹ️ GEMINI_API_KEY not configured. Operating in DEMO MODE.");
    return generateDemoInsight(patientData, "GEMINI_API_KEY is not configured in server environment. Using structured hackathon Demo Mode.");
  }

  try {
    // Enforce sending ONLY patient-submitted, approved-for-processing information
    const allowedSections = patientData.consentDetails?.sharedSections || [
      'lifeMap', 'topicPreferences', 'journalExcerpts', 'supportCompass', 'scenarios'
    ];

    const approvedDataToProcess = {
      name: patientData.name || 'Patient',
      lifeMap: allowedSections.includes('lifeMap') ? patientData.lifeMap : null,
      topicPreferences: allowedSections.includes('topicPreferences') ? patientData.topicPreferences : [],
      journalEntries: allowedSections.includes('journalExcerpts') ? patientData.journalEntries : [],
      situationStories: allowedSections.includes('scenarios') ? patientData.situationStories : [],
      supportCompass: allowedSections.includes('supportCompass') ? patientData.supportCompass : null
    };

    const promptText = `
You are an expert AI clinical documentation assistant for therapists using the SentiBridge platform.
Your objective is to organize patient-reported reflection data into a structured therapist pre-session insight map.

STRICT CONSTRAINTS & CLINICAL SAFETY RULES:
1. Do NOT diagnose any psychological conditions (e.g., depression, anxiety, PTSD, trauma, disorders).
2. Do NOT assign numerical distress scores, severity rankings, or claim to detect "hidden" unconscious emotions.
3. NEVER invent, hallucinate, or assume patient details not present in the provided input.
4. Only include verbatim quotes in 'importantExcerpts' that exist word-for-word in the patient's submitted journal entries.
5. Every item in 'recurringTopics' MUST cite actual patient-provided evidence in 'supportingEntries'.
6. Clearly distinguish patient-reported statements from AI-generated conversation starters.
7. Return ONLY valid JSON matching the specified JSON schema. Do not include markdown codeblock wrappers like \`\`\`json.

PATIENT REPORTED DATA (APPROVED FOR PROCESSING):
- Patient Name: ${approvedDataToProcess.name}
- Life Map Ratings/State: ${JSON.stringify(approvedDataToProcess.lifeMap || {})}
- Topic Preferences: ${JSON.stringify(approvedDataToProcess.topicPreferences || [])}
- Journal Entries: ${JSON.stringify(approvedDataToProcess.journalEntries || [])}
- Situation Story Responses: ${JSON.stringify(approvedDataToProcess.situationStories || [])}
- Support Compass Preferences: ${JSON.stringify(approvedDataToProcess.supportCompass || {})}

REQUIRED JSON FORMAT:
{
  "patientReportedConcerns": ["string..."],
  "importantExcerpts": ["direct verbatim quotes from journal entries..."],
  "recurringTopics": [
    {
      "topic": "string",
      "supportingEntries": ["string citing specific entry or preference..."]
    }
  ],
  "topicsDifficultToDiscuss": ["string..."],
  "patientStatedSupportPreferences": ["string..."],
  "unansweredQuestions": ["string..."],
  "suggestedConversationStarters": ["string..."],
  "concisePreSessionSummary": "string"
}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    let responseText = null;
    let successfulModel = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(promptText);
        responseText = response.response.text();
        successfulModel = modelName;
        break;
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} call failed: ${err.message}. Trying next fallback model...`);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All Gemini models encountered temporary demand spikes.");
    }
    
    // Clean response text if it contains markdown JSON wrappers
    const cleanedJsonText = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsedData = JSON.parse(cleanedJsonText);

    return {
      ...parsedData,
      generatedAt: new Date().toISOString(),
      isDemoMode: false,
      modelUsed: successfulModel
    };
  } catch (error) {
    console.error("⚠️ Gemini API Call failed:", error.message);
    return generateDemoInsight(
      patientData,
      `Gemini API Error: ${error.message}. Fallback to SentiBridge Demo Engine.`
    );
  }
}

/**
 * Pure fallback DEMO MODE generator when no API key is set or API call fails.
 */
export function generateDemoInsight(patientData, fallbackReason = "Hackathon Demo Mode") {
  const journalTexts = (patientData.journalEntries || [])
    .map(j => j.mindContent || j.difficultSituation || "")
    .filter(Boolean);

  const excerpts = journalTexts.length > 0 
    ? journalTexts.map(t => `"${t.length > 120 ? t.substring(0, 117) + "..." : t}"`)
    : ["\"Patient has not provided journal text excerpts yet.\""];

  const difficultTopics = (patientData.topicPreferences || [])
    .filter(t => t.status === "DIFFICULT_TO_DISCUSS" || t.status === "NOT_READY")
    .map(t => `${t.topic} (${t.status === "NOT_READY" ? "Not ready to discuss" : "Difficult to discuss"})`);

  const wantHelpTopics = (patientData.topicPreferences || [])
    .filter(t => t.status === "WANT_HELP")
    .map(t => t.topic);

  const supportPrefs = [];
  if (patientData.supportCompass) {
    if (patientData.supportCompass.beingListenedTo) supportPrefs.push("Wants dedicated time to be listened to without immediate interruption");
    if (patientData.supportCompass.practicalSuggestions) supportPrefs.push("Appreciates practical, actionable suggestions");
    if (patientData.supportCompass.timeToThink) supportPrefs.push("Needs extra processing time before answering complex questions");
    if (patientData.supportCompass.writingInsteadOfSpeaking) supportPrefs.push("Prefers writing difficult thoughts down before verbal discussion");
    if (patientData.supportCompass.helpMakingAPlan) supportPrefs.push("Wants collaborative assistance in creating structured step-by-step plans");
    if (patientData.supportCompass.otherPreferences) supportPrefs.push(`Custom preference: ${patientData.supportCompass.otherPreferences}`);
  }

  const recurring = [];
  if (difficultTopics.length > 0) {
    recurring.push({
      topic: "Sensitive Topic Avoidance / Communication Barriers",
      supportingEntries: [`Explicitly marked topics: ${difficultTopics.join(", ")}`]
    });
  }
  if (journalTexts.length > 0) {
    recurring.push({
      topic: "Self-Reported Situational Stress & Pressure",
      supportingEntries: ["Reflected in submitted Mind Journal entries", "Life Map indicators"]
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    isDemoMode: true,
    demoNotice: fallbackReason,
    patientReportedConcerns: wantHelpTopics.length > 0 
      ? wantHelpTopics.map(t => `Patient requested assistance with: ${t}`)
      : ["Patient provided general life map stress indicators."],
    importantExcerpts: excerpts,
    recurringTopics: recurring.length > 0 ? recurring : [
      {
        topic: "General Pre-session Reflection",
        supportingEntries: ["Submitted Patient Life Map & Support Preferences"]
      }
    ],
    topicsDifficultToDiscuss: difficultTopics.length > 0 ? difficultTopics : ["None explicitly marked as difficult"],
    patientStatedSupportPreferences: supportPrefs.length > 0 ? supportPrefs : ["General supportive therapy preferences"],
    unansweredQuestions: [
      `What specific triggers or environments make ${difficultTopics[0] || 'difficult topics'} feel hardest to address?`,
      "How would the patient like to pace today's session standard check-in?"
    ],
    suggestedConversationStarters: [
      `"${patientData.name || 'Patient'}, I reviewed your pre-session reflection notes. You mentioned wanting help with ${wantHelpTopics[0] || 'your concerns'}. Would you like to start there today?"`,
      `"You noted that having extra time to think is helpful for you. Please feel free to take pause moments whenever you need during our conversation today."`
    ],
    concisePreSessionSummary: `${patientData.name || 'The patient'} submitted a pre-session reflection highlighting key focus areas including ${wantHelpTopics.join(", ") || "general wellness"}. ${difficultTopics.length > 0 ? `Sensitive areas marked for gentle handling include ${difficultTopics.join(", ")}.` : ""}`
  };
}
