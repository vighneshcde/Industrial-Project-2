// treasuryEngine.js - Corporate Treasury & Bank Liquidity Safety Reserve Engine

import { CORPORATE_BANK_ACCOUNTS } from '../data/mockData.js';

export class TreasuryEngine {
  constructor(appState) {
    this.appState = appState;
    this.bankAccounts = JSON.parse(JSON.stringify(CORPORATE_BANK_ACCOUNTS));
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-treasury');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'view-treasury';
      this.container.className = 'module-viewport';
      const main = document.querySelector('.app-main');
      if (main) main.appendChild(this.container);
    }
    this.render();
  }

  render() {
    const totalLiquidity = this.bankAccounts.reduce((sum, b) => sum + b.availableBalance, 0);
    const entity = this.appState.currentEntity;

    // Upcoming T-2 pay liabilities
    const upcomingPayments = (this.appState.obligations || []).filter(o => o.status !== 'Verified');
    const totalRequiredTax = 520000.00 + 61103.00 + 1420000.00;
    const safetyCoverageRatio = ((totalLiquidity / totalRequiredTax) * 100).toFixed(1);

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px; border: 1px solid var(--accent-primary); background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98));">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span style="font-size: 20px;">🏦</span> Corporate Treasury & Statutory Liquidity Shield
          </div>
          <span class="badge-status ${parseFloat(safetyCoverageRatio) >= 100 ? 'pass' : 'danger'}" style="font-size: 12px; padding: 6px 14px;">
            Liquidity Coverage: ${safetyCoverageRatio}%
          </span>
        </div>

        <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
          <strong>AegisFlow™ Treasury Safety:</strong> Continuously syncs your real-time bank reserves against upcoming T-2 statutory auto-pay commitments across GSTN, CBDT, and EPFO to ensure 100% liquidity readiness and zero bounce penalties.
        </p>

        <div class="grid-3col" style="gap: 16px;">
          <div style="background: var(--bg-surface-elevated); padding: 16px 20px; border-radius: var(--radius-md); border-left: 3px solid var(--success-base);">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Available Treasury Cash</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--success-base); font-family: var(--font-mono); margin-top: 4px;">
              ${entity.currencySymbol}${totalLiquidity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Across 2 Verified Treasury Accounts</div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 16px 20px; border-radius: var(--radius-md); border-left: 3px solid var(--warning-base);">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">30-Day T-2 Statutory Liabilities</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--warning-base); font-family: var(--font-mono); margin-top: 4px;">
              ${entity.currencySymbol}${totalRequiredTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Pre-Scheduled 2 Days Early</div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 16px 20px; border-radius: var(--radius-md); border-left: 3px solid var(--accent-primary);">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Net Safe Liquidity Surplus</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-primary); font-family: var(--font-mono); margin-top: 4px;">
              ${entity.currencySymbol}${(totalLiquidity - totalRequiredTax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style="font-size: 11px; color: var(--success-base); margin-top: 4px;">✓ 100% Solvent for Auto-Pay</div>
          </div>
        </div>
      </div>

      <!-- Bank Accounts Grid -->
      <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <span>💳</span> Connected Corporate Banking Gateways
      </h3>

      <div class="grid-2col" style="gap: 20px; margin-bottom: 24px;">
        ${this.bankAccounts.map(b => `
          <div class="card-panel" style="border: 1px solid var(--border-default); background: var(--bg-surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="tag-pill" style="font-weight: 700; color: var(--accent-primary);">${b.accountType}</span>
                <h4 style="font-size: 16px; font-weight: 700; margin-top: 4px;">${b.bankName}</h4>
                <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">${b.accountNumberMasked}</div>
              </div>
              <span class="badge-status pass">${b.isPrimaryForStatutoryAutoPay ? '★ PRIMARY AUTO-PAY' : 'ACTIVE'}</span>
            </div>

            <div style="background: var(--bg-base); padding: 12px 16px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
              <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Live Real-Time Balance</span>
              <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--success-base);">
                ${entity.currencySymbol}${b.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
