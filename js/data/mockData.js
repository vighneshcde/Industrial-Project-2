// mockData.js - AegisFlow™ Indian Corporate Governance & Statutory Treasury Knowledge Base

export const MOCK_ENTITIES = [
  {
    id: "ENT-IN-001",
    name: "Tata Consultancy Services (TCS) Ltd",
    jurisdiction: "india",
    entityType: "Public Limited Company (BSE/NSE: TCS)",
    incorporationDate: "1995-01-19",
    cin: "L22210MH1995PLC084781",
    pan: "AAACA1234T",
    gstin: "27AAACA1234T1Z8",
    headcount: 601546,
    annualTurnoverCr: 240893.0,
    currency: "INR",
    currencySymbol: "₹",
    sector: "Information Technology & Global Cloud",
    operatingStates: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi NCR", "Telangana"],
    isCrossBorder: true,
    isDataFiduciary: true,
    treasuryBalance: 48500000.00
  },
  {
    id: "ENT-IN-002",
    name: "Reliance Industries Ltd (Jio Digital)",
    jurisdiction: "india",
    entityType: "Public Limited Conglomerate (BSE/NSE: RELIANCE)",
    incorporationDate: "1973-05-08",
    cin: "L17110MH1973PLC019786",
    pan: "AAACR5678J",
    gstin: "27AAACR5678J1Z2",
    headcount: 347000,
    annualTurnoverCr: 998000.0,
    currency: "INR",
    currencySymbol: "₹",
    sector: "Telecom, 5G & Digital Platforms",
    operatingStates: ["Maharashtra", "Gujarat", "Delhi NCR", "Karnataka"],
    isCrossBorder: true,
    isDataFiduciary: true,
    treasuryBalance: 85000000.00
  },
  {
    id: "ENT-IN-003",
    name: "Infosys Limited",
    jurisdiction: "india",
    entityType: "Public Limited Technology Enterprise (BSE/NSE: INFY)",
    incorporationDate: "1981-07-02",
    cin: "L85110KA1981PLC013115",
    pan: "AAACI4321K",
    gstin: "29AAACI4321K1ZF",
    headcount: 317000,
    annualTurnoverCr: 153670.0,
    currency: "INR",
    currencySymbol: "₹",
    sector: "Next-Gen Digital & AI Services",
    operatingStates: ["Karnataka", "Maharashtra", "Telangana", "Kerala"],
    isCrossBorder: true,
    isDataFiduciary: true,
    treasuryBalance: 32000000.00
  },
  {
    id: "ENT-IN-004",
    name: "HDFC Bank Limited",
    jurisdiction: "india",
    entityType: "Scheduled Commercial Banking Corporation (BSE/NSE: HDFCBANK)",
    incorporationDate: "1994-08-30",
    cin: "L65920MH1994PLC080618",
    pan: "AAACH9988H",
    gstin: "27AAACH9988H1ZV",
    headcount: 177000,
    annualTurnoverCr: 210000.0,
    currency: "INR",
    currencySymbol: "₹",
    sector: "Banking, Treasury & Financial Services",
    operatingStates: ["All India - 36 States & UTs"],
    isCrossBorder: true,
    isDataFiduciary: true,
    treasuryBalance: 125000000.00
  },
  {
    id: "ENT-IN-005",
    name: "Zomato / Blinkit (Eternal Ltd)",
    jurisdiction: "india",
    entityType: "Listed Technology & Quick-Commerce (BSE/NSE: ZOMATO)",
    incorporationDate: "2010-01-18",
    cin: "L93030HR2010PLC040607",
    pan: "AAACZ2468Z",
    gstin: "06AAACZ2468Z1Z0",
    headcount: 8400,
    annualTurnoverCr: 12114.0,
    currency: "INR",
    currencySymbol: "₹",
    sector: "Quick Commerce, Food Delivery & Hyperlocal Logistics",
    operatingStates: ["Haryana", "Delhi NCR", "Maharashtra", "Karnataka"],
    isCrossBorder: false,
    isDataFiduciary: true,
    treasuryBalance: 9500000.00
  }
];

export const CORPORATE_BANK_ACCOUNTS = [
  {
    id: "BANK-HDFC-01",
    bankName: "HDFC Bank Ltd - Corporate Banking Branch",
    accountType: "Primary Statutory Treasury Current Account",
    accountNumberMasked: "5020 •••• 9842",
    availableBalance: 48500000.00,
    status: "ACTIVE",
    isPrimaryForStatutoryAutoPay: true
  },
  {
    id: "BANK-SBI-02",
    bankName: "State Bank of India (SBI) - Commercial Branch",
    accountType: "Statutory Tax & Duty Escrow Reserve Account",
    accountNumberMasked: "3892 •••• 4120",
    availableBalance: 25000000.00,
    status: "ACTIVE",
    isPrimaryForStatutoryAutoPay: false
  },
  {
    id: "BANK-ICICI-03",
    bankName: "ICICI Bank Ltd - Corporate Banking",
    accountType: "Payroll & EPFO Direct Remittance Account",
    accountNumberMasked: "0011 •••• 7731",
    availableBalance: 18000000.00,
    status: "ACTIVE",
    isPrimaryForStatutoryAutoPay: false
  }
];

export const REGULATORY_AUTHORITIES = {
  india: [
    { id: "GSTN", name: "Goods & Services Tax Network (GSTN)", portal: "gst.gov.in", badge: "Indirect Tax" },
    { id: "CBDT", name: "Central Board of Direct Taxes (Income Tax)", portal: "incometax.gov.in", badge: "Direct Tax" },
    { id: "MCA", name: "Ministry of Corporate Affairs (MCA21)", portal: "mca.gov.in", badge: "Corporate Law" },
    { id: "EPFO", name: "Employees' Provident Fund Organisation", portal: "epfindia.gov.in", badge: "Labor & Payroll" },
    { id: "SEBI", name: "Securities & Exchange Board of India", portal: "sebi.gov.in", badge: "Securities Market" },
    { id: "RBI", name: "Reserve Bank of India (FEMA / Treasury)", portal: "rbi.org.in", badge: "Foreign Exchange & Banking" },
    { id: "DPDPB", name: "Data Protection Board of India", portal: "meity.gov.in", badge: "Data Privacy" }
  ]
};

export const INITIAL_OBLIGATIONS = [
  {
    id: "OBL-001",
    entityId: "ENT-IN-001",
    title: "GSTR-3B Monthly Return & Tax Remittance",
    act: "Central Goods and Services Tax Act, 2017",
    authority: "GSTN",
    category: "Indirect Tax",
    dueDate: "2026-08-20",
    daysRemaining: 4,
    status: "Verified",
    riskLevel: "HIGH",
    department: "Finance & Accounts",
    assignedTo: "Priya Sharma",
    calculatedLiability: "₹5,20,000.00",
    verifiedProofId: "DOC-GST-CHALLAN-2026-07",
    verificationStatus: "AI_VERIFIED_PASS",
    lastAuditTimestamp: "2026-08-15 14:32:00"
  },
  {
    id: "OBL-002",
    entityId: "ENT-IN-001",
    title: "EPF Monthly ECR Filing & Electronic Challan Deposit",
    act: "Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
    authority: "EPFO",
    category: "Labor & Payroll",
    dueDate: "2026-08-15",
    daysRemaining: -1,
    status: "Verified",
    riskLevel: "CRITICAL",
    department: "HR & Payroll",
    assignedTo: "Deepak Mehta",
    calculatedLiability: "₹3,48,000.00",
    verifiedProofId: "DOC-EPF-ECR-JUL2026",
    verificationStatus: "AI_VERIFIED_PASS",
    lastAuditTimestamp: "2026-08-14 11:20:00"
  },
  {
    id: "OBL-003",
    entityId: "ENT-IN-001",
    title: "Monthly TDS Remittance under Section 194J / 192",
    act: "Income Tax Act, 1961",
    authority: "CBDT",
    category: "Direct Tax",
    dueDate: "2026-08-07",
    daysRemaining: -9,
    status: "Flagged Discrepancy",
    riskLevel: "CRITICAL",
    department: "Finance & Accounts",
    assignedTo: "Priya Sharma",
    calculatedLiability: "₹1,85,000.00",
    verifiedProofId: "DOC-TDS-CHALLAN-DISCREPANCY",
    verificationStatus: "AI_DISCREPANCY_FLAGGED",
    lastAuditTimestamp: "2026-08-15 18:04:12"
  },
  {
    id: "OBL-004",
    entityId: "ENT-IN-001",
    title: "Form AOC-4 - Annual Financial Statements Filing",
    act: "Companies Act, 2013",
    authority: "MCA",
    category: "Corporate Secretarial",
    dueDate: "2026-09-30",
    daysRemaining: 45,
    status: "In Progress",
    riskLevel: "MEDIUM",
    department: "Legal & Secretarial",
    assignedTo: "Adv. Sunita Kulkarni",
    calculatedLiability: "Statutory Filing Fee ₹1,200.00",
    verifiedProofId: null,
    verificationStatus: "PENDING_PROOF",
    lastAuditTimestamp: null
  },
  {
    id: "OBL-005",
    entityId: "ENT-IN-001",
    title: "DPDP Act Digital Data Mapping & Consent Audit",
    act: "Digital Personal Data Protection Act, 2023",
    authority: "DPDPB",
    category: "Data Privacy",
    dueDate: "2026-10-31",
    daysRemaining: 76,
    status: "In Progress",
    riskLevel: "HIGH",
    department: "InfoSec & Legal",
    assignedTo: "Rahul Sen (DPO)",
    calculatedLiability: "Internal Governance Audit",
    verifiedProofId: null,
    verificationStatus: "PENDING_PROOF",
    lastAuditTimestamp: null
  },
  {
    id: "OBL-006",
    entityId: "ENT-IN-001",
    title: "Advance Tax Q2 Second Installment (45% Cumulative)",
    act: "Income Tax Act, 1961 (Section 211)",
    authority: "CBDT",
    category: "Direct Tax",
    dueDate: "2026-09-15",
    daysRemaining: 30,
    status: "Pending Review",
    riskLevel: "HIGH",
    department: "Finance & Accounts",
    assignedTo: "Priya Sharma",
    calculatedLiability: "₹14,20,000.00",
    verifiedProofId: null,
    verificationStatus: "PENDING_PAYMENT",
    lastAuditTimestamp: null
  }
];

export const MASTER_OBLIGATION_TEMPLATES = [
  {
    templateId: "IN-GST-01",
    jurisdiction: "india",
    title: "GSTR-3B Monthly Tax Return & Challan Payment",
    act: "Central Goods and Services Tax Act, 2017",
    section: "Section 39(1) read with Rule 61(5)",
    authority: "GSTN",
    category: "Indirect Tax",
    department: "Finance & Accounts",
    frequency: "Monthly",
    dueDayOfMonth: 20,
    penaltyDescription: "₹50/day late fee + 18% p.a. penal interest on unpaid tax liability",
    applicabilityRule: (entity) => entity.jurisdiction === "india" && entity.gstin && entity.gstin !== "N/A",
    defaultAssignedTo: "Priya Sharma (Senior Tax Accountant)",
    riskWeight: 9
  },
  {
    templateId: "IN-MCA-01",
    jurisdiction: "india",
    title: "Form AOC-4 - Annual Financial Statements Filing",
    act: "Companies Act, 2013",
    section: "Section 137(1) read with Rule 12",
    authority: "MCA",
    category: "Corporate Secretarial",
    department: "Legal & Secretarial",
    frequency: "Annual",
    dueDayOfMonth: 30,
    penaltyDescription: "₹100 per day of default with no upper limit for company and directors",
    applicabilityRule: (entity) => entity.jurisdiction === "india",
    defaultAssignedTo: "Adv. Sunita Kulkarni (Company Secretary)",
    riskWeight: 9.5
  },
  {
    templateId: "IN-IT-01",
    jurisdiction: "india",
    title: "Monthly TDS Remittance & Challan 281 Payment",
    act: "Income Tax Act, 1961",
    section: "Section 192, 194C, 194J, 200(1)",
    authority: "CBDT",
    category: "Direct Tax",
    department: "Finance & Accounts",
    frequency: "Monthly",
    dueDayOfMonth: 7,
    penaltyDescription: "1.5% interest per month from date of deduction till deposit + penalty under Sec 271C",
    applicabilityRule: (entity) => entity.jurisdiction === "india",
    defaultAssignedTo: "Priya Sharma (Senior Tax Accountant)",
    riskWeight: 9
  },
  {
    templateId: "IN-LABOR-01",
    jurisdiction: "india",
    title: "Monthly Provident Fund (EPF) ECR Deposit & Electronic Filing",
    act: "Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
    section: "Section 6 read with EPF Scheme Para 38",
    authority: "EPFO",
    category: "Labor & Payroll",
    department: "HR & Payroll",
    frequency: "Monthly",
    dueDayOfMonth: 15,
    penaltyDescription: "Damages up to 25% p.a. under Sec 14B + 12% interest under Sec 7Q",
    applicabilityRule: (entity) => entity.jurisdiction === "india" && entity.headcount >= 20,
    defaultAssignedTo: "Deepak Mehta (HR Payroll Lead)",
    riskWeight: 9.5
  }
];

export const SIMULATED_REGULATORY_CIRCULARS = [
  {
    circularId: "CIRC-GST-2026-04",
    authority: "GSTN",
    jurisdiction: "india",
    publishedDate: "2026-08-14",
    officialGazetteNo: "Notification No. 24/2026-Central Tax",
    title: "Lowering of Mandatory E-Invoicing Threshold to ₹2.5 Crores Turnover",
    originalLegaleseText: `In exercise of the powers conferred by sub-rule (4) of rule 48 of the Central Goods and Services Tax Rules, 2017, the Government notifies that registered persons whose aggregate turnover in any preceding financial year exceeds two crore and fifty lakh rupees (INR 2,50,00,000) shall prepare e-invoices with effect from 1st October 2026.`,
    extractedKeyClauses: [
      { clause: "Threshold Change", detail: "Turnover limit reduced to ₹2.5 Cr" },
      { clause: "Effective Date", detail: "October 1, 2026" },
      { clause: "Affected Transactions", detail: "B2B and B2G Supplies + Exports" }
    ],
    applicableTurnoverMinCr: 2.5,
    applicableSectors: ["All", "IT & Global Cloud", "Fintech & SaaS", "Services"],
    aiSummary: "The GST Council has lowered the mandatory B2B E-invoicing threshold to ₹2.5 Crore. Because your annual turnover exceeds ₹2.5 Cr, your ERP must generate IRN and QR codes before Oct 1, 2026.",
    impactSeverity: "HIGH",
    suggestedObligation: {
      title: "Mandatory GST E-Invoicing ERP Integration & Test IRN Generation",
      deadline: "2026-09-25",
      category: "Indirect Tax",
      department: "Finance & IT",
      estimatedEffortDays: 14
    }
  }
];

export const SAMPLE_DOCUMENTS_FOR_AUDIT = [
  {
    docId: "DOC-GST-CHALLAN-2026-07",
    name: "GST_PMT06_Challan_July2026.pdf",
    category: "Tax Challan",
    linkedObligationId: "OBL-001",
    documentType: "GST PMT-06 Challan",
    fileSize: "184 KB",
    uploadDate: "2026-08-15 14:32:00",
    uploadedBy: "Priya Sharma (Senior Tax Accountant)",
    status: "Verified",
    rawOcrText: `GOVERNMENT OF INDIA - GOODS AND SERVICES TAX
CHALLAN FOR DEPOSIT OF GST (FORM GST PMT-06)
CPIN: 26082910394819 | GSTIN: 27AAACA1234T1Z8
Taxpayer: TATA CONSULTANCY SERVICES (TCS) LTD
----------------------------------------------------------------------
CGST: ₹1,45,000.00 | SGST: ₹1,45,000.00 | IGST: ₹2,30,000.00
Total Paid: ₹5,20,000.00 (Rupees Five Lakh Twenty Thousand Only)
Bank CIN: HDFC2608149810293 | Paid Date: 14-Aug-2026
Status: PAID / TRANSACTION SUCCESSFUL
Digital Seal: Valid SHA-256 (GSTN Server Token: 9f8a3c4b)`,
    extractedFields: {
      gstin: "27AAACA1234T1Z8",
      taxpayerName: "TATA CONSULTANCY SERVICES (TCS) LTD",
      cpin: "26082910394819",
      cin: "HDFC2608149810293",
      paymentDate: "2026-08-14",
      totalAmountPaid: "₹5,20,000.00",
      calculatedLiability: "₹5,20,000.00",
      paymentStatus: "PAID",
      signatureValid: "Valid SHA-256"
    },
    auditChecks: [
      { checkName: "Entity GSTIN Match", status: "PASS", detail: "Matches Company Profile: 27AAACA1234T1Z8" },
      { checkName: "2-Day Pre-Due-Date Realization", status: "PASS", detail: "Realized on Aug 14 (6 days before Aug 20 due date)" },
      { checkName: "Amount Reconciliation", status: "PASS", detail: "Paid ₹5,20,000.00 matches General Ledger Liability (0% variance)" },
      { checkName: "Bank BSR/CIN Validation", status: "PASS", detail: "Valid CIN HDFC2608149810293 confirmed by RBI gateway" }
    ],
    mismatchDetected: false,
    discrepancySummary: null,
    confidenceScore: 99.4
  },
  {
    docId: "DOC-TDS-CHALLAN-DISCREPANCY",
    name: "TDS_Challan281_Quarter1_Flagged.pdf",
    category: "Direct Tax",
    linkedObligationId: "OBL-003",
    documentType: "ITNS 281 TDS Challan",
    fileSize: "162 KB",
    uploadDate: "2026-08-15 18:04:12",
    uploadedBy: "Junior Accountant",
    status: "Flagged Discrepancy",
    rawOcrText: `INCOME TAX DEPARTMENT - CHALLAN ITNS 281
TAN: BLRA12345C | PAN: AAACA1234T
Company: TATA CONSULTANCY SERVICES (TCS) LTD
Section: 194J (Professional / Technical Fees)
----------------------------------------------------------------------
Basic Tax Paid: ₹1,20,000.00 | Education Cess: ₹4,800.00
Total Paid on Challan: ₹1,24,800.00
Bank BSR Code: 0290142 | Tender Date: 07-Aug-2026`,
    extractedFields: {
      tan: "BLRA12345C",
      companyName: "TATA CONSULTANCY SERVICES (TCS) LTD",
      section: "194J",
      totalAmountPaid: "₹1,24,800.00",
      calculatedLiability: "₹1,85,000.00",
      paymentDate: "2026-08-07",
      bsrCode: "0290142"
    },
    auditChecks: [
      { checkName: "TAN & PAN Alignment", status: "PASS", detail: "TAN BLRA12345C mapped to entity" },
      { checkName: "Amount Reconciliation", status: "FAIL", detail: "SHORTFALL: Paid ₹1,24,800 vs Ledger Liability ₹1,85,000. Unresolved balance: ₹60,200.00!" },
      { checkName: "Penal Interest Alert", status: "WARN", detail: "Accruing 1.5% per month interest under Sec 201(1A)" }
    ],
    mismatchDetected: true,
    discrepancySummary: "SHORTFALL DETECTED: Paid ₹1,24,800 leaves an unpaid balance of ₹60,200 against books. Remedial payment authorized via 2-Day Pre-Due-Date Engine.",
    confidenceScore: 97.2
  }
];

export const NOTICE_DEFENSE_TEMPLATES = [
  {
    id: "NOT-GST-73",
    authority: "GSTN / DGGI",
    statute: "CGST Act, 2017 - Section 73(1)",
    title: "Notice for Alleged Input Tax Credit (ITC) Mismatch (GSTR-2B vs GSTR-3B)",
    sampleNoticeSnippet: "Whereas upon scrutiny of returns for FY 2024-25, it is observed that ITC availed in Table 4(A)(5) exceeds the eligible ITC reflected in Form GSTR-2B by ₹84,200. You are hereby required to show cause...",
    recommendedLegalGrounds: [
      "Invoices are genuine and tax has been deposited by suppliers per Sec 16(2)(c)",
      "Timing difference of supplier return filing resolved in subsequent tax periods",
      "Doctrine of bona fide purchasing dealer as affirmed by High Court precedents"
    ],
    generatedDraftReply: `BEFORE THE SUPERINTENDENT OF CENTRAL TAX & GST
In the Matter of: TATA CONSULTANCY SERVICES (TCS) LTD (GSTIN: 27AAACA1234T1Z8)
Subject: Formal Written Submissions in Response to Scrutiny Notice under Section 73(1)

RESPECTFULLY SHEWETH:
1. That the taxpayer has consistently complied with all statutory requirements under Section 39 read with Rule 61 of the CGST Rules, 2017.
2. The alleged variance of ₹84,200 is attributable entirely to timing differences where supplier GSTR-1 filings were uploaded after the initial cutoff date but fully reconciled in subsequent monthly cycles.
3. In view of the verifiable e-invoices and PMT-06 challan receipts attached herewith in Annexure A, no penal interest under Section 50 or penalty under Section 73(9) is legally attracted.

PRAYER:
In light of the documentary evidence produced, it is respectfully prayed that the proceedings initiated under the subject notice may kindly be dropped.`
  },
  {
    id: "NOT-IT-143",
    authority: "Income Tax Department (CPC)",
    statute: "Income Tax Act, 1961 - Section 143(1)(a)",
    title: "Intimation for Proposed Adjustment in TDS Credit Claimed",
    sampleNoticeSnippet: "Notice of proposed adjustment under section 143(1)(a): TDS claimed in Schedule TDS 2 exceeds the total TDS reflected in Form 26AS by ₹24,500...",
    recommendedLegalGrounds: [
      "Deductor has deducted tax at source as evidenced by Form 16A certificates",
      "Mismatch arisen solely due to delayed quarterly TDS return filing by deductor",
      "Section 205 prohibits direct demand on payee when tax has been deducted at source"
    ],
    generatedDraftReply: `TO THE ASSESSING OFFICER, CENTRALIZED PROCESSING CENTER (CPC)
In the Matter of: TATA CONSULTANCY SERVICES (TCS) LTD (PAN: AAACA1234T)
Subject: Detailed Objections to Proposed Adjustments under Section 143(1)(a)

RESPECTFULLY SUBMITTED:
1. That tax amounting to ₹24,500 was duly deducted by deductors during Q4 as evidenced by digitally signed Form 16A certificates annexed hereto.
2. Under Section 205 of the Income Tax Act, 1961, where tax has been deducted at source, the assessee cannot be called upon to pay tax again merely due to deductor's procedural delay in uploading returns.

PRAYER:
It is humbly requested that the full credit of TDS as claimed in the return of income be granted and intimation issued without any adverse adjustment.`
  }
];

export const KNOWLEDGE_GRAPH_DATA = {
  nodes: [
    { id: "act_cgst", label: "CGST Act 2017", type: "act", group: "tax", radius: 24 },
    { id: "act_ca2013", label: "Companies Act 2013", type: "act", group: "corporate", radius: 24 },
    { id: "act_it1961", label: "Income Tax Act 1961", type: "act", group: "tax", radius: 24 },
    { id: "entity_tcs", label: "Tata Consultancy Services (TCS)", type: "entity", group: "entity", radius: 28 },
    { id: "obl_gstr3b", label: "GSTR-3B Auto-Pay ₹5.20L", type: "obligation", group: "tax", radius: 18 },
    { id: "obl_tds", label: "TDS Shortfall (₹60.2k Gap)", type: "obligation", group: "tax", radius: 18 },
    { id: "doc_pmt06", label: "PMT-06 Challan Receipt", type: "evidence", group: "evidence", radius: 14 }
  ],
  links: [
    { source: "act_cgst", target: "obl_gstr3b", label: "mandates" },
    { source: "act_it1961", target: "obl_tds", label: "enforces" },
    { source: "entity_tcs", target: "obl_gstr3b", label: "responsible_for" },
    { source: "entity_tcs", target: "obl_tds", label: "responsible_for" },
    { source: "obl_gstr3b", target: "doc_pmt06", label: "verified_by_payment" }
  ]
};

export const COPILOT_PRELOADED_QA = [
  {
    triggers: ["remote employee", "hiring in another state", "inter-state compliance", "state pt"],
    answer: `### 🌐 Inter-State Compliance Checklist for Indian Enterprises\n\n1. **State Professional Tax (PT)**: Register for PTRC/PTEC in the employee's state within 30 days.\n2. **EPF & ESI**: EPFO Unified Portal covers Pan-India. Map ESI to local branch dispensary if wage ≤ ₹21,000/month.\n3. **AegisFlow Auto-Pay**: The 2-Day Pre-Due-Date engine auto-schedules monthly state PT payments.`
  },
  {
    triggers: ["pre due date", "2 days before", "automatic pay", "how does payment work", "aegisflow", "indian currency"],
    answer: `### ⚡ AegisFlow™ 2-Day Pre-Due-Date Indian Statutory Payment Engine\n\n- **Proactive Calculation**: Computes exact liabilities in **Indian Rupees (₹ - INR)** and prepares statutory challans (GST PMT-06, TDS ITNS 281, Advance Tax ITNS 280) **2 days before every statutory deadline**.\n- **User Authorization**: Dispatches an **"Approve & Pay Money"** card with pre-filled bank details.\n- **1-Click Execution**: On your authorization, the agent executes simulated payment, stamps a SHA-256 digital signature, and archives the receipt into SQLite \`compliance.db\`!`
  }
];
