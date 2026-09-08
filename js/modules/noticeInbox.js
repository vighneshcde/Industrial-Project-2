// Notice inbox: a safe, review-first experience for Gmail / company mail integrations.

const DEMO_MESSAGES = [
  {
    id: 'MAIL-001', sender: 'donotreply@gst.gov.in', channel: 'Gmail', subject: 'GSTR-3B: Tax payment due on 20 August', received: 'Today, 9:42 AM',
    severity: 'urgent', label: 'Payment due', deadline: '20 Aug 2026', amount: '₹5,20,000',
    summary: 'GSTN reminder detected. The proposed GSTR-3B challan is ready for a finance review.', action: 'Review payment'
  },
  {
    id: 'MAIL-002', sender: 'cpc@incometax.gov.in', channel: 'Company mail', subject: 'Action required: proposed TDS adjustment', received: 'Yesterday, 4:10 PM',
    severity: 'urgent', label: 'Notice', deadline: 'Reply by 23 Aug 2026', amount: '₹24,500 variance',
    summary: 'Potential TDS credit mismatch under section 143(1)(a). Evidence and a reply draft need legal review.', action: 'Open defense draft'
  },
  {
    id: 'MAIL-003', sender: 'noreply@mca.gov.in', channel: 'Gmail', subject: 'AOC-4 annual filing acknowledgement', received: 'Mon, 11:30 AM',
    severity: 'info', label: 'Filing update', deadline: '30 Sep 2026', amount: 'No payment detected',
    summary: 'MCA filing reminder categorised as an upcoming annual obligation.', action: 'View obligation'
  },
  {
    id: 'MAIL-004', sender: 'payroll@company.in', channel: 'Company mail', subject: 'EPF ECR payroll file is ready for review', received: 'Fri, 5:05 PM',
    severity: 'success', label: 'Ready to review', deadline: '15 Aug 2026', amount: '₹3,48,000',
    summary: 'Internal payroll evidence found. Match it to the EPFO challan before authorization.', action: 'View evidence'
  }
];

export class NoticeInbox {
  constructor(appState, notify, openDefense) {
    this.appState = appState;
    this.notify = notify;
    this.openDefense = openDefense;
    this.messages = DEMO_MESSAGES.map(message => ({ ...message, read: false }));
    this.filter = 'all';
    this.connected = false;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-inbox');
    this.render();
  }

  render() {
    const visible = this.messages.filter(message => this.filter === 'all' || message.severity === this.filter);
    const attention = this.messages.filter(message => message.severity === 'urgent' && !message.read).length;
    const badge = document.getElementById('nav-badge-inbox');
    if (badge) { badge.textContent = `${attention} New`; badge.style.display = attention ? 'inline-block' : 'none'; }

    this.container.innerHTML = `
      <section class="card-panel" style="margin-bottom: 20px; border-color: ${this.connected ? 'var(--success-border)' : 'var(--border-default)'};">
        <div class="card-panel-header">
          <div class="card-panel-title">${this.connected ? '✓' : '🔒'} Company email connection</div>
          <span class="badge-status ${this.connected ? 'pass' : 'info'}">${this.connected ? 'CONNECTED (DEMO)' : 'NOT CONNECTED'}</span>
        </div>
        <p style="color:var(--text-secondary); max-width:860px; margin-bottom:14px;">Connect a dedicated Gmail or company mailbox to classify GST, income-tax, MCA and payroll notices. Duewise reads only selected labels; it never sends mail or pays anything from an email.</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <button class="btn-primary" id="btn-connect-mail">${this.connected ? '↻ Scan mailbox now' : 'Connect Gmail / company mail'}</button>
          <span style="font-size:12px; color:var(--text-muted);">Recommended: use a dedicated finance mailbox and grant read-only access.</span>
        </div>
      </section>

      <section class="card-panel">
        <div class="card-panel-header">
          <div class="card-panel-title">Inbox intelligence <span class="badge-status warn">${attention} needs attention</span></div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${[['all','All'], ['urgent','Needs action'], ['info','Filing updates'], ['success','Ready']].map(([key, label]) => `<button class="btn-secondary inbox-filter" data-filter="${key}" style="padding:5px 10px; ${this.filter === key ? 'border-color:var(--accent-primary); color:var(--accent-primary);' : ''}">${label}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${visible.map(message => this.messageCard(message)).join('') || '<p style="color:var(--text-muted); padding:20px; text-align:center;">No messages in this view.</p>'}
        </div>
      </section>`;
    this.bindEvents();
  }

  messageCard(message) {
    const tone = message.severity === 'urgent' ? 'danger' : message.severity === 'success' ? 'pass' : 'info';
    return `<article class="inbox-message ${message.read ? '' : 'unread'}" data-message="${message.id}" style="padding:16px; border:1px solid var(--border-subtle); border-left:4px solid var(--${message.severity === 'urgent' ? 'danger' : message.severity === 'success' ? 'success' : 'info'}-base); border-radius:var(--radius-md); background:${message.read ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)'};">
      <div style="display:flex; justify-content:space-between; gap:14px; align-items:flex-start;">
        <div style="min-width:0;"><div style="font-size:12px; color:var(--text-muted);">${message.channel} · ${message.sender} · ${message.received}</div><h3 style="font-size:15px; margin:3px 0 7px;">${message.subject}</h3><p style="font-size:13px; color:var(--text-secondary);">${message.summary}</p></div>
        <span class="badge-status ${tone}" style="white-space:nowrap;">${message.label}</span>
      </div>
      <div style="margin-top:12px; display:flex; gap:16px; flex-wrap:wrap; align-items:center; font-size:12px;"><span>📅 <strong>${message.deadline}</strong></span><span>💰 ${message.amount}</span><button class="btn-secondary btn-inbox-action" data-message="${message.id}" style="margin-left:auto; padding:6px 11px;">${message.action} →</button></div>
    </article>`;
  }

  bindEvents() {
    this.container.querySelector('#btn-connect-mail').addEventListener('click', () => {
      this.connected = true;
      this.notify('Demo mailbox scan complete: 2 items need your review. Connect OAuth in production to scan real mail.');
      this.render();
    });
    this.container.querySelectorAll('.inbox-filter').forEach(button => button.addEventListener('click', () => { this.filter = button.dataset.filter; this.render(); }));
    this.container.querySelectorAll('.btn-inbox-action').forEach(button => button.addEventListener('click', () => {
      const message = this.messages.find(item => item.id === button.dataset.message);
      message.read = true;
      if (message.id === 'MAIL-002') this.openDefense();
      else if (message.id === 'MAIL-001') window.aegisFlowApp.switchTab('payments');
      else window.aegisFlowApp.switchTab('calendar');
      this.render();
    }));
  }
}
