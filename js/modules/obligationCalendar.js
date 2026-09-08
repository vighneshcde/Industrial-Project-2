// obligationCalendar.js - Dynamic Obligation Calendar & Kanban Workflows

export class ObligationCalendar {
  constructor(appState, onInspectObligation) {
    this.appState = appState;
    this.onInspectObligation = onInspectObligation;
    this.viewMode = 'timeline';
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-calendar');
    this.render();
  }

  render() {
    const list = this.appState.obligations;

    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>🗓️</span> Dynamic Obligation Calendar & Automated Workflows
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-cal-timeline" class="btn-secondary" style="${this.viewMode === 'timeline' ? 'background: var(--bg-surface-hover); color: var(--accent-primary);' : ''}">
              Timeline View
            </button>
            <button id="btn-cal-kanban" class="btn-secondary" style="${this.viewMode === 'kanban' ? 'background: var(--bg-surface-hover); color: var(--accent-primary);' : ''}">
              Kanban Board
            </button>
          </div>
        </div>

        <p style="font-size: 13px; color: var(--text-secondary);">
          All statutory deadlines across GST, Income Tax, Corporate Law, and Labor Regulations. The Autonomous Agent schedules payments <strong>2 days before due date</strong> for every item below.
        </p>
      </div>

      ${this.viewMode === 'timeline' ? this.renderTimeline(list) : this.renderKanban(list)}
    `;

    this.bindEvents();
  }

  renderTimeline(list) {
    return `
      <div class="card-panel">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-default); color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
              <th style="padding: 12px;">Obligation / Return</th>
              <th style="padding: 12px;">Authority & Act</th>
              <th style="padding: 12px;">Statutory Due Date</th>
              <th style="padding: 12px;">2-Day Auto-Pay Trigger</th>
              <th style="padding: 12px;">Calculated Liability</th>
              <th style="padding: 12px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(o => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 12px; font-weight: 700; color: var(--text-primary);">${o.title}</td>
                <td style="padding: 12px;"><span class="tag-pill">${o.authority}</span></td>
                <td style="padding: 12px; font-family: var(--font-mono); font-weight: 600;">${o.dueDate}</td>
                <td style="padding: 12px; font-family: var(--font-mono); color: var(--accent-primary); font-size: 12px;">
                  ⚡ Scheduled 2 Days Prior
                </td>
                <td style="padding: 12px; font-family: var(--font-mono); font-weight: 700;">${o.calculatedLiability}</td>
                <td style="padding: 12px;">
                  <span class="badge-status ${o.status === 'Verified' ? 'pass' : o.status === 'Flagged Discrepancy' ? 'danger' : 'warn'}">
                    ${o.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderKanban(list) {
    const cols = [
      { id: "pending", title: "⏳ Pending (Awaiting 2-Day Pay)", filter: o => o.status === "Pending Review" },
      { id: "in_progress", title: "⚙️ In Progress", filter: o => o.status === "In Progress" },
      { id: "flagged", title: "⚠️ Flagged Discrepancy", filter: o => o.status === "Flagged Discrepancy" },
      { id: "verified", title: "✅ Paid & Verified", filter: o => o.status === "Verified" }
    ];

    return `
      <div class="grid-4col">
        ${cols.map(c => {
          const items = list.filter(c.filter);
          return `
            <div class="card-panel" style="padding: 14px; min-height: 480px; display: flex; flex-direction: column;">
              <div style="font-weight: 700; font-size: 13px; margin-bottom: 12px; display: flex; justify-content: space-between;">
                <span>${c.title}</span>
                <span class="tag-pill">${items.length}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                ${items.map(t => `
                  <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <span class="tag-pill" style="font-size: 9px; margin-bottom: 4px;">${t.authority}</span>
                    <div style="font-weight: 700; font-size: 12px; color: var(--text-primary); margin: 4px 0;">${t.title}</div>
                    <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">Due: ${t.dueDate}</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--accent-primary); margin-top: 6px;">${t.calculatedLiability}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  bindEvents() {
    const btnTimeline = document.getElementById('btn-cal-timeline');
    const btnKanban = document.getElementById('btn-cal-kanban');
    if (btnTimeline) btnTimeline.addEventListener('click', () => { this.viewMode = 'timeline'; this.render(); });
    if (btnKanban) btnKanban.addEventListener('click', () => { this.viewMode = 'kanban'; this.render(); });
  }
}
