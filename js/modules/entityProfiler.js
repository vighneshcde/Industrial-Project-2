// entityProfiler.js - Indian Corporate Digital Twin & Entity Profiler

import { MOCK_ENTITIES, MASTER_OBLIGATION_TEMPLATES } from '../data/mockData.js';

export class EntityProfiler {
  constructor(appState, onProfileUpdate) {
    this.appState = appState;
    this.onProfileUpdate = onProfileUpdate;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-profiler');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'view-profiler';
      this.container.className = 'module-viewport';
      const main = document.querySelector('.app-main');
      if (main) main.appendChild(this.container);
    }
    this.render();
  }

  render() {
    const entity = this.appState.currentEntity;
    const applicable = MASTER_OBLIGATION_TEMPLATES.filter(t => t.jurisdiction === entity.jurisdiction || t.jurisdiction === "india");

    this.container.innerHTML = `
      <!-- Active Indian Corporate Digital Twin Live Status Overview -->
      <div class="card-panel" style="margin-bottom: 24px; border: 1px solid var(--accent-primary); background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98));">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span style="font-size: 20px;">🏢</span> Active Indian Enterprise Profile: ${entity.name}
          </div>
          <span class="badge-status pass">🇮🇳 Live Synced Entity</span>
        </div>

        <div class="grid-4col" style="gap: 16px; margin-top: 14px;">
          <div style="background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); border-left: 3px solid var(--accent-primary);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Company Name</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${entity.name}</div>
            <div style="font-size: 10px; color: var(--accent-primary); margin-top: 2px;">${entity.entityType}</div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); border-left: 3px solid var(--success-base);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Annual Turnover (₹ Cr)</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--success-base); font-family: var(--font-mono); margin-top: 4px;">
              ₹${entity.annualTurnoverCr.toLocaleString('en-IN')} Cr
            </div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">FY 2025-26 Financials</div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); border-left: 3px solid var(--warning-base);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Headcount</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--warning-base); font-family: var(--font-mono); margin-top: 4px;">
              ${entity.headcount.toLocaleString('en-IN')} Staff
            </div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">EPFO & ESI Applicable</div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); border-left: 3px solid #a855f7;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Tax Identifiers (India)</div>
            <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); margin-top: 4px;">
              PAN: ${entity.pan || 'AAACA1234T'}
            </div>
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); margin-top: 2px;">
              GSTIN: ${entity.gstin || '27AAACA1234T1Z8'}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Switch Between Familiar Indian Enterprises -->
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>⚡</span> Switch Active Indian Company Profile
          </div>
          <span class="badge-status info">5 Household Indian Enterprises Available</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
          ${MOCK_ENTITIES.map(e => `
            <button class="btn-secondary btn-switch-enterprise" data-eid="${e.id}" style="padding: 12px; text-align: left; border: 1px solid ${e.id === entity.id ? 'var(--accent-primary)' : 'var(--border-default)'}; background: ${e.id === entity.id ? 'var(--bg-surface-hover)' : 'var(--bg-surface-elevated)'};">
              <div style="font-size: 12px; font-weight: 700; color: var(--text-primary);">🇮🇳 ${e.name}</div>
              <div style="font-size: 10px; color: var(--accent-primary); margin-top: 2px;">Turnover: ₹${e.annualTurnoverCr.toLocaleString('en-IN')} Cr</div>
              <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">CIN: ${e.cin}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Edit Profiler Parameters Form -->
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>⚙️</span> Edit Company Parameters & Recalculate Compliance Matrix
          </div>
          <span class="badge-status info">ID: ${entity.id}</span>
        </div>

        <form id="entity-form" class="grid-2col" style="gap: 16px;">
          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Company Name *</label>
            <input type="text" id="ep-name" value="${entity.name}" class="form-input" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Corporate Identity Number (CIN)</label>
            <input type="text" id="ep-cin" value="${entity.cin || 'L22210MH1995PLC084781'}" class="form-input" style="font-family: var(--font-mono);" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Annual Turnover (₹ in Crores) *</label>
            <input type="number" id="ep-turnover" value="${entity.annualTurnoverCr}" step="1" class="form-input" style="font-family: var(--font-mono);" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Headcount (Employees) *</label>
            <input type="number" id="ep-headcount" value="${entity.headcount}" class="form-input" style="font-family: var(--font-mono);" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Permanent Account Number (PAN)</label>
            <input type="text" id="ep-pan" value="${entity.pan || 'AAACA1234T'}" class="form-input" style="font-family: var(--font-mono);" />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">GSTIN Number</label>
            <input type="text" id="ep-gstin" value="${entity.gstin || '27AAACA1234T1Z8'}" class="form-input" style="font-family: var(--font-mono);" />
          </div>

          <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
            <button type="submit" class="btn-primary" style="padding: 10px 26px; font-size: 14px;">
              <span>💾</span> Save Changes & Recalculate Matrix
            </button>
          </div>
        </form>
      </div>

      <!-- Auto-Derived Master Checklist -->
      <div class="card-panel">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>📋</span> Auto-Derived Statutory Obligations Checklist for ${entity.name}
          </div>
          <span class="badge-status pass">${applicable.length} Mandatory Acts Mapped</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background: var(--bg-base); border-bottom: 1px solid var(--border-default); color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
              <th style="padding: 12px 14px;">Obligation</th>
              <th style="padding: 12px 14px;">Statute & Section</th>
              <th style="padding: 12px 14px;">Frequency</th>
              <th style="padding: 12px 14px;">Penalty Rule (₹ INR)</th>
            </tr>
          </thead>
          <tbody>
            ${applicable.map(item => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 12px 14px; font-weight: 700;">${item.title}</td>
                <td style="padding: 12px 14px; font-family: var(--font-mono); font-size: 12px;">${item.act} (${item.section})</td>
                <td style="padding: 12px 14px;"><span class="tag-pill">${item.frequency}</span></td>
                <td style="padding: 12px 14px; color: var(--danger-base); font-size: 11px;">${item.penaltyDescription}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById('entity-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ent = this.appState.currentEntity;
        ent.name = document.getElementById('ep-name').value.trim();
        ent.cin = document.getElementById('ep-cin').value.trim();
        ent.annualTurnoverCr = parseFloat(document.getElementById('ep-turnover').value) || 0;
        ent.headcount = parseInt(document.getElementById('ep-headcount').value, 10) || 0;
        ent.pan = document.getElementById('ep-pan').value.trim();
        ent.gstin = document.getElementById('ep-gstin').value.trim();
        
        this.render();
        this.onProfileUpdate(ent);
        alert(`✅ Company Profile Updated for '${ent.name}'!\n\nParameters live-synced in Indian Rupees (₹ - INR) across the entire dashboard.`);
      });
    }

    // Quick switch buttons
    const switchBtns = this.container.querySelectorAll('.btn-switch-enterprise');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const eid = btn.getAttribute('data-eid');
        const found = MOCK_ENTITIES.find(m => m.id === eid);
        if (found) {
          this.appState.currentEntity = { ...found };
          this.render();
          this.onProfileUpdate(this.appState.currentEntity);
        }
      });
    });
  }
}
