# 🛡️ AegisFlow AI - Autonomous Corporate Governance & Statutory Treasury OS

> **AegisFlow AI** transforms corporate compliance and tax treasury into an autonomous, proactive intelligence system. It continuously monitors legal & tax authorities, computes exact liabilities, syncs real-time multi-bank liquidity, and requests payment authorizations **exactly 2 days before statutory deadlines (T-2 Early Execution)**.

---

## 🌟 Key Innovations & Enterprise Features

1. **⚡ 2-Day Pre-Due-Date Auto-Payment & Authorization Center**:
   - Calculates exact statutory liabilities across GST PMT-06, TDS ITNS 281, and Advance Tax ITNS 280 **2 days before statutory due dates**.
   - Issues 1-click **"💸 Approve & Pay Money"** requests with verifiable **SHA-256 Cryptographic Digital Signatures**.
2. **🏦 Corporate Treasury & Bank Liquidity Safety Shield**:
   - Syncs live balances across multiple corporate bank accounts (e.g. HDFC Treasury, SBI Escrow).
   - Computes real-time solvency ratios against upcoming T-2 tax obligations to guarantee zero cheque/mandate bounces.
3. **🛡️ AI Tax Notice & Scrutiny Defense Center**:
   - Analyzes incoming show-cause notices from GSTN, Income Tax CPC (Sec 143(1)/148), and MCA.
   - Automatically generates formal, Section-cited legal reply drafts with 1-click .DOCX export.
4. **⚙️ Custom Corporate Compliance & Rule Crafter**:
   - Lets organizations create custom recurring internal compliances (State Trade Licenses, Factory Acts, POSH Committee Filings, ISO 27001) with custom T-2 early auto-pay reminders.
5. **👤 Custom User Accounts & Dynamic Organization Branding**:
   - Register custom usernames, passwords (with 👁️ toggle), roles, and Company Names.
   - Automatically personalizes the entire workspace, digital twins, and audit certificates with your company's name.

---

## 🚀 How to Run Locally (Windows)

### Option 1: 1-Click Batch File (Fastest)

In this folder, double-click:
👉 [**`start.bat`**](file:///c:/Users/user/OneDrive/Desktop/EDI%20PROJECT/start.bat)

### Option 2: Inside VS Code Terminal

1. Open VS Code and open your terminal (**`Ctrl + \``**).
2. Run:
   ```powershell
   node server.js
   ```
3. Open **`http://localhost:8000`** in your browser.

Node.js is the only runtime required for the local demo. The dashboard safely runs in demo mode: email scans and payment receipts are simulated until production Gmail OAuth and banking integrations are configured.

## Deploy on Vercel

The Vercel deployment hosts the dashboard as a static demo. The frontend already includes mock data and local fallbacks, so it works without a backend.

1. Push this project to GitHub.
2. Open [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep the default framework preset as **Other**.
4. Leave the build command empty and set the output directory to `.`.
5. Click **Deploy**.

For the real Python API, deploy the existing `render.yaml` service separately and connect the frontend to that API. Vercel does not run `backend.py` as a persistent web server, and SQLite storage is not durable in serverless deployments.
