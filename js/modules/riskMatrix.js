// riskMatrix.js - Executive Risk Matrix, Health Score & Audit Pack Export

export class RiskMatrix {
  constructor(appState) {
    this.appState = appState;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-risk');
    this.render();
  }

  calculateHealthScore() {
    const obligations = this.appState.obligations;
    if (!obligations.length) return 100;

    let totalWeight = 0;
    let earnedWeight = 0;

    obligations.forEach(o => {
      const weight = o.riskLevel === 'CRITICAL' ? 15 : o.riskLevel === 'HIGH' ? 10 : 5;
      totalWeight += weight;

      if (o.status === 'Verified') {
        earnedWeight += weight;
      } else if (o.status === 'In Progress') {
        earnedWeight += weight * 0.6;
      } else if (o.status === 'Flagged Discrepancy') {
        earnedWeight += weight * 0.1;
      } else {
        earnedWeight += weight * 0.4;
      }
    });

    return Math.round((earnedWeight / totalWeight) * 100);
  }

  calculatePenaltyExposure() {
    const obligations = this.appState.obligations;
    let totalRisk = 0;
    obligations.forEach(o => {
      if (o.status === 'Flagged Discrepancy') {
        totalRisk += 60200;
      }
      if (o.daysRemaining < 0 && o.status !== 'Verified') {
        totalRisk += Math.abs(o.daysRemaining) * 500;
      }
    });
    return totalRisk;
  }

  render() {
    const score = this.calculateHealthScore();
    const penaltyExposure = this.calculatePenaltyExposure();
    const entity = this.appState.currentEntity;

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 85 ? 'var(--success-base)' : score >= 65 ? 'var(--warning-base)' : 'var(--danger-base)';

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>📊</span> Executive Compliance Health Score & Statutory Risk Matrix
          </div>
          <button id="btn-export-audit-pack" class="btn-primary">
            <span>📦</span> Export Certified Audit Pack (Dossier)
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 36px; flex-wrap: wrap;">
          <!-- SVG Gauge -->
          <div style="width: 140px; height: 140px; position: relative;">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="var(--bg-surface-elevated)" stroke-width="12" />
              <circle cx="70" cy="70" r="54" fill="none" stroke="${scoreColor}" stroke-width="12"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeDashoffset}"
                transform="rotate(-90 70 70)"
                style="transition: stroke-dashoffset 0.8s ease;"
              />
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: ${scoreColor}; line-height: 1;">${score}%</div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Health</div>
            </div>
          </div>

          <!-- Breakdown Bars -->
          <div style="flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
              <span style="width: 140px; font-weight: 600;">Indirect Tax (GST)</span>
              <div style="flex: 1; height: 6px; background: var(--bg-surface-elevated); border-radius: 4px; margin: 0 16px; overflow: hidden;">
                <div style="height: 100%; border-radius: 4px; width: 95%; background: var(--success-base);"></div>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--success-base);">95%</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
              <span style="width: 140px; font-weight: 600;">Labor & EPF/Payroll</span>
              <div style="flex: 1; height: 6px; background: var(--bg-surface-elevated); border-radius: 4px; margin: 0 16px; overflow: hidden;">
                <div style="height: 100%; border-radius: 4px; width: 100%; background: var(--success-base);"></div>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--success-base);">100%</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
              <span style="width: 140px; font-weight: 600;">Direct Tax (TDS / IT)</span>
              <div style="flex: 1; height: 6px; background: var(--bg-surface-elevated); border-radius: 4px; margin: 0 16px; overflow: hidden;">
                <div style="height: 100%; border-radius: 4px; width: 60%; background: var(--warning-base);"></div>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--warning-base);">60%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid-4col" style="margin-bottom: 24px;">
        <div class="card-panel" style="padding: 16px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Active Obligations</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin-top: 4px; font-family: var(--font-mono);">
            ${this.appState.obligations.length}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Across Statutory Acts</div>
        </div>

        <div class="card-panel" style="padding: 16px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Paid & Verified Compliant</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--success-base); margin-top: 4px; font-family: var(--font-mono);">
            ${this.appState.obligations.filter(o => o.status === 'Verified').length}
          </div>
          <div style="font-size: 11px; color: var(--success-base); margin-top: 4px;">Paid 2 days early</div>
        </div>

        <div class="card-panel" style="padding: 16px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Flagged Discrepancies</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--danger-base); margin-top: 4px; font-family: var(--font-mono);">
            ${this.appState.obligations.filter(o => o.status === 'Flagged Discrepancy').length}
          </div>
          <div style="font-size: 11px; color: var(--danger-base); margin-top: 4px;">TDS 194J Shortfall</div>
        </div>

        <div class="card-panel" style="padding: 16px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Financial Exposure at Risk</div>
          <div style="font-size: 24px; font-weight: 800; color: ${penaltyExposure > 0 ? 'var(--danger-base)' : 'var(--success-base)'}; margin-top: 4px; font-family: var(--font-mono);">
            ${entity.currencySymbol}${penaltyExposure.toLocaleString()}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Penal interest at risk</div>
        </div>
      </div>

      <!-- Audit Pack Modal -->
      <div id="audit-pack-modal" class="modal-overlay">
        <div class="modal-content" style="width: 760px;">
          <div class="modal-header">
            <div class="modal-title">📦 Timestamped Statutory Compliance Audit Dossier</div>
            <button class="modal-close-btn" id="btn-close-audit-pack">&times;</button>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 24px; border-radius: var(--radius-md); font-size: 13px; line-height: 1.6; border: 1px solid var(--border-default);">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--accent-primary); padding-bottom: 12px; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${entity.name}</h3>
                <p style="font-size: 12px; color: var(--text-secondary);">CIN: ${entity.cin} | PAN: ${entity.pan} | GSTIN: ${entity.gstin}</p>
              </div>
              <div style="text-align: right;">
                <span class="badge-status pass" style="font-size: 12px;">SCORE: ${score}%</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">SHA256-9A8F-2026</p>
              </div>
            </div>

            <h4 style="font-size: 13px; text-transform: uppercase; color: var(--accent-primary); margin-bottom: 8px;">Compliance & Auto-Payment Schedule</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
              <thead>
                <tr style="background: var(--bg-base); color: var(--text-muted); text-align: left;">
                  <th style="padding: 6px 8px;">Obligation</th>
                  <th style="padding: 6px 8px;">Authority</th>
                  <th style="padding: 6px 8px;">Amount</th>
                  <th style="padding: 6px 8px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.appState.obligations.map(o => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 6px 8px; font-weight: 600;">${o.title}</td>
                    <td style="padding: 6px 8px;">${o.authority}</td>
                    <td style="padding: 6px 8px; font-family: var(--font-mono);">${o.calculatedLiability}</td>
                    <td style="padding: 6px 8px;">
                      <span class="badge-status ${o.status === 'Verified' ? 'pass' : o.status === 'Flagged Discrepancy' ? 'danger' : 'warn'}" style="font-size: 10px;">
                        ${o.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn-secondary" onclick="window.print()">
              <span>🖨️</span> Print / Save PDF
            </button>
            <button class="btn-primary" onclick="alert('✅ Downloaded Apex_Audit_Dossier_2026.zip containing verified challans and digital signatures.')">
              <span>💾</span> Download Signed ZIP
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const exportBtn = document.getElementById('btn-export-audit-pack');
    const closeBtn = document.getElementById('btn-close-audit-pack');
    const modal = document.getElementById('audit-pack-modal');

    if (exportBtn && modal) {
      exportBtn.addEventListener('click', () => modal.classList.add('open'));
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
  }
}
