// Duewise AI command center: prioritises the day's decisions over accounting jargon.

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export class CommandCenter {
  constructor(appState, navigate) {
    this.appState = appState;
    this.navigate = navigate;
    this.container = document.getElementById('view-dashboard');
    this.render();
  }

  getPendingPayments() {
    return (window.aegisFlowApp?.modules?.payments?.paymentRequests || [])
      .filter(payment => payment.status === 'AWAITING_USER_APPROVAL');
  }

  render() {
    if (!this.container) return;
    const user = this.appState.currentUser || { full_name: 'there' };
    const firstName = (user.full_name || 'there').split(' ')[0];
    const pending = this.getPendingPayments();
    const total = pending.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const urgent = pending.filter(payment => payment.urgency === 'CRITICAL' || payment.urgency === 'HIGH');
    const obligations = [...(this.appState.obligations || [])]
      .filter(item => item.status !== 'Verified')
      .sort((a, b) => Number(a.daysRemaining ?? 999) - Number(b.daysRemaining ?? 999))
      .slice(0, 3);
    const date = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

    this.container.innerHTML = `
      <section class="day-hero">
        <div class="day-hero-glow"></div>
        <div class="day-hero-copy">
          <p class="eyebrow">${date}</p>
          <h1>Good day, ${firstName}.<br><span>Your financial week is under control.</span></h1>
          <p class="day-hero-text">Duewise has sorted your inbox, payment plan, and compliance deadlines into one practical next step.</p>
          <div class="day-hero-actions">
            <button class="btn-primary btn-hero" data-go="payments">Review ${pending.length || 'your'} payment${pending.length === 1 ? '' : 's'} <span>→</span></button>
            <button class="btn-secondary btn-hero-secondary" data-go="inbox">Open notice inbox</button>
          </div>
        </div>
        <div class="confidence-orb" aria-label="Financial readiness score 84 percent">
          <div class="orb-ring"><strong>84</strong><span>/100</span></div>
          <p>Financial<br>readiness</p>
        </div>
      </section>

      <section class="focus-grid" aria-label="Today's financial summary">
        <article class="focus-card focus-primary">
          <div class="focus-icon">💳</div>
          <p>Ready for your review</p>
          <h2>${money(total)}</h2>
          <span>${pending.length} payment${pending.length === 1 ? '' : 's'} prepared · no payment is sent without you</span>
          <button class="text-button" data-go="payments">See payment plan →</button>
        </article>
        <article class="focus-card">
          <div class="focus-icon soft-warning">✉️</div>
          <p>Inbox needs attention</p>
          <h2>2 notices</h2>
          <span>One GST reminder and one TDS response need a human review</span>
          <button class="text-button" data-go="inbox">Review notices →</button>
        </article>
        <article class="focus-card">
          <div class="focus-icon soft-success">🛡️</div>
          <p>Protected this month</p>
          <h2>4 deadlines</h2>
          <span>Tracked early with owners, evidence, and follow-up reminders</span>
          <button class="text-button" data-go="calendar">See all deadlines →</button>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="dashboard-card next-step-card">
          <header><div><p class="eyebrow">AI recommendation</p><h2>Your next best move</h2></div><span class="live-dot">Live</span></header>
          <div class="next-step-body">
            <div class="next-step-number">01</div>
            <div><h3>${urgent.length ? 'Review the high-priority tax payments' : 'Everything urgent is covered'}</h3><p>${urgent.length ? `${urgent.length} prepared item${urgent.length === 1 ? ' is' : 's are'} waiting. Check the challan and funding bank once, then approve only what looks right.` : 'There are no high-priority payments waiting for action.'}</p></div>
          </div>
          <div class="safe-note">🔒 Duewise will never move money from an email or without an explicit approval.</div>
          <button class="btn-primary" data-go="payments">Review safely <span>→</span></button>
        </article>

        <article class="dashboard-card timeline-card">
          <header><div><p class="eyebrow">Up next</p><h2>Your deadline timeline</h2></div><button class="text-button" data-go="calendar">Full calendar →</button></header>
          <div class="mini-timeline">
            ${obligations.map((item, index) => `<div class="timeline-row"><div class="timeline-marker ${index === 0 ? 'active' : ''}"></div><div><p>${item.category || 'Compliance'}</p><h3>${item.title}</h3><span>${item.dueDate || 'Date to be confirmed'} · ${item.assignedTo || 'Unassigned'}</span></div><span class="timeline-status ${String(item.riskLevel || '').toLowerCase()}">${item.status || 'Planned'}</span></div>`).join('') || '<p class="empty-state">No upcoming deadlines are waiting for attention.</p>'}
          </div>
        </article>
      </section>

      <section class="why-now-strip">
        <div><span>✨</span><strong>Why Duewise feels simpler</strong></div>
        <p>It turns messages and tax deadlines into a single decision, with the important facts visible before you act.</p>
        <button class="text-button" data-go="copilot">Ask Duewise AI →</button>
      </section>`;

    this.container.querySelectorAll('[data-go]').forEach(button => {
      button.addEventListener('click', () => this.navigate(button.dataset.go));
    });
  }
}
