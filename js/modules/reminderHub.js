// Delivery preferences stay local in the demo. Nothing is emailed or location-tracked automatically.

const PREFS_KEY = 'duewise_reminder_preferences';

const defaultPreferences = {
  email: '',
  location: '',
  includeLocation: true,
  inApp: true,
  gmail: false,
  reminderDays: '2'
};

export class ReminderHub {
  constructor(appState, notify, navigate) {
    this.appState = appState;
    this.notify = notify;
    this.navigate = navigate;
    this.container = document.getElementById('view-reminders');
    this.preferences = this.loadPreferences();
    this.render();
  }

  loadPreferences() {
    try { return { ...defaultPreferences, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }; }
    catch { return { ...defaultPreferences }; }
  }

  savePreferences() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(this.preferences));
  }

  getPayment() {
    return (window.aegisFlowApp?.modules?.payments?.paymentRequests || [])
      .find(item => item.status === 'AWAITING_USER_APPROVAL') || {
        title: 'GSTR-3B payment review', amount: 520000, due_date: '20 Aug 2026', beneficiary_authority: 'GSTN'
      };
  }

  render() {
    if (!this.container) return;
    const payment = this.getPayment();
    const amount = `₹${Number(payment.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    const recipient = this.preferences.email || 'No Gmail address selected';
    const locationLine = this.preferences.includeLocation && this.preferences.location.trim()
      ? `Location: ${this.preferences.location.trim()}` : 'Location: not included';

    this.container.innerHTML = `
      <section class="reminder-hero">
        <div><p class="eyebrow">CALM, EARLY REMINDERS</p><h1>Never get surprised by a due date again.</h1><p>Duewise prepares the reminder two days before the deadline, with the payment, notice, and office context you need in one place.</p></div>
        <div class="reminder-clock"><span>2</span><small>days early</small></div>
      </section>

      <section class="delivery-grid">
        <article class="dashboard-card preference-card">
          <header><div><p class="eyebrow">DELIVERY SETTINGS</p><h2>Where should Duewise remind you?</h2></div><span class="badge-status info">Your control</span></header>
          <div class="delivery-option"><div class="delivery-symbol">✨</div><div><h3>Duewise inbox</h3><p>Always available inside your dashboard.</p></div><label class="switch"><input id="pref-inapp" type="checkbox" ${this.preferences.inApp ? 'checked' : ''}><span></span></label></div>
          <div class="delivery-option"><div class="delivery-symbol gmail-symbol">M</div><div><h3>Gmail reminder</h3><p>${this.preferences.gmail && this.preferences.email ? `Will be addressed to ${recipient}` : 'Set your Gmail address below to prepare email reminders.'}</p></div><label class="switch"><input id="pref-gmail" type="checkbox" ${this.preferences.gmail ? 'checked' : ''}><span></span></label></div>
          <div class="form-group"><label for="pref-email">Gmail address for reminders</label><input id="pref-email" type="email" placeholder="finance@yourcompany.com" value="${this.escape(this.preferences.email)}"></div>
          <div class="form-group"><label for="pref-days">Remind me before the due date</label><select id="pref-days"><option value="2" ${this.preferences.reminderDays === '2' ? 'selected' : ''}>2 days early (recommended)</option><option value="3" ${this.preferences.reminderDays === '3' ? 'selected' : ''}>3 days early</option><option value="5" ${this.preferences.reminderDays === '5' ? 'selected' : ''}>5 days early</option></select></div>
          <button class="btn-primary" id="save-reminder-preferences">Save reminder preferences</button>
          <p class="privacy-note">🔒 Saved only in this browser for the demo. Gmail delivery needs an approved Google OAuth connection in production.</p>
        </article>

        <article class="dashboard-card preference-card location-card">
          <header><div><p class="eyebrow">OPTIONAL LOCATION CONTEXT</p><h2>Include the right office context</h2></div><span class="badge-status pass">Manual only</span></header>
          <p class="location-intro">Add an office, branch, or tax jurisdiction to reminders so the right team knows where to handle it. Duewise does not track your live location.</p>
          <div class="location-pin"><span>⌖</span><div><strong>${this.preferences.location || 'No office location added'}</strong><small>Included only when you choose it</small></div></div>
          <div class="form-group"><label for="pref-location">Office / tax location</label><input id="pref-location" type="text" placeholder="e.g. Bengaluru finance office, Karnataka" value="${this.escape(this.preferences.location)}"></div>
          <label class="check-row"><input id="pref-include-location" type="checkbox" ${this.preferences.includeLocation ? 'checked' : ''}> Include this context in reminders</label>
          <button class="btn-secondary" id="save-location-preferences">Save location context</button>
          <p class="privacy-note">No GPS, background tracking, or precise device location is requested.</p>
        </article>
      </section>

      <section class="dashboard-grid reminder-bottom-grid">
        <article class="dashboard-card reminder-preview-card">
          <header><div><p class="eyebrow">LIVE PREVIEW</p><h2>What your next reminder will say</h2></div><span class="badge-status warn">Preview</span></header>
          <div class="email-preview"><div class="email-preview-header"><span>To</span><strong>${this.preferences.gmail && this.preferences.email ? recipient : 'Duewise in-app inbox'}</strong></div><div class="email-preview-header"><span>Subject</span><strong>Action needed: ${payment.title}</strong></div><div class="email-preview-body"><p>Hello ${this.appState.currentUser?.full_name?.split(' ')[0] || 'there'},</p><p>Your ${payment.beneficiary_authority || 'statutory'} payment of <strong>${amount}</strong> is ready for your review before the <strong>${payment.due_date || 'due date'}</strong> deadline.</p><p>${locationLine}</p><p>Open Duewise to check the challan, bank and amount before approving.</p></div></div>
          <button class="btn-primary" id="btn-preview-reminder">Show reminder preview</button>
        </article>

        <article class="dashboard-card">
          <header><div><p class="eyebrow">UPCOMING DELIVERY</p><h2>Reminder plan</h2></div><button class="text-button" id="open-payment-plan">Payment plan →</button></header>
          <div class="delivery-timeline"><div><span class="timeline-dot blue"></span><p><strong>Now</strong><br>Payment and evidence checked by Duewise</p></div><div><span class="timeline-dot amber"></span><p><strong>${this.preferences.reminderDays} days before due date</strong><br>In-app alert${this.preferences.gmail ? ' and Gmail reminder' : ''} is prepared</p></div><div><span class="timeline-dot green"></span><p><strong>After your approval</strong><br>Receipt and confirmation are saved to the payment archive</p></div></div>
          <button class="btn-secondary" id="open-mailbox-setup">Set up Gmail connection</button>
        </article>
      </section>`;

    this.bindEvents();
  }

  escape(value) {
    return String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
  }

  readForm() {
    this.preferences = {
      email: this.container.querySelector('#pref-email').value.trim(),
      location: this.container.querySelector('#pref-location').value.trim(),
      includeLocation: this.container.querySelector('#pref-include-location').checked,
      inApp: this.container.querySelector('#pref-inapp').checked,
      gmail: this.container.querySelector('#pref-gmail').checked,
      reminderDays: this.container.querySelector('#pref-days').value
    };
    this.savePreferences();
  }

  bindEvents() {
    this.container.querySelector('#save-reminder-preferences').addEventListener('click', () => {
      this.readForm(); this.render(); this.notify('Reminder preferences saved. No email has been sent.');
    });
    this.container.querySelector('#save-location-preferences').addEventListener('click', () => {
      this.readForm(); this.render(); this.notify('Office location context saved locally.');
    });
    this.container.querySelector('#btn-preview-reminder').addEventListener('click', () => {
      this.readForm(); this.render(); this.notify('Preview updated—review it before enabling any real Gmail delivery.');
    });
    this.container.querySelector('#open-payment-plan').addEventListener('click', () => this.navigate('payments'));
    this.container.querySelector('#open-mailbox-setup').addEventListener('click', () => this.navigate('inbox'));
  }
}
