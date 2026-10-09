// In-memory data store for SentiBridge prototype

export const patients = [
  {
    id: "P-101",
    name: "Alex Morgan",
    age: 24,
    occupation: "University Student & Part-time Retail Worker",
    nextSession: "2026-10-12T10:00:00.000Z",
    sessionType: "Follow-up Consultation (In-person)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    lastReflectionDate: "2026-10-08T14:30:00.000Z",
    hasApprovedSharing: true,
    consentDetails: {
      status: "APPROVED", // APPROVED, PENDING_REVIEW, REJECTED
      approvedAt: "2026-10-08T15:00:00.000Z",
      sharedSections: ["lifeMap", "topicPreferences", "journalExcerpts", "supportCompass", "scenarios"]
    },
    lifeMap: {
      academicWorkPressure: "High",
      familyExpectations: "Very High",
      relationships: "Moderate",
      sleepAndRoutine: "Low quality / Irregular",
      selfConfidence: "Low",
      futureConcerns: "High",
      otherConcerns: "Financial strain"
    },
    topicPreferences: [
      { topic: "Academic & Exam Stress", status: "WANT_HELP" },
      { topic: "Family Communication & Expectations", status: "DIFFICULT_TO_DISCUSS" },
      { topic: "Romantic Relationships", status: "NOT_READY" },
      { topic: "Sleep & Nighttime Anxiety", status: "WANT_HELP" },
      { topic: "Financial Independence", status: "NOT_RELEVANT" }
    ],
    journalEntries: [
      {
        id: "j-101-1",
        date: "2026-10-08T14:30:00.000Z",
        mindContent: "I feel overwhelmed trying to balance final exams and family demands. Every time my parents call to ask about my future plans, I freeze up and feel a knot in my chest.",
        difficultSituation: "My family called yesterday insisting I prepare for graduate school right away, but I feel too exhausted to even finish this semester.",
        therapistUnderstand: "I really want to succeed, but the constant expectation makes me feel like I am failing before I even start.",
        helpfulSupport: "I need practical strategies to manage panic during calls and set gentle boundaries without causing a fight."
      },
      {
        id: "j-101-2",
        date: "2026-10-05T09:15:00.000Z",
        mindContent: "Stayed up until 4 AM worrying about my schedule. When sleep gets broken, everything feels ten times harder during the day.",
        difficultSituation: "Trying to study in the library while feeling restless and distracted.",
        therapistUnderstand: "It's not that I don't care about my classes; my mind just won't quiet down at night.",
        helpfulSupport: "A structured nighttime routine and breathing exercises would be helpful."
      }
    ],
    situationStories: [
      {
        scenarioId: "s-1",
        title: "Handling Unexpected Criticism",
        chosenOption: "I shut down and re-read the criticism multiple times alone.",
        patientExplanation: "I tend to internalize negative feedback right away even when it's minor."
      },
      {
        scenarioId: "s-2",
        title: "Social Event Invitation When Drained",
        chosenOption: "I cancel last minute and feel guilty about it afterwards.",
        patientExplanation: "I don't want to disappoint people, but my energy gets completely depleted."
      }
    ],
    supportCompass: {
      beingListenedTo: true,
      practicalSuggestions: true,
      timeToThink: true,
      writingInsteadOfSpeaking: true,
      helpMakingAPlan: false,
      otherPreferences: "Prefer starting sessions with a 2-minute quiet transition time."
    },
    aiInsightReport: {
      generatedAt: "2026-10-08T15:05:00.000Z",
      isDemoMode: true,
      patientReportedConcerns: [
        "High pressure surrounding academic performance and graduate school decisions.",
        "Communication paralysis during interactions with family members.",
        "Persistent sleep disruption and late-night racing thoughts."
      ],
      importantExcerpts: [
        "\"Every time my parents call to ask about my future plans, I freeze up and feel a knot in my chest.\"",
        "\"It's not that I don't care about my classes; my mind just won't quiet down at night.\"",
        "\"I need practical strategies to manage panic during calls and set gentle boundaries without causing a fight.\""
      ],
      recurringTopics: [
        {
          topic: "Family Expectation Stress",
          supportingEntries: ["Journal entry from Oct 8", "Topic preference: Family Communication marked 'Difficult to discuss'"]
        },
        {
          topic: "Sleep & Restlessness Cycle",
          supportingEntries: ["Journal entry from Oct 5", "Life Map: Sleep & Routine marked 'Low quality'"]
        }
      ],
      topicsDifficultToDiscuss: [
        "Family Communication & Expectations",
        "Romantic Relationships (Marked: Not ready to discuss)"
      ],
      patientStatedSupportPreferences: [
        "Wants practical suggestions and time to think during conversation.",
        "Prefers writing difficult thoughts down before speaking about them.",
        "Requested a 2-minute quiet transition at the start of therapy sessions."
      ],
      unansweredQuestions: [
        "How can Alex initiate boundary setting with family while minimizing guilt?",
        "What specific evening triggers contribute to remaining awake until 4 AM?"
      ],
      suggestedConversationStarters: [
        "\"Alex, you mentioned in your reflection that family phone calls can feel overwhelming. Would you like to explore what happens for you during those moments today, or start with your sleep routine?\"",
        "\"You indicated that writing thoughts down helps before speaking. Would you like to use paper or short notes during our session today if a topic feels heavy?\""
      ],
      concisePreSessionSummary: "Alex reports feeling heavily burdened by academic and family expectations, leading to somatic freezing during phone calls and sleep onset difficulties. Alex explicitly requested practical boundary-setting strategies and prefers visual/written prompts during session transitions."
    }
  },

  {
    id: "P-102",
    name: "Jordan Chen",
    age: 31,
    occupation: "Software Engineer",
    nextSession: "2026-10-14T14:30:00.000Z",
    sessionType: "Check-in (Remote Video)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    lastReflectionDate: "2026-10-07T11:20:00.000Z",
    hasApprovedSharing: true,
    consentDetails: {
      status: "APPROVED",
      approvedAt: "2026-10-07T11:45:00.000Z",
      sharedSections: ["lifeMap", "topicPreferences", "journalExcerpts", "supportCompass"]
    },
    lifeMap: {
      academicWorkPressure: "Very High",
      familyExpectations: "Moderate",
      relationships: "Stable",
      sleepAndRoutine: "Moderate",
      selfConfidence: "Low",
      futureConcerns: "Moderate",
      otherConcerns: "Imposter feelings at work"
    },
    topicPreferences: [
      { topic: "Workplace Imposter Feelings", status: "WANT_HELP" },
      { topic: "Self-Confidence & Perfectionism", status: "DIFFICULT_TO_DISCUSS" },
      { topic: "Peer Comparisons", status: "WANT_HELP" }
    ],
    journalEntries: [
      {
        id: "j-102-1",
        date: "2026-10-07T11:20:00.000Z",
        mindContent: "I joined a new tech team 2 months ago. Every code review feels like a trial where someone will discover I don't belong here.",
        difficultSituation: "A senior team member asked me to lead a design review next week.",
        therapistUnderstand: "I work 12-hour days not because the workload is heavy, but because I re-check everything 5 times out of fear.",
        helpfulSupport: "Help breaking down perfectionist habits into safer, realistic standards."
      }
    ],
    situationStories: [],
    supportCompass: {
      beingListenedTo: true,
      practicalSuggestions: true,
      timeToThink: true,
      writingInsteadOfSpeaking: false,
      helpMakingAPlan: true,
      otherPreferences: "Prefers concrete action steps and evidence-based frameworks."
    },
    aiInsightReport: {
      generatedAt: "2026-10-07T11:50:00.000Z",
      isDemoMode: true,
      patientReportedConcerns: [
        "Perfectionism leading to 12-hour workdays and excessive code re-checking.",
        "Fear of evaluation ahead of an upcoming design review presentation.",
        "Imposter feelings following a recent job transition."
      ],
      importantExcerpts: [
        "\"Every code review feels like a trial where someone will discover I don't belong here.\"",
        "\"I work 12-hour days not because the workload is heavy, but because I re-check everything 5 times out of fear.\""
      ],
      recurringTopics: [
        {
          topic: "Perfectionism & Verification Loops",
          supportingEntries: ["Journal entry: 12-hour days re-checking code", "Topic preference: Perfectionism marked 'Difficult to discuss'"]
        }
      ],
      topicsDifficultToDiscuss: [
        "Self-Confidence & Perfectionism"
      ],
      patientStatedSupportPreferences: [
        "Values practical suggestions and help creating structured action plans.",
        "Responds best to concrete, evidence-based frameworks."
      ],
      unansweredQuestions: [
        "What specific thoughts precede the impulse to re-check completed work?",
        "How can Jordan delegate or share presentation duties for the upcoming review?"
      ],
      suggestedConversationStarters: [
        "\"Jordan, in your reflection you mentioned re-checking your work 5 times before submission. Would you like to map out what that verification loop looks like and test a smaller safety experiment today?\"",
        "\"You have an upcoming design review next week. How are you feeling about preparing for that right now?\""
      ],
      concisePreSessionSummary: "Jordan reports strong imposter feelings at a new job, compensating through perfectionistic checking and extended work hours. Jordan is motivated for structured, practical strategies to prepare for an upcoming design presentation."
    }
  },

  {
    id: "P-103",
    name: "Samira Patel",
    age: 28,
    occupation: "Graphic Designer",
    nextSession: "2026-10-15T11:00:00.000Z",
    sessionType: "Initial Assessment",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "Pending Consent Review",
    lastReflectionDate: "2026-10-09T08:00:00.000Z",
    hasApprovedSharing: false, // Patient draft! Unapproved!
    consentDetails: {
      status: "PENDING_REVIEW",
      approvedAt: null,
      sharedSections: []
    },
    lifeMap: {
      academicWorkPressure: "Moderate",
      familyExpectations: "High",
      relationships: "High",
      sleepAndRoutine: "Moderate",
      selfConfidence: "Moderate",
      futureConcerns: "Very High",
      otherConcerns: "Career pivot confusion"
    },
    topicPreferences: [
      { topic: "Career Transition & Identity", status: "WANT_HELP" },
      { topic: "Boundaries in Relationships", status: "DIFFICULT_TO_DISCUSS" },
      { topic: "Past Family Conflicts", status: "NOT_READY" }
    ],
    journalEntries: [
      {
        id: "j-103-1",
        date: "2026-10-09T08:00:00.000Z",
        mindContent: "I'm considering switching to freelance design, but I'm terrified of financial instability and upsetting my family who values security.",
        difficultSituation: "A family dinner where everyone discussed traditional corporate milestones.",
        therapistUnderstand: "I feel torn between my creative aspirations and my desire to keep peace at home.",
        helpfulSupport: "Help organizing my thoughts and weighing my options objectively."
      }
    ],
    situationStories: [],
    supportCompass: {
      beingListenedTo: true,
      practicalSuggestions: false,
      timeToThink: true,
      writingInsteadOfSpeaking: true,
      helpMakingAPlan: true,
      otherPreferences: ""
    },
    aiInsightReport: null // Not generated or pending approval!
  },

  {
    id: "P-104",
    name: "Marcus Vance",
    age: 42,
    occupation: "High School Teacher",
    nextSession: "2026-10-16T15:00:00.000Z",
    sessionType: "Routine Check-in",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    lastReflectionDate: "2026-10-06T16:40:00.000Z",
    hasApprovedSharing: true,
    consentDetails: {
      status: "APPROVED",
      approvedAt: "2026-10-06T17:00:00.000Z",
      sharedSections: ["lifeMap", "topicPreferences", "journalExcerpts", "supportCompass"]
    },
    lifeMap: {
      academicWorkPressure: "Very High",
      familyExpectations: "Moderate",
      relationships: "Good",
      sleepAndRoutine: "Low",
      selfConfidence: "Moderate",
      futureConcerns: "Moderate",
      otherConcerns: "Teacher burnout"
    },
    topicPreferences: [
      { topic: "Occupational Burnout", status: "WANT_HELP" },
      { topic: "Emotional Fatigue at Home", status: "DIFFICULT_TO_DISCUSS" }
    ],
    journalEntries: [
      {
        id: "j-104-1",
        date: "2026-10-06T16:40:00.000Z",
        mindContent: "After grading papers for 4 hours, I felt completely drained of empathy. When my children asked for help with homework, I snapped.",
        difficultSituation: "Balancing grading deadlines with evening family time.",
        therapistUnderstand: "I feel guilty for having no emotional energy left for my family at the end of the day.",
        helpfulSupport: "Strategies for creating a buffer between work energy and home life."
      }
    ],
    situationStories: [],
    supportCompass: {
      beingListenedTo: true,
      practicalSuggestions: true,
      timeToThink: true,
      writingInsteadOfSpeaking: false,
      helpMakingAPlan: true,
      otherPreferences: ""
    },
    aiInsightReport: {
      generatedAt: "2026-10-06T17:05:00.000Z",
      isDemoMode: true,
      patientReportedConcerns: [
        "Compassion fatigue and burnout from teaching responsibilities.",
        "Guilt regarding emotional irritability towards family members after work."
      ],
      importantExcerpts: [
        "\"After grading papers for 4 hours, I felt completely drained of empathy.\"",
        "\"I feel guilty for having no emotional energy left for my family at the end of the day.\""
      ],
      recurringTopics: [
        {
          topic: "Work-to-Home Transition Strain",
          supportingEntries: ["Journal entry from Oct 6", "Life Map: Burnout & Sleep marked 'Low'"]
        }
      ],
      topicsDifficultToDiscuss: [
        "Emotional Fatigue at Home"
      ],
      patientStatedSupportPreferences: [
        "Seeking strategies to establish a boundary/buffer between teaching duties and home life."
      ],
      unansweredQuestions: [
        "What decompression ritual could mark the end of the school day before entering the house?"
      ],
      suggestedConversationStarters: [
        "\"Marcus, you wrote about feeling emotionally drained when transitioning from grading to family time. What does your current transition routine look like when you leave school?\""
      ],
      concisePreSessionSummary: "Marcus reports burnout from teaching and grading overload leading to emotional depletion at home. He is seeking practical transition boundaries to preserve patient family interactions."
    }
  }
];

export const predefinedScenarios = [
  {
    id: "s-1",
    title: "Handling Unexpected Criticism",
    description: "Your supervisor or peer sends a message highlighting mistakes in a project you spent days completing.",
    options: [
      "I shut down and re-read the message multiple times alone.",
      "I immediately reply trying to explain or justify every detail.",
      "I take a step back, wait a few hours, and then review it calmly.",
      "I feel upset and avoid opening the document again for the day."
    ]
  },
  {
    id: "s-2",
    title: "Social Event When Drained",
    description: "Friends invite you to a social gathering on an evening when you feel mentally exhausted.",
    options: [
      "I cancel last minute and feel guilty about it afterwards.",
      "I force myself to go, but stay quiet and leave as early as possible.",
      "I honestly tell them I need a quiet night and reschedule.",
      "I make an excuse beforehand so I don't have to decide later."
    ]
  },
  {
    id: "s-3",
    title: "Unclear Expectations",
    description: "You are given a vague task or instruction with an upcoming deadline.",
    options: [
      "I guess what is wanted and spend extra time trying to cover every angle.",
      "I feel paralyzed and put off starting the task until the last minute.",
      "I immediately ask detailed questions to clarify expectations.",
      "I worry silently without asking for help."
    ]
  }
];
