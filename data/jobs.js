// Curated list of government job notifications.
// To add a job: copy one block, change the id (must be unique) and the fields.
// Dates use YYYY-MM-DD. Use null when a date is not announced yet.
// minQualification: "10th" | "12th" | "Diploma" | "Graduate" | "Post Graduate"
// restricted: set a short text if only a special group can apply (it is hidden when "Only jobs I'm eligible for" is on).
// newsQuery: words used by `npm run fetch` to look for admit card / result / exam-date news.

window.JOBS_DATA = {
  lastEdited: "2026-11-15",
  jobs: [
    {
      id: "rrb-ntpc-ug-2026",
      title: "RRB NTPC Undergraduate Level (CEN 07/2026)",
      org: "Railway Recruitment Boards",
      category: "Railway",
      location: "All India",
      vacancies: 1688,
      addedOn: "2026-11-13",
      formStart: null,
      formEnd: "2026-11-15",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["CBT 1", "CBT 2", "Typing skill test (some posts)", "Document verification", "Medical"],
      salary: "Pay Level 2–3 (₹19,900–₹21,700 basic + allowances)",
      minQualification: "12th",
      ageMin: 18,
      ageMax: 33,
      eligibility: "Class 12 pass. Age 18–33 (relaxation for reserved categories).",
      description: "Clerical and commercial posts such as Commercial-cum-Ticket Clerk, Accounts Clerk-cum-Typist, Junior Clerk-cum-Typist and Trains Clerk. Ticketing, records, typing and station paperwork.",
      officialLink: "https://www.rrbapply.gov.in/",
      newsQuery: "RRB NTPC",
      syllabus: [
        { stage: "CBT 1 (100 Q, 90 min)", topics: ["Mathematics (30)", "General Intelligence & Reasoning (30)", "General Awareness (40)"] },
        { stage: "CBT 2 (120 Q, 90 min)", topics: ["Mathematics (35)", "General Intelligence & Reasoning (35)", "General Awareness (50)"] }
      ],
      materials: [
        { label: "RRB NTPC previous papers & pattern (freejobalert)", url: "https://www.freejobalert.com/" }
      ],
      updates: [
        { date: "2026-11-13", text: "Last date extended from 13 Nov to 15 Nov 2026 (11:59 PM).", url: "https://www.jagranjosh.com/articles/rrb-ntpc-ug-recruitment-2026-last-date-extended-to-november-15-apply-online-for-1688-vacancies-at-rrbapply-gov-in-1800019111-1" },
        { date: "2026-11-09", text: "Application correction window 9–18 Nov 2026.", url: "https://www.adda247.com/exams/railway/rrb-ntpc-vacancy-2026/" }
      ]
    },
    {
      id: "isro-sdsc-shar-2026",
      title: "ISRO SDSC SHAR – MTS, Heavy Vehicle Driver & other posts (reopened)",
      org: "ISRO – Satish Dhawan Space Centre",
      category: "Central Govt",
      location: "Sriharikota, Andhra Pradesh",
      vacancies: 97,
      addedOn: "2026-11-13",
      formStart: "2026-11-13",
      formEnd: "2026-11-16",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["Written test", "Skill test (post-wise)"],
      salary: "Varies by post (MTS: Pay Level 1, ₹18,000 basic)",
      minQualification: "10th",
      ageMin: null,
      ageMax: null,
      eligibility: "Post-wise. MTS needs Class 10. Eligibility cut-off date is 9 Nov 2026. Check age limits in the notification.",
      description: "Support and technical posts at India's rocket launch centre: multi-tasking staff, drivers and similar roles.",
      officialLink: "https://www.shar.gov.in/",
      newsQuery: "SDSC SHAR",
      syllabus: [],
      materials: [],
      updates: [
        { date: "2026-11-13", text: "Portal reopened 13 Nov (10 AM) to 16 Nov 2026 (11:59 PM).", url: "https://www.freejobalert.com/articles/isro-sdsc-shar-recruitment-2026-3074399" }
      ]
    },
    {
      id: "rrb-station-master-2026",
      title: "RRB Station Master (CEN 08/2026)",
      org: "Railway Recruitment Boards",
      category: "Railway",
      location: "All India",
      vacancies: 1265,
      addedOn: "2026-10-27",
      formStart: "2026-10-27",
      formEnd: "2026-11-25",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["CBT 1", "CBT 2", "CBAT (aptitude test)", "Document verification", "Medical"],
      salary: "Pay Level 6 (₹35,400 basic + allowances)",
      minQualification: "Graduate",
      ageMin: 20,
      ageMax: 33,
      eligibility: "Graduate in any stream. Age 20–33 as on 1 Jan 2027 (relaxation for reserved categories). Medical standards apply.",
      description: "Runs a railway station: controls train movement and signals, coordinates with guards and control office, and handles station safety and staff.",
      officialLink: "https://www.rrbapply.gov.in/",
      newsQuery: "RRB Station Master 2026",
      syllabus: [
        { stage: "CBT 1 (100 Q, 90 min)", topics: ["Mathematics (30)", "General Intelligence & Reasoning (30)", "General Awareness (40)"] },
        { stage: "CBT 2 (120 Q, 90 min)", topics: ["Mathematics (35)", "General Intelligence & Reasoning (35)", "General Awareness (50)"] },
        { stage: "CBAT", topics: ["Computer-based aptitude test (memory, perception, reaction). Min. T-score 42 in each test."] }
      ],
      materials: [
        { label: "Syllabus & exam pattern (freejobalert)", url: "https://www.freejobalert.com/articles/rrb-station-master-syllabus-and-exam-pattern-3074746" }
      ],
      updates: []
    },
    {
      id: "rrb-isolated-2026",
      title: "RRB Ministerial & Isolated Categories (CEN 09/2026)",
      org: "Railway Recruitment Boards",
      category: "Railway",
      location: "All India",
      vacancies: 191,
      addedOn: "2026-11-05",
      formStart: "2026-11-05",
      formEnd: "2026-12-04",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["CBT", "Skill / performance test (post-wise)", "Document verification"],
      salary: "Varies by post",
      minQualification: "Graduate",
      ageMin: null,
      ageMax: null,
      eligibility: "Post-specific (teachers, law assistant, translators etc.). Check the notification for your post.",
      description: "Specialised posts in railways such as teachers, translators, law assistants and lab staff.",
      officialLink: "https://www.rrbapply.gov.in/",
      newsQuery: "RRB isolated",
      syllabus: [],
      materials: [],
      updates: []
    },
    {
      id: "mpsc-group-c-2026",
      title: "MPSC Group C Services (Advt. 017/2026)",
      org: "Maharashtra Public Service Commission",
      category: "State PSC",
      location: "Maharashtra",
      vacancies: 16717,
      addedOn: "2026-11-12",
      formStart: "2026-11-13",
      formEnd: "2026-11-27",
      examDate: "2027-01-24",
      examDateText: "Prelims: 24 Jan 2027",
      examLevels: ["Prelims", "Mains", "Skill / typing test (post-wise)"],
      salary: "Varies by post (27 cadres)",
      minQualification: "Graduate",
      ageMin: 18,
      ageMax: 38,
      eligibility: "Mostly graduates (some cadres accept 10th / diploma). Age 18–38 for open category, relaxation for others.",
      description: "Clerk-Typist, Tax Assistant, Talathi, Assistant Motor Vehicle Inspector, Industry Inspector and other Maharashtra government posts. Office, revenue and inspection work.",
      officialLink: "https://mpsconline.gov.in/",
      newsQuery: "MPSC Group C 2026",
      syllabus: [
        { stage: "Prelims (objective)", topics: ["Current affairs", "History & Geography (Maharashtra focus)", "Polity & Economy", "General Science", "Reasoning & Arithmetic", "Marathi & English"] },
        { stage: "Mains", topics: ["Paper 1: Marathi & English", "Paper 2: General Studies + post-specific subjects"] }
      ],
      materials: [
        { label: "Official notification & syllabus (testbook summary)", url: "https://testbook.com/news/mpsc-group-c-2026-notification-out/" }
      ],
      updates: [
        { date: "2026-11-12", text: "Vacancies revised to 16,717 (from 16,797).", url: "https://www.adda247.com/exams/maharashtra/mpsc-group-c-recruitment-2026/" }
      ]
    },
    {
      id: "appsc-group-2-2026",
      title: "APPSC Group 2 Executive & Non-Executive (Notif. 37/2026)",
      org: "Andhra Pradesh Public Service Commission",
      category: "State PSC",
      location: "Andhra Pradesh",
      vacancies: 720,
      addedOn: "2026-11-10",
      formStart: "2026-11-10",
      formEnd: "2026-12-11",
      examDate: "2027-02-21",
      examDateText: "Screening test: 21 Feb 2027",
      examLevels: ["Screening test (OMR)", "Mains (2 papers)", "Computer proficiency test", "Document verification"],
      salary: "₹25,220 – ₹1,30,580 (varies by post)",
      minQualification: "Graduate",
      ageMin: 18,
      ageMax: 42,
      eligibility: "Bachelor's degree (+ post-specific requirements). Age 18–42 for most posts, some posts 18–30 or 21–44, as on 1 Jul 2026. Earlier reports said last date 30 Nov; latest say 11 Dec, so verify on the site.",
      description: "Deputy Tahsildar, Deputy MPDO, GST Officer, Assistant Section Officer, Senior and Junior Accountant. Revenue, rural development, tax and secretariat work in AP.",
      officialLink: "https://psc.ap.gov.in/",
      newsQuery: "APPSC Group 2 2026",
      syllabus: [
        { stage: "Screening test (150 Q)", topics: ["Indian History", "Geography", "Indian Polity", "Indian Economy", "Current affairs", "Mental ability"] },
        { stage: "Mains", topics: ["Paper 1: Social & cultural history of AP, Indian Constitution", "Paper 2: Indian & AP economy, Science & Technology"] }
      ],
      materials: [
        { label: "Eligibility & pattern (careerpower)", url: "https://www.careerpower.in/appsc-group-2.html" }
      ],
      updates: []
    },
    {
      id: "opsc-aso-2026",
      title: "OPSC Assistant Section Officer (Group B)",
      org: "Odisha Public Service Commission",
      category: "State PSC",
      location: "Odisha",
      vacancies: 340,
      addedOn: "2026-11-09",
      formStart: "2026-11-09",
      formEnd: "2026-11-30",
      examDate: "2027-01-17",
      examDateText: "Written: 17 Jan 2027",
      examLevels: ["Written exam (400 marks)", "Computer skill test (50 marks, qualifying)"],
      salary: "₹35,400 – ₹1,12,400 (Level 9)",
      minQualification: "Graduate",
      ageMin: 21,
      ageMax: 42,
      eligibility: "Bachelor's degree + computer knowledge. Age 21–42 as on 1 Jan 2026. Form closes 30 Nov at 5 PM.",
      description: "Secretariat officer in the Odisha government: file processing, drafting notes and supporting department decisions.",
      officialLink: "https://www.opsc.gov.in/",
      newsQuery: "OPSC ASO 2026",
      syllabus: [
        { stage: "Written exam", topics: ["Detailed syllabus is in the official notification PDF"] }
      ],
      materials: [
        { label: "Notification summary (testbook)", url: "https://testbook.com/opsc-aso" }
      ],
      updates: []
    },
    {
      id: "dsssb-mts-2026",
      title: "DSSSB Multi Tasking Staff (Advt. 06/2026)",
      org: "Delhi Subordinate Services Selection Board",
      category: "State Govt",
      location: "Delhi",
      vacancies: 1075,
      addedOn: "2026-11-05",
      formStart: "2026-11-12",
      formEnd: "2026-12-11",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["One-tier written exam", "Document scrutiny"],
      salary: "Pay Level 1 (₹18,000 – ₹56,900)",
      minQualification: "10th",
      ageMin: 18,
      ageMax: 27,
      eligibility: "Class 10 pass. Age 18–27 as on 11 Dec 2026 (relaxation for reserved categories).",
      description: "Office support staff in Delhi government departments: files, dispatch, upkeep of office and basic clerical help.",
      officialLink: "https://dsssbonline.nic.in/",
      newsQuery: "DSSSB MTS 2026",
      syllabus: [
        { stage: "One-tier exam (based on previous DSSSB pattern)", topics: ["General Awareness", "General Intelligence & Reasoning", "Arithmetic & Numerical Ability", "Hindi Language", "English Language"] }
      ],
      materials: [
        { label: "Notification summary (testbook)", url: "https://testbook.com/dsssb-mts" }
      ],
      updates: []
    },
    {
      id: "upsc-13-2026",
      title: "UPSC Recruitment – Dental Surgeon, Ayurveda/Homeopathic Physician, Scientist (Advt. 13/2026)",
      org: "Union Public Service Commission",
      category: "Central Govt",
      location: "All India",
      vacancies: 13,
      addedOn: "2026-11-14",
      formStart: "2026-11-14",
      formEnd: "2026-12-04",
      examDate: null,
      examDateText: "Recruitment test / interview, TBA",
      examLevels: ["Recruitment test (if held)", "Interview"],
      salary: "See notification",
      minQualification: "Graduate",
      restricted: "Needs a post-specific professional degree (BDS, BAMS, BHMS, etc.)",
      ageMin: null,
      ageMax: null,
      eligibility: "Post-specific professional degree and experience. Check the notification.",
      description: "Specialist medical and scientific posts in central government departments.",
      officialLink: "https://upsconline.nic.in/",
      newsQuery: "UPSC dental surgeon",
      syllabus: [],
      materials: [],
      updates: []
    },
    {
      id: "sbi-sco-2026",
      title: "SBI Specialist Officers – Security Officer & AM (Fire)",
      org: "State Bank of India",
      category: "Bank",
      location: "All India",
      vacancies: 77,
      addedOn: "2026-11-04",
      formStart: "2026-11-04",
      formEnd: "2026-11-25",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["Shortlisting / online test", "Interview"],
      salary: "See notification",
      minQualification: "Graduate",
      restricted: "Security Officer needs officer-level service in Army/Police/CAPF; AM (Fire) needs B.E. Fire/Safety",
      ageMin: null,
      ageMax: null,
      eligibility: "60 Security Officer + 17 Assistant Manager (Fire Engineer). Post-specific qualification and experience.",
      description: "Bank security management and fire-safety engineering for SBI branches and offices.",
      officialLink: "https://sbi.bank.in/web/careers",
      newsQuery: "SBI security officer",
      syllabus: [],
      materials: [],
      updates: []
    },
    {
      id: "bsf-si-ldce-2026",
      title: "BSF Sub-Inspector (GD) – LDCE",
      org: "Border Security Force",
      category: "Defence / Police",
      location: "All India",
      vacancies: 1167,
      addedOn: "2026-11-12",
      formStart: "2026-11-12",
      formEnd: "2026-12-31",
      examDate: null,
      examDateText: "To be announced",
      examLevels: ["Departmental written exam", "Physical / medical"],
      salary: "Pay Level 6 (₹35,400 – ₹1,12,400)",
      minQualification: "12th",
      restricted: "Serving BSF personnel only (departmental exam)",
      ageMin: null,
      ageMax: null,
      eligibility: "Limited Departmental Competitive Exam, only for serving BSF personnel.",
      description: "Promotion route to Sub-Inspector for existing BSF staff.",
      officialLink: "https://rectt.bsf.gov.in/",
      newsQuery: "BSF SI",
      syllabus: [],
      materials: [],
      updates: []
    },
    {
      id: "ssc-chsl-2026",
      title: "SSC CHSL 2026 – LDC / JSA / DEO",
      org: "Staff Selection Commission",
      category: "Central Govt",
      location: "All India",
      vacancies: 2536,
      addedOn: "2026-09-07",
      formStart: "2026-09-07",
      formEnd: "2026-10-07",
      examDate: "2026-11-30",
      examDateText: "Tier 1: 30 Nov – 31 Dec 2026",
      examLevels: ["Tier 1 (CBT)", "Tier 2 (CBT + typing/skill test)", "Document verification"],
      salary: "LDC/JSA: ₹19,900 basic (Level 2); DEO: ₹25,500 basic (Level 4)",
      minQualification: "12th",
      ageMin: 18,
      ageMax: 27,
      eligibility: "Class 12 pass. Age 18–27 (relaxation for reserved categories).",
      description: "Clerks and data entry operators in central government ministries and offices: typing, records, data entry and office correspondence.",
      officialLink: "https://ssc.gov.in/",
      newsQuery: "SSC CHSL 2026",
      syllabus: [
        { stage: "Tier 1 (100 Q, 200 marks, 60 min)", topics: ["English Language (25)", "General Intelligence (25)", "Quantitative Aptitude (25)", "General Awareness (25)"] },
        { stage: "Tier 2", topics: ["Mathematical Abilities", "Reasoning & General Intelligence", "English Language & Comprehension", "General Awareness", "Computer Knowledge", "Typing test / Skill test (DEO)"] }
      ],
      materials: [
        { label: "Exam pattern & cut-offs (careerpower)", url: "https://www.careerpower.in/ssc-chsl.html" },
        { label: "Previous year papers (testbook)", url: "https://testbook.com/ssc-chsl" }
      ],
      updates: [
        { date: "2026-10-01", text: "Tier 1 exam dates announced: 30 Nov – 31 Dec 2026.", url: "https://testbook.com/ssc-chsl" },
        { date: "2026-10-02", text: "Expected: exam city slip around 22 Nov.", url: "https://www.careerpower.in/blog/ssc-chsl-exam-date-2026" },
        { date: "2026-10-02", text: "Expected: admit card around 27 Nov (3–4 days before exam).", url: "https://www.careerpower.in/ssc-chsl-admit-card.html" }
      ]
    },
    {
      id: "ibps-rrb-po-2026",
      title: "IBPS RRB PO (Officer Scale I) – CRP RRB XV",
      org: "Institute of Banking Personnel Selection",
      category: "Bank",
      location: "All India",
      vacancies: 4256,
      addedOn: "2026-09-01",
      formStart: "2026-09-01",
      formEnd: "2026-09-27",
      examDate: "2026-11-21",
      examDateText: "Prelims: 21–22 Nov 2026 · Mains: 20 Dec 2026",
      examLevels: ["Prelims", "Mains", "Interview"],
      salary: "≈ ₹48,480 per month gross (Officer Scale I)",
      minQualification: "Graduate",
      ageMin: 18,
      ageMax: 30,
      eligibility: "Graduate in any discipline, knowledge of the local language. Age 18–30.",
      description: "Officer in a Regional Rural Bank: branch operations, loans to farmers and small businesses, and customer service.",
      officialLink: "https://www.ibps.in/",
      newsQuery: "IBPS RRB PO 2026",
      syllabus: [
        { stage: "Prelims (80 Q, 45 min)", topics: ["Reasoning (40)", "Quantitative Aptitude (40)"] },
        { stage: "Mains", topics: ["Reasoning", "Quantitative Aptitude", "General Awareness", "English / Hindi Language", "Computer Knowledge"] }
      ],
      materials: [
        { label: "Exam schedule & pattern (bankersadda)", url: "https://www.bankersadda.com/ibps-rrb-po-notification-2026/" }
      ],
      updates: [
        { date: "2026-11-11", text: "Prelims admit card (call letter) out at ibps.in.", url: "https://www.ibps.in/" }, { date: "2026-11-10", text: "Prelims on 21–22 Nov 2026.", url: "https://testbook.com/news/ibps-rrb-po-prelims-admit-card-2026/" },
        { date: "2026-11-11", text: "Mains date reported as 20 Dec 2026 (some sites say 29 Dec, so verify).", url: "https://www.bankersadda.com/ibps-rrb-po-notification-2026/" }
      ]
    }
  ]
};
