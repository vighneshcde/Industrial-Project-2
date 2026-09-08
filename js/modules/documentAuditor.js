// documentAuditor.js - Multimodal AI Evidence Validator & OCR Engine

import { SAMPLE_DOCUMENTS_FOR_AUDIT } from '../data/mockData.js';

export class DocumentAuditor {
  constructor(appState, onAuditCompleted) {
    this.appState = appState;
    this.onAuditCompleted = onAuditCompleted;
    this.selectedDoc = SAMPLE_DOCUMENTS_FOR_AUDIT[0];
    this.isScanning = false;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-auditor');
    this.render();
  }

  selectDocumentById(docId) {
    const doc = SAMPLE_DOCUMENTS_FOR_AUDIT.find(d => d.docId === docId);
    if (doc) {
      this.selectedDoc = doc;
      this.render();
    }
  }

  render() {
    const doc = this.selectedDoc;

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>🔍</span> Multimodal AI Document Auditor & OCR Vision Engine
          </div>
          <button id="btn-run-ocr-scan" class="btn-primary" ${this.isScanning ? 'disabled' : ''}>
            <span>⚡</span> ${this.isScanning ? 'Scanning Bounding Boxes...' : 'Run Multimodal AI OCR Audit'}
          </button>
        </div>

        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 13px;">
          The Vision & OCR engine scans statutory tax challans, bank receipts, and filing returns, extracting critical fields and cross-checking them against books of account to detect underpayments before penalties accrue.
        </p>

        <!-- Document Selector -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${SAMPLE_DOCUMENTS_FOR_AUDIT.map(d => `
            <button class="btn-secondary doc-tab-btn" data-docid="${d.docId}" style="${doc.docId === d.docId ? 'background: var(--bg-surface-hover); border-color: var(--accent-primary);' : ''}">
              ${d.status === 'Flagged Discrepancy' ? '⚠️' : '📄'} ${d.name}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid-2col" style="gap: 24px;">
        <!-- Left: Document Viewer Canvas -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>📄</span> Statutory Document View
            </div>
            <span class="badge-status ${doc.status === 'Verified' ? 'pass' : 'danger'}">${doc.status}</span>
          </div>

          <div style="background: #020617; border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 18px; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; min-height: 380px; position: relative;">
            ${this.isScanning ? `
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent-primary); box-shadow: 0 0 12px var(--accent-primary); animation: scanAnimation 1.8s infinite;"></div>
            ` : ''}
            <pre style="white-space: pre-wrap; color: ${doc.mismatchDetected ? '#fca5a5' : '#e2e8f0'};">${doc.rawOcrText}</pre>
          </div>
        </div>

        <!-- Right: AI Extraction & Ledger Checks -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>🤖</span> AI Field Extractions & Reconciliation
            </div>
            <span class="tag-pill">Confidence: ${doc.confidenceScore}%</span>
          </div>

          ${doc.mismatchDetected ? `
            <div style="background: var(--danger-surface); border: 1px solid var(--danger-border); padding: 14px 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
              <div style="font-weight: 700; color: var(--danger-base); font-size: 13px; margin-bottom: 4px;">
                🚨 Shortfall Mismatch Detected by Multimodal AI
              </div>
              <div style="font-size: 12px; color: var(--text-primary); line-height: 1.5;">
                ${doc.discrepancySummary}
              </div>
            </div>
          ` : ''}

          <!-- Fields Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            ${Object.entries(doc.extractedFields).map(([k, v]) => `
              <div style="background: var(--bg-surface-elevated); padding: 10px 12px; border-radius: var(--radius-md);">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${k.replace(/([A-Z])/g, ' $1')}</div>
                <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); margin-top: 2px;">${v}</div>
              </div>
            `).join('')}
          </div>

          <!-- Audit Checklist -->
          <h4 style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; font-weight: 700;">Statutory Audit Checks</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${doc.auditChecks.map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 12px; border-left: 3px solid ${c.status === 'PASS' ? 'var(--success-base)' : 'var(--danger-base)'};">
                <div>
                  <strong style="color: var(--text-primary);">${c.checkName}</strong>
                  <div style="font-size: 11px; color: var(--text-secondary);">${c.detail}</div>
                </div>
                <span class="badge-status ${c.status === 'PASS' ? 'pass' : 'danger'}" style="font-size: 10px;">${c.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll('.doc-tab-btn');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        const id = t.getAttribute('data-docid');
        this.selectDocumentById(id);
      });
    });

    const ocrBtn = document.getElementById('btn-run-ocr-scan');
    if (ocrBtn) {
      ocrBtn.addEventListener('click', () => {
        this.isScanning = true;
        this.render();
        setTimeout(() => {
          this.isScanning = false;
          this.render();
          alert(`✨ AI OCR Scan Complete: Extracted statutory fields with ${this.selectedDoc.confidenceScore}% confidence.`);
        }, 1200);
      });
    }
  }
}
