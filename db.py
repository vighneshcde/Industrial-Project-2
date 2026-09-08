"""
AegisFlow AI - SQLite Database Initialization & Indian Enterprise Seed Data
Supports 100% Indian Currency (₹ - INR) and Familiar Indian Corporate Profiles (TCS, Reliance Jio, Infosys, HDFC Bank, Zomato).
"""

import sqlite3
import hashlib
import os
import sys

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compliance.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def init_database():
    conn = get_db()
    cursor = conn.cursor()

    # Drop existing tables to ensure clean schema update
    cursor.execute("DROP TABLE IF EXISTS payment_requests")
    cursor.execute("DROP TABLE IF EXISTS obligations")
    cursor.execute("DROP TABLE IF EXISTS entities")
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS audit_logs")

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        organization TEXT NOT NULL,
        avatar TEXT
    )
    """)

    # 2. Entities Table (Familiar Indian Companies)
    cursor.execute("""
    CREATE TABLE entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        incorporation_date TEXT,
        cin TEXT,
        pan TEXT,
        gstin TEXT,
        headcount INTEGER,
        annual_turnover_cr REAL,
        currency TEXT DEFAULT 'INR',
        currency_symbol TEXT DEFAULT '₹',
        sector TEXT,
        operating_states TEXT,
        is_cross_border BOOLEAN,
        is_data_fiduciary BOOLEAN,
        treasury_balance REAL DEFAULT 2450000.00
    )
    """)

    # 3. Obligations Table
    cursor.execute("""
    CREATE TABLE obligations (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        title TEXT NOT NULL,
        act TEXT NOT NULL,
        authority TEXT NOT NULL,
        category TEXT NOT NULL,
        due_date TEXT NOT NULL,
        days_remaining INTEGER,
        status TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        department TEXT,
        assigned_to TEXT,
        calculated_liability TEXT,
        verified_proof_id TEXT,
        verification_status TEXT,
        last_audit_timestamp TEXT,
        FOREIGN KEY (entity_id) REFERENCES entities (id)
    )
    """)

    # 4. Payment Requests Table (2-Day Pre-Due-Date Auto-Payment System in ₹)
    cursor.execute("""
    CREATE TABLE payment_requests (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        obligation_id TEXT NOT NULL,
        title TEXT NOT NULL,
        action_type TEXT NOT NULL,
        beneficiary_authority TEXT NOT NULL,
        due_date TEXT NOT NULL,
        scheduled_pay_date TEXT NOT NULL,
        days_before_due INTEGER DEFAULT 2,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        currency_symbol TEXT DEFAULT '₹',
        payment_payload_json TEXT,
        status TEXT NOT NULL,
        urgency TEXT NOT NULL,
        created_at TEXT NOT NULL,
        paid_at TEXT,
        approved_by_user_id TEXT,
        transaction_reference TEXT,
        digital_signature_hash TEXT,
        FOREIGN KEY (entity_id) REFERENCES entities (id),
        FOREIGN KEY (obligation_id) REFERENCES obligations (id)
    )
    """)

    # 5. Audit Logs Table
    cursor.execute("""
    CREATE TABLE audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        user_id TEXT,
        details TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Seed Default Indian Enterprise Users
    default_users = [
        ("USR-001", "vighnesh", "vighnesh@tcs.com", hash_password("admin123"), "Vighnesh Kamale", "admin", "Tata Consultancy Services (TCS)", "👔"),
        ("USR-002", "tax_lead", "priya.sharma@tcs.com", hash_password("tax123"), "Priya Sharma", "finance", "Tata Consultancy Services (TCS)", "💼"),
        ("USR-003", "legal_counsel", "sunita.k@tcs.com", hash_password("legal123"), "Adv. Sunita Kulkarni", "legal", "Tata Consultancy Services (TCS)", "⚖️"),
        ("USR-004", "statutory_auditor", "auditor@deloitte.com", hash_password("audit123"), "Karthik Menon (CPA)", "auditor", "Deloitte Touche LLP", "🔍")
    ]

    for u in default_users:
        cursor.execute("""
        INSERT INTO users (id, username, email, password_hash, full_name, role, organization, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, u)

    # Seed Familiar Indian Companies
    default_entities = [
        (
            "ENT-IN-001",
            "Tata Consultancy Services (TCS) Ltd",
            "india",
            "Public Limited Company (BSE/NSE: TCS)",
            "1995-01-19",
            "L22210MH1995PLC084781",
            "AAACA1234T",
            "27AAACA1234T1Z8",
            601546,
            240893.0,
            "INR",
            "₹",
            "Information Technology & Global Cloud",
            '["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi NCR", "Telangana"]',
            True,
            True,
            48500000.00
        ),
        (
            "ENT-IN-002",
            "Reliance Industries Ltd (Jio Digital)",
            "india",
            "Public Limited Conglomerate (BSE/NSE: RELIANCE)",
            "1973-05-08",
            "L17110MH1973PLC019786",
            "AAACR5678J",
            "27AAACR5678J1Z2",
            347000,
            998000.0,
            "INR",
            "₹",
            "Telecom, 5G & Digital Platforms",
            '["Maharashtra", "Gujarat", "Delhi NCR", "Karnataka"]',
            True,
            True,
            85000000.00
        ),
        (
            "ENT-IN-003",
            "Infosys Limited",
            "india",
            "Public Limited Technology Enterprise (BSE/NSE: INFY)",
            "1981-07-02",
            "L85110KA1981PLC013115",
            "AAACI4321K",
            "29AAACI4321K1ZF",
            317000,
            153670.0,
            "INR",
            "₹",
            "Next-Gen Digital & AI Services",
            '["Karnataka", "Maharashtra", "Telangana", "Kerala"]',
            True,
            True,
            32000000.00
        ),
        (
            "ENT-IN-004",
            "HDFC Bank Limited",
            "india",
            "Scheduled Commercial Banking Corporation (BSE/NSE: HDFCBANK)",
            "1994-08-30",
            "L65920MH1994PLC080618",
            "AAACH9988H",
            "27AAACH9988H1ZV",
            177000,
            210000.0,
            "INR",
            "₹",
            "Banking, Treasury & Financial Services",
            '["All India - 36 States & UTs"]',
            True,
            True,
            125000000.00
        ),
        (
            "ENT-IN-005",
            "Zomato / Blinkit (Eternal Ltd)",
            "india",
            "Listed Technology & Quick-Commerce (BSE/NSE: ZOMATO)",
            "2010-01-18",
            "L93030HR2010PLC040607",
            "AAACZ2468Z",
            "06AAACZ2468Z1Z0",
            8400,
            12114.0,
            "INR",
            "₹",
            "Quick Commerce, Food Delivery & Hyperlocal Logistics",
            '["Haryana", "Delhi NCR", "Maharashtra", "Karnataka"]',
            False,
            True,
            9500000.00
        )
    ]

    for e in default_entities:
        cursor.execute("""
        INSERT INTO entities (
            id, name, jurisdiction, entity_type, incorporation_date,
            cin, pan, gstin, headcount, annual_turnover_cr, currency,
            currency_symbol, sector, operating_states, is_cross_border,
            is_data_fiduciary, treasury_balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, e)

    # Seed Statutory Indian Obligations (All in ₹ INR)
    default_obligations = [
        (
            "OBL-001",
            "ENT-IN-001",
            "GSTR-3B Monthly Return & Tax Remittance",
            "Central Goods and Services Tax Act, 2017",
            "GSTN",
            "Indirect Tax",
            "2026-08-20",
            4,
            "Verified",
            "HIGH",
            "Finance & Accounts",
            "Priya Sharma",
            "₹5,20,000.00",
            "DOC-GST-CHALLAN-2026-07",
            "AI_VERIFIED_PASS",
            "2026-08-15 14:32:00"
        ),
        (
            "OBL-002",
            "ENT-IN-001",
            "EPF Monthly ECR Filing & Electronic Challan Deposit",
            "Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
            "EPFO",
            "Labor & Payroll",
            "2026-08-15",
            -1,
            "Verified",
            "CRITICAL",
            "HR & Payroll",
            "Deepak Mehta",
            "₹3,48,000.00",
            "DOC-EPF-ECR-JUL2026",
            "AI_VERIFIED_PASS",
            "2026-08-14 11:20:00"
        ),
        (
            "OBL-003",
            "ENT-IN-001",
            "Monthly TDS Remittance under Section 194J / 192",
            "Income Tax Act, 1961",
            "CBDT",
            "Direct Tax",
            "2026-08-07",
            -9,
            "Flagged Discrepancy",
            "CRITICAL",
            "Finance & Accounts",
            "Priya Sharma",
            "₹1,85,000.00",
            "DOC-TDS-CHALLAN-DISCREPANCY",
            "AI_DISCREPANCY_FLAGGED",
            "2026-08-15 18:04:12"
        ),
        (
            "OBL-004",
            "ENT-IN-001",
            "Form AOC-4 - Annual Financial Statements Filing",
            "Companies Act, 2013",
            "MCA",
            "Corporate Secretarial",
            "2026-09-30",
            45,
            "In Progress",
            "MEDIUM",
            "Legal & Secretarial",
            "Adv. Sunita Kulkarni",
            "Statutory Filing Fee ₹1,200.00",
            None,
            "PENDING_PROOF",
            None
        ),
        (
            "OBL-005",
            "ENT-IN-001",
            "DPDP Act Digital Data Mapping & Consent Audit",
            "Digital Personal Data Protection Act, 2023",
            "DPDPB",
            "Data Privacy",
            "2026-10-31",
            76,
            "In Progress",
            "HIGH",
            "InfoSec & Legal",
            "Rahul Sen (DPO)",
            "Internal Governance Audit",
            None,
            "PENDING_PROOF",
            None
        ),
        (
            "OBL-006",
            "ENT-IN-001",
            "Advance Tax Q2 Second Installment (45% Cumulative)",
            "Income Tax Act, 1961 (Section 211)",
            "CBDT",
            "Direct Tax",
            "2026-09-15",
            30,
            "Pending Review",
            "HIGH",
            "Finance & Accounts",
            "Priya Sharma",
            "₹14,20,000.00",
            None,
            "PENDING_PAYMENT",
            None
        )
    ]

    for o in default_obligations:
        cursor.execute("""
        INSERT INTO obligations (
            id, entity_id, title, act, authority, category, due_date,
            days_remaining, status, risk_level, department, assigned_to,
            calculated_liability, verified_proof_id, verification_status,
            last_audit_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, o)

    # Seed 2-Day Pre-Due-Date Payment Requests in Indian Currency (₹ - INR)
    default_payments = [
        (
            "PAY-REQ-2026-01",
            "ENT-IN-001",
            "OBL-001",
            "Automatic GSTR-3B Tax Remittance (Scheduled 2 Days Before Due Date)",
            "TAX_PAYMENT",
            "GSTN / Government of India",
            "2026-08-20",
            "2026-08-18",
            2,
            520000.00,
            "INR",
            "₹",
            '{"cpin": "26082910394819", "gstin": "27AAACA1234T1Z8", "cgst": 145000.00, "sgst": 145000.00, "igst": 230000.00, "bank": "HDFC Bank Ltd - Corporate Treasury", "challan_form": "GST PMT-06", "due_date": "2026-08-20", "pre_due_date_trigger": "T-2 Days Automated Schedule"}',
            "AWAITING_USER_APPROVAL",
            "HIGH",
            "2026-08-16 08:00:00"
        ),
        (
            "PAY-REQ-2026-02",
            "ENT-IN-001",
            "OBL-003",
            "Authorize Remedial TDS Shortfall Payment (₹60,200 + Interest) to Avoid Notice",
            "REMEDIAL_PAYMENT",
            "Income Tax Department (CBDT)",
            "2026-08-07",
            "2026-08-16",
            -9,
            61103.00,
            "INR",
            "₹",
            '{"tan": "BLRA12345C", "principal_shortfall": 60200.00, "statutory_interest_201_1a": 903.00, "challan_form": "ITNS 281 (Minor Head 200)", "section": "194J", "bank": "HDFC Bank Ltd", "pre_due_date_trigger": "Urgent Remedial Rectification"}',
            "AWAITING_USER_APPROVAL",
            "CRITICAL",
            "2026-08-16 08:05:00"
        ),
        (
            "PAY-REQ-2026-03",
            "ENT-IN-001",
            "OBL-006",
            "Advance Tax Installment #2 Pre-Authorization (Due Sept 15)",
            "TAX_PAYMENT",
            "CBDT / Reserve Bank of India",
            "2026-09-15",
            "2026-09-13",
            30,
            1420000.00,
            "INR",
            "₹",
            '{"pan": "AAACA1234T", "cumulative_liability_percent": "45%", "installment_amount": 1420000.00, "challan_form": "ITNS 280 (Advance Tax - Code 100)", "bank": "State Bank of India", "pre_due_date_trigger": "T-2 Days Automated Schedule"}',
            "AWAITING_USER_APPROVAL",
            "MEDIUM",
            "2026-08-16 08:10:00"
        )
    ]

    for p in default_payments:
        cursor.execute("""
        INSERT INTO payment_requests (
            id, entity_id, obligation_id, title, action_type,
            beneficiary_authority, due_date, scheduled_pay_date,
            days_before_due, amount, currency, currency_symbol,
            payment_payload_json, status, urgency, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, p)

    conn.commit()
    conn.close()
    print(f"[OK] SQLite Database initialized successfully with Indian Enterprises at: {DB_PATH}")

if __name__ == "__main__":
    init_database()
