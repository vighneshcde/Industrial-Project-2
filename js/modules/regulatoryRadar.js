// regulatoryRadar.js - Real-Time Regulatory Radar & Diff Engine

import { SIMULATED_REGULATORY_CIRCULARS, REGULATORY_AUTHORITIES } from '../data/mockData.js';

export class RegulatoryRadar {
  constructor(appState, onNewObligationCreated) {
    this.appState = appState;
    this.onNewObligationCreated = onNewObligationCreated;
    this.selectedCircular = SIMULATED_REGULATORY_CIRCULARS[0];
    this.isSimulatingAnalysis = false;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-radar');
    this.render();
  }

  render() {
    const entity = this.appState.currentEntity;
    const circulars = SIMULATED_REGULATORY_CIRCULARS.filter(c => c.jurisdiction === entity.jurisdiction || c.jurisdiction === "global");

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>📡</span> Autonomous Regulatory Radar & Gazette Crawler
          </div>
          <button id="btn-simulate-circular" class="btn-primary" ${this.isSimulatingAnalysis ? 'disabled' : ''}>
            <span>✨</span> Simulate Live Gazette Notification
          </button>
        </div>

        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 13px;">
          Autonomous agents crawl gazettes and tax notifications, parsing new amendments into actionable plain-English rules for <strong>${entity.name}</strong>.
        </p>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Active Portals Monitored:</span>
          ${(REGULATORY_AUTHORITIES[entity.jurisdiction] || []).map(auth => `
            <span class="tag-pill" style="display: inline-flex; align-items: center; gap: 6px;">
              <span class="pulse-dot" style="width: 5px; height: 5px;"></span>
              ${auth.id} (${auth.portal})
            </span>
          `).join('')}
        </div>
      </div>

      <div class="grid-2col" style="gap: 24px;">
        <!-- Left: Circulars Feed -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>📰</span> Ingested Gazette Notifications (${circulars.length})
            </div>
            <span class="badge-status info">Live Crawler</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${circulars.map(c => `
              <div class="card-panel" style="background: var(--bg-surface-elevated); padding: 16px; border: 1px solid var(--border-subtle); cursor: pointer;" data-cid="${c.circularId}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span class="tag-pill" style="color: var(--accent-primary);">${c.authority}</span>
                  <span class="badge-status ${c.impactSeverity === 'CRITICAL' ? 'danger' : 'warn'}">${c.impactSeverity} IMPACT</span>
                </div>
                <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: var(--text-primary);">${c.title}</div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">${c.aiSummary}</div>
                <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
                  <span>📅 Published: ${c.publishedDate}</span>
                  <span style="font-family: var(--font-mono);">${c.officialGazetteNo}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: AI Impact Analyzer -->
        <div class="card-panel">
          <div class="card-panel-header">
            <div class="card-panel-title">
              <span>🔍</span> AI Impact Analyzer & Legal Diff
            </div>
            <span class="badge-status pass">✓ DIRECT APPLICABILITY: YES</span>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Plain English Summary</div>
            <div style="font-size: 13px; color: var(--text-primary); line-height: 1.5;">${this.selectedCircular.aiSummary}</div>
          </div>

          <div style="background: var(--warning-surface); border: 1px dashed var(--warning-border); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--warning-base); text-transform: uppercase; margin-bottom: 6px;">
              ⚡ Autonomous Action & Pre-Due-Date Pay Schedule
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              ${this.selectedCircular.suggestedObligation.title}
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
              Statutory Deadline: <strong>${this.selectedCircular.suggestedObligation.deadline}</strong> | Auto-Pay Scheduled: <strong>2 Days Prior</strong>
            </div>
            <button id="btn-auto-schedule-circular" class="btn-primary" style="width: 100%; justify-content: center;">
              <span>➕</span> Auto-Schedule Obligation & Pre-Due-Date Trigger
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const simBtn = document.getElementById('btn-simulate-circular');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        this.isSimulatingAnalysis = true;
        this.render();
        setTimeout(() => {
          this.isSimulatingAnalysis = false;
          this.render();
          alert("✨ New circular simulated: E-Invoicing Threshold lowered to ₹2.5 Cr. Auto-impact parsed!");
        }, 1200);
      });
    }

    const schedBtn = document.getElementById('btn-auto-schedule-circular');
    if (schedBtn) {
      schedBtn.addEventListener('click', () => {
        const c = this.selectedCircular;
        const newObl = {
          id: `OBL-NEW-${Date.now().toString().slice(-4)}`,
          entityId: this.appState.currentEntity.id,
          title: c.suggestedObligation.title,
          act: `${c.authority} Notification (${c.officialGazetteNo})`,
          authority: c.authority,
          category: c.suggestedObligation.category,
          dueDate: c.suggestedObligation.deadline,
          daysRemaining: 40,
          status: "Pending Review",
          riskLevel: "HIGH",
          department: c.suggestedObligation.department,
          assignedTo: "AI Router",
          calculatedLiability: "Statutory Compliance",
          verifiedProofId: null,
          verificationStatus: "PENDING_PAYMENT",
          lastAuditTimestamp: null
        };
        this.onNewObligationCreated(newObl);
        alert(`✅ Obligation '${newObl.title}' auto-scheduled with a 2-day pre-due-date payment trigger!`);
      });
    }
  }
}
