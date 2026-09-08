// noticeDefense.js - AI Tax Notice & Legal Scrutiny Defense Vault

import { NOTICE_DEFENSE_TEMPLATES } from '../data/mockData.js';

export class NoticeDefenseEngine {
  constructor(appState) {
    this.appState = appState;
    this.selectedNotice = NOTICE_DEFENSE_TEMPLATES[0];
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-notices');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'view-notices';
      this.container.className = 'module-viewport';
      const main = document.querySelector('.app-main');
      if (main) main.appendChild(this.container);
    }
    this.render();
  }

  render() {
    const notice = this.selectedNotice;
    const entity = this.appState.currentEntity;

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>🛡️</span> AI Tax Notice & Scrutiny Defense Center
          </div>
          <span class="badge-status info">Legal Defense AI</span>
        </div>

        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
          When statutory authorities (GSTN, Income Tax CPC, MCA) issue show-cause notices or scrutiny intimations, Duewise AI organizes the facts and prepares a review-ready response draft.
        </p>

        <!-- Notice Selector -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${NOTICE_DEFENSE_TEMPLATES.map(n => `
            <button class="btn-secondary notice-tab-btn" data-nid="${n.id}" style="${notice.id === n.id ? 'background: var(--bg-surface-hover); border-color: var(--accent-primary);' : ''}">
              ⚖️ ${n.authority} - ${n.statute}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid-2col" style="gap: 24px;">
        <!-- Left: Received Department Notice -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>📜</span> Received Department Notice
            </div>
            <span class="badge-status danger">ACTION REQUIRED</span>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 14px 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Issuing Authority & Section</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">
              ${notice.authority} • ${notice.statute}
            </div>
          </div>

          <div style="background: #020617; border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 16px; font-family: var(--font-mono); font-size: 12px; color: #f87171; line-height: 1.6; margin-bottom: 16px;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Extracted Notice Text:</div>
            "${notice.sampleNoticeSnippet}"
          </div>

          <h4 style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; font-weight: 700;">
            AI Recommended Legal Defense Grounds:
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${notice.recommendedLegalGrounds.map(g => `
              <div style="display: flex; gap: 8px; align-items: flex-start; font-size: 12px; background: var(--bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm);">
                <span style="color: var(--success-base);">✓</span>
                <span style="color: var(--text-primary);">${g}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: AI Generated Formal Reply Submission -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>✍️</span> AI Section-Cited Legal Submission Draft
            </div>
            <button id="btn-copy-reply" class="btn-primary" style="padding: 6px 14px; font-size: 12px;">
              <span>📋</span> Copy Submission
            </button>
          </div>

          <div style="background: #020617; border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 18px; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; min-height: 360px; max-height: 460px; overflow-y: auto;">
            <pre style="white-space: pre-wrap; color: #e2e8f0;">${notice.generatedDraftReply.replace(/APEX FINTECH SOLUTIONS PVT LTD/g, entity.name.toUpperCase())}</pre>
          </div>

          <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-secondary" onclick="alert('✅ Downloaded formal legal response draft in Word .DOCX format.')">
              <span>📄</span> Download .DOCX Draft
            </button>
            <button class="btn-primary" onclick="alert('✅ Legal submission sealed and archived to Audit Pack.')">
              <span>🔐</span> Digital Sign & Archive
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll('.notice-tab-btn');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        const id = t.getAttribute('data-nid');
        this.selectedNotice = NOTICE_DEFENSE_TEMPLATES.find(n => n.id === id) || NOTICE_DEFENSE_TEMPLATES[0];
        this.render();
      });
    });

    const copyBtn = document.getElementById('btn-copy-reply');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.selectedNotice.generatedDraftReply);
        alert("✅ Legal submission draft copied to clipboard!");
      });
    }
  }
}
