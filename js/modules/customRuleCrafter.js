// customRuleCrafter.js - Custom Corporate Compliance Crafter & Live Obligations Registry

export class CustomRuleCrafter {
  constructor(appState, onRuleCreated) {
    this.appState = appState;
    this.onRuleCreated = onRuleCreated;
    this.customRules = [
      {
        id: "OBL-CUSTOM-001",
        title: "Annual State Trade License & Municipal Health NOC",
        act: "Municipal Corporation Act, Section 343",
        authority: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
        category: "Corporate Secretarial",
        dueDate: "2026-09-10",
        amount: 18500.00,
        department: "Facilities & Operations",
        autopay: true,
        status: "Pending Review",
        createdAt: "2026-08-16 08:30:00"
      }
    ];
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-crafter');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'view-crafter';
      this.container.className = 'module-viewport';
      const main = document.querySelector('.app-main');
      if (main) main.appendChild(this.container);
    }
    this.render();
  }

  render() {
    const entity = this.appState.currentEntity;

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>⚙️</span> Custom Corporate Compliance Crafter & Rule Engine
          </div>
          <span class="badge-status pass">${this.customRules.length} Custom Rule(s) Active</span>
        </div>

        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">
          Create and manage bespoke corporate compliance obligations tailored specifically to <strong>${entity.name}</strong> (such as Trade Licenses, Fire Safety NOCs, Factory Acts, POSH Committee Filings, or Vendor Audits). Each rule automatically generates a <strong>T-2 Days Pre-Due-Date Auto-Payment & Authorization Card</strong>.
        </p>

        <!-- Input Form -->
        <form id="custom-rule-form" class="grid-2col" style="gap: 16px; background: var(--bg-surface-elevated); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-default); margin-bottom: 24px;">
          <div style="grid-column: span 2;">
            <h4 style="font-size: 14px; font-weight: 700; color: var(--accent-primary); margin-bottom: 4px;">
              📝 Add New Custom Obligation
            </h4>
            <p style="font-size: 11px; color: var(--text-muted);">Fill in the details below and click Save. Your new compliance rule will appear in the table below and in the Auto-Pay Center immediately.</p>
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Compliance Obligation Title *</label>
            <input type="text" id="rule-title" class="search-command-bar" style="width: 100%; font-size: 13px;" placeholder="e.g. Annual Fire Safety NOC & Hydrant Inspection" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Governing Statute / Policy *</label>
            <input type="text" id="rule-act" class="search-command-bar" style="width: 100%; font-size: 13px;" placeholder="e.g. State Fire Prevention and Safety Measures Act" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Regulatory Authority *</label>
            <input type="text" id="rule-authority" class="search-command-bar" style="width: 100%; font-size: 13px;" placeholder="e.g. Department of Fire & Emergency Services" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Category</label>
            <select id="rule-category" class="search-command-bar" style="width: 100%; font-size: 13px; color: var(--text-primary);">
              <option value="Environmental & Safety">Environmental & Safety</option>
              <option value="Direct Tax">Direct Tax</option>
              <option value="Indirect Tax">Indirect Tax</option>
              <option value="Labor & Payroll">Labor & Payroll</option>
              <option value="Corporate Secretarial">Corporate Secretarial</option>
              <option value="Information Security & ISO">Information Security & ISO</option>
            </select>
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Statutory Due Date *</label>
            <input type="date" id="rule-duedate" class="search-command-bar" style="width: 100%; font-size: 13px; font-family: var(--font-mono);" required />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Statutory Fee / Liability Amount (₹)</label>
            <input type="number" id="rule-amount" class="search-command-bar" style="width: 100%; font-size: 13px; font-family: var(--font-mono);" placeholder="25000" value="25000" />
          </div>

          <div>
            <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Assigned Internal Department</label>
            <input type="text" id="rule-dept" class="search-command-bar" style="width: 100%; font-size: 13px;" placeholder="e.g. Facilities & EHS Team" value="Facilities & EHS" />
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 24px;">
            <input type="checkbox" id="rule-autopay" checked style="width: 18px; height: 18px; cursor: pointer;" />
            <label for="rule-autopay" style="font-size: 13px; font-weight: 600; color: var(--text-primary); cursor: pointer;">
              ⚡ Enable 2-Day Pre-Due-Date Auto-Payment & Authorization Card
            </label>
          </div>

          <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
            <button type="submit" class="btn-primary" style="padding: 10px 28px; font-size: 14px;">
              <span>➕</span> Add Custom Rule to Company Matrix
            </button>
          </div>
        </form>

        <!-- LIVE DISPLAY OF ADDED CUSTOM OBLIGATIONS -->
        <div class="card-panel-header" style="margin-top: 28px; margin-bottom: 14px;">
          <div class="card-panel-title">
            <span>📋</span> Custom Added Obligations for ${entity.name} (${this.customRules.length})
          </div>
          <span class="badge-status pass">✓ Live Synced</span>
        </div>

        ${this.customRules.length === 0 ? `
          <div style="background: var(--bg-surface-elevated); padding: 32px; text-align: center; border-radius: var(--radius-md); color: var(--text-muted);">
            No custom rules created yet. Fill in the form above to add your first obligation.
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
              <thead>
                <tr style="background: var(--bg-base); border-bottom: 1px solid var(--border-default); color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
                  <th style="padding: 12px 14px;">Obligation Title</th>
                  <th style="padding: 12px 14px;">Governing Act / Statute</th>
                  <th style="padding: 12px 14px;">Authority</th>
                  <th style="padding: 12px 14px;">Due Date</th>
                  <th style="padding: 12px 14px;">Statutory Fee</th>
                  <th style="padding: 12px 14px;">Department</th>
                  <th style="padding: 12px 14px;">2-Day Auto-Pay</th>
                  <th style="padding: 12px 14px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.customRules.map((r, idx) => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 12px 14px; font-weight: 700; color: var(--text-primary);">${r.title}</td>
                    <td style="padding: 12px 14px; font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);">${r.act}</td>
                    <td style="padding: 12px 14px;"><span class="tag-pill">${r.authority}</span></td>
                    <td style="padding: 12px 14px; font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">${r.dueDate}</td>
                    <td style="padding: 12px 14px; font-family: var(--font-mono); font-weight: 800; color: var(--success-base);">
                      ₹${r.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style="padding: 12px 14px; font-size: 12px;">${r.department}</td>
                    <td style="padding: 12px 14px;">
                      <span class="badge-status pass" style="font-size: 10px;">⚡ T-2 DAYS EARLY</span>
                    </td>
                    <td style="padding: 12px 14px;">
                      <button class="btn-danger btn-delete-custom-rule" data-idx="${idx}" style="padding: 4px 8px; font-size: 11px; cursor: pointer;">
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById('custom-rule-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('rule-title').value.trim();
        const act = document.getElementById('rule-act').value.trim();
        const authority = document.getElementById('rule-authority').value.trim();
        const category = document.getElementById('rule-category').value;
        const dueDate = document.getElementById('rule-duedate').value;
        const amount = parseFloat(document.getElementById('rule-amount').value) || 0;
        const department = document.getElementById('rule-dept').value.trim() || 'Operations';
        const autopay = document.getElementById('rule-autopay').checked;

        const newRule = {
          id: `OBL-CUSTOM-${Date.now().toString().slice(-4)}`,
          title: title,
          act: act,
          authority: authority,
          category: category,
          dueDate: dueDate,
          amount: amount,
          department: department,
          autopay: autopay,
          status: "Pending Review",
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };

        this.customRules.unshift(newRule);

        const newObl = {
          id: newRule.id,
          entityId: this.appState.currentEntity.id,
          title: title,
          act: act,
          authority: authority,
          category: category,
          dueDate: dueDate,
          daysRemaining: 25,
          status: "Pending Review",
          riskLevel: "HIGH",
          department: department,
          assignedTo: this.appState.currentUser ? this.appState.currentUser.full_name : "Admin",
          calculatedLiability: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          verifiedProofId: null,
          verificationStatus: "PENDING_PAYMENT",
          lastAuditTimestamp: null
        };

        if (this.onRuleCreated) {
          this.onRuleCreated(newObl, amount);
        }

        this.render();
        alert(`🎉 Custom Obligation Added!\n\nTitle: ${title}\nStatute: ${act}\nDue Date: ${dueDate}\nFee: ₹${amount.toLocaleString()}\n\nSaved and scheduled with a 2-Day Pre-Due-Date Payment trigger!`);
      });
    }

    // Delete custom rule buttons
    const deleteBtns = this.container.querySelectorAll('.btn-delete-custom-rule');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && confirm("Are you sure you want to remove this custom obligation?")) {
          const removed = this.customRules.splice(idx, 1)[0];
          // Remove from app obligations
          const oblIdx = this.appState.obligations.findIndex(o => o.id === removed.id);
          if (oblIdx !== -1) {
            this.appState.obligations.splice(oblIdx, 1);
          }
          this.render();
          if (this.appState.modules && this.appState.modules.calendar) {
            this.appState.modules.calendar.render();
          }
        }
      });
    });
  }
}
