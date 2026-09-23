// app.js - AegisFlow™ Main Application Orchestrator & State Management

import { MOCK_ENTITIES, INITIAL_OBLIGATIONS } from './data/mockData.js';
import { EntityProfiler } from './modules/entityProfiler.js';
import { RegulatoryRadar } from './modules/regulatoryRadar.js';
import { ObligationCalendar } from './modules/obligationCalendar.js';
import { DocumentAuditor } from './modules/documentAuditor.js';
import { RiskMatrix } from './modules/riskMatrix.js';
import { KnowledgeGraphVisualizer } from './modules/knowledgeGraph.js';
import { ComplianceCopilot } from './modules/copilot.js';
import { AuthManager } from './modules/auth.js';
import { PaymentEngine } from './modules/paymentEngine.js';
import { TreasuryEngine } from './modules/treasuryEngine.js';
import { NoticeDefenseEngine } from './modules/noticeDefense.js';
import { NoticeInbox } from './modules/noticeInbox.js';
import { CustomRuleCrafter } from './modules/customRuleCrafter.js';
import { CommandCenter } from './modules/commandCenter.js';
import { ReminderHub } from './modules/reminderHub.js';
import { CursorEffectsManager } from './modules/cursorEffects.js';

class AegisFlowApp {
  constructor() {
    window.aegisFlowApp = this;
    this.state = {
      currentEntity: { ...MOCK_ENTITIES[0] },
      obligations: JSON.parse(JSON.stringify(INITIAL_OBLIGATIONS)),
      currentUser: null,
      activeTab: 'dashboard',
      theme: 'dark'
    };

    this.modules = {};
    this.init();
  }

  async init() {
    // 1. Auth Manager with Organization Synchronization
    this.modules.auth = new AuthManager(this.state, (user) => {
      this.state.currentUser = user;
      if (user && user.organization) {
        this.state.currentEntity.name = user.organization;
        this.updateEntityMetaTags();
      }
      if (this.modules.payments) this.modules.payments.render();
      if (this.modules.treasury) this.modules.treasury.render();
      if (this.modules.notices) this.modules.notices.render();
      if (this.modules.inbox) this.modules.inbox.render();
      if (this.modules.crafter) this.modules.crafter.render();
      if (this.modules.risk) this.modules.risk.render();
    });
    this.state.currentUser = this.modules.auth.currentUser;
    if (this.state.currentUser && this.state.currentUser.organization) {
      this.state.currentEntity.name = this.state.currentUser.organization;
    }

    // 2. Fetch obligations from SQLite backend
    await this.fetchBackendObligations();

    this.initSidebarAndEntity();
    this.initModules();
    this.initGlobalEvents();
    this.switchTab(this.state.activeTab);
    this.updateGlobalHeader();
  }

  async fetchBackendObligations() {
    try {
      const resp = await fetch(`/api/obligations?entity_id=${this.state.currentEntity.id}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.length) {
          this.state.obligations = data.map(d => ({
            id: d.id,
            entityId: d.entity_id,
            title: d.title,
            act: d.act,
            authority: d.authority,
            category: d.category,
            dueDate: d.due_date,
            daysRemaining: d.days_remaining,
            status: d.status,
            riskLevel: d.risk_level,
            department: d.department,
            assignedTo: d.assigned_to,
            calculatedLiability: d.calculated_liability,
            verifiedProofId: d.verified_proof_id,
            verificationStatus: d.verification_status,
            lastAuditTimestamp: d.last_audit_timestamp
          }));
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  initSidebarAndEntity() {
    const entitySelect = document.getElementById('sidebar-entity-select');
    if (entitySelect) {
      entitySelect.innerHTML = MOCK_ENTITIES.map(e => `
        <option value="${e.id}" ${e.id === this.state.currentEntity.id ? 'selected' : ''}>
          ${e.jurisdiction === 'india' ? '🇮🇳' : e.jurisdiction === 'us' ? '🇺🇸' : '🇪🇺'} ${this.state.currentEntity.id === e.id ? this.state.currentEntity.name : e.name}
        </option>
      `).join('');

      entitySelect.addEventListener('change', (e) => {
        const ent = MOCK_ENTITIES.find(item => item.id === e.target.value);
        if (ent) {
          this.switchEntity(ent);
        }
      });
    }

    this.updateEntityMetaTags();
  }

  updateEntityMetaTags() {
    const container = document.getElementById('sidebar-entity-tags');
    const ent = this.state.currentEntity;
    if (container) {
      container.innerHTML = `
        <span class="tag-pill">${ent.entityType}</span>
        <span class="tag-pill">${ent.sector}</span>
        <span class="tag-pill">${ent.currencySymbol}${ent.annualTurnoverCr} Cr</span>
        <span class="tag-pill">👥 ${ent.headcount} Staff</span>
      `;
    }
  }

  initModules() {
    // 0. Automated 2-Day Pre-Due-Date Payment & Approval Center
    this.modules.payments = new PaymentEngine(this.state, (paidReq) => {
      const linked = this.state.obligations.find(o => o.id === paidReq.obligation_id);
      if (linked) {
        linked.status = 'Verified';
        linked.verificationStatus = 'AI_VERIFIED_PASS';
      }
      if (this.modules.calendar) this.modules.calendar.render();
      if (this.modules.risk) this.modules.risk.render();
      if (this.modules.treasury) this.modules.treasury.render();
      this.updateGlobalHeader();
      this.showToastNotification(`Payment of ₹${paidReq.amount.toLocaleString()} successfully processed 2 days early!`);
    });

    // 1. Corporate Treasury & Liquidity Shield
    this.modules.treasury = new TreasuryEngine(this.state);

    // 2. AI Tax Notice & Scrutiny Defense Center
    this.modules.notices = new NoticeDefenseEngine(this.state);

    this.modules.inbox = new NoticeInbox(this.state, (message) => this.showToastNotification(message), () => this.switchTab('notices'));

    // 3. Custom Corporate Rule Crafter
    this.modules.crafter = new CustomRuleCrafter(this.state, (newObl, amount) => {
      this.state.obligations.unshift(newObl);
      if (this.modules.calendar) this.modules.calendar.render();
      if (this.modules.risk) this.modules.risk.render();
      if (amount > 0 && this.modules.payments) {
        this.modules.payments.paymentRequests.unshift({
          id: `PAY-REQ-CUSTOM-${Date.now().toString().slice(-4)}`,
          entity_id: this.state.currentEntity.id,
          obligation_id: newObl.id,
          title: `Custom Obligation Pre-Authorization: ${newObl.title}`,
          action_type: "CUSTOM_FILING_FEE",
          beneficiary_authority: newObl.authority,
          due_date: newObl.dueDate,
          scheduled_pay_date: "T-2 Days in Advance",
          days_before_due: 2,
          amount: amount,
          currency_symbol: "₹",
          payment_payload: {
            statute: newObl.act,
            authority: newObl.authority,
            department: newObl.department,
            pre_due_date_trigger: "T-2 Days Automated Schedule"
          },
          status: "AWAITING_USER_APPROVAL",
          urgency: "HIGH",
          created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
        });
        this.modules.payments.render();
      }
      this.updateGlobalHeader();
    });

    // 4. Entity Profiler
    this.modules.profiler = new EntityProfiler(this.state, (updatedEntity) => {
      this.state.currentEntity = updatedEntity;
      this.updateEntityMetaTags();
      this.updateGlobalHeader();
      if (this.modules.radar) this.modules.radar.render();
      if (this.modules.risk) this.modules.risk.render();
      if (this.modules.payments) this.modules.payments.loadPaymentRequests();
      if (this.modules.treasury) this.modules.treasury.render();
    });

    // 5. Regulatory Radar
    this.modules.radar = new RegulatoryRadar(this.state, (newObligation) => {
      this.state.obligations.unshift(newObligation);
      if (this.modules.calendar) this.modules.calendar.render();
      if (this.modules.risk) this.modules.risk.render();
      this.updateGlobalHeader();
      this.showToastNotification(`New statutory obligation '${newObligation.title}' auto-scheduled.`);
    });

    // 6. Obligation Calendar
    this.modules.calendar = new ObligationCalendar(this.state, (obligationId) => {
      this.switchTab('auditor');
    });

    // 7. Document Auditor
    this.modules.auditor = new DocumentAuditor(this.state, () => {
      if (this.modules.risk) this.modules.risk.render();
      this.updateGlobalHeader();
    });

    // 8. Risk Matrix
    this.modules.risk = new RiskMatrix(this.state);

    // 9. Knowledge Graph
    this.modules.kg = new KnowledgeGraphVisualizer(this.state);

    // 10. AI Copilot
    this.modules.copilot = new ComplianceCopilot(this.state);

    // 11. Human-friendly command center: a clear first stop for every workday.
    this.modules.dashboard = new CommandCenter(this.state, (tab) => this.switchTab(tab));

    // 12. Delivery preferences for in-app, Gmail, and office-aware reminders.
    this.modules.reminders = new ReminderHub(this.state, (message) => this.showToastNotification(message), (tab) => this.switchTab(tab));

    // 13. Interactive Cursor Glow Follower, Pop-Up Animations & Smart Tooltips
    this.modules.cursorEffects = new CursorEffectsManager();
  }

  initGlobalEvents() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Search bar
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.includes('pay') || query.includes('gst') || query.includes('tax')) {
          this.switchTab('payments');
        } else if (query.includes('treasury') || query.includes('bank') || query.includes('cash')) {
          this.switchTab('treasury');
        } else if (query.includes('notice') || query.includes('scrutiny')) {
          this.switchTab('notices');
        } else if (query.includes('crafter') || query.includes('custom') || query.includes('rule')) {
          this.switchTab('crafter');
        }
      });
    }

    // Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    });

    // Notification bell
    const notifBtn = document.getElementById('btn-notif-tray');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.switchTab('payments');
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  switchTab(tabName) {
    this.state.activeTab = tabName;

    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.module-viewport').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    if (tabName === 'kg' && this.modules.kg) {
      setTimeout(() => this.modules.kg.initCanvas(), 50);
    }

    const org = this.state.currentEntity ? this.state.currentEntity.name : 'Apex FinTech';

    const titles = {
      dashboard: { title: "✨ Your money day, made simple", sub: "A clear plan for bills, taxes, and notices—before they become urgent." },
      payments: { title: "⚡ 2-Day Pre-Due-Date Auto-Payment & Authorization Center", sub: `Automatic calculation of statutory payments scheduled 2 days before due date for ${org}` },
      treasury: { title: "🏦 Corporate Treasury & Bank Liquidity Safety Shield", sub: `Live multi-bank liquidity monitoring vs. upcoming statutory tax commitments for ${org}` },
      notices: { title: "🛡️ AI Tax Notice & Scrutiny Defense Center", sub: `Instant Section-cited formal legal submissions for GSTN, CBDT, and MCA notices` },
      inbox: { title: "✉️ Connected Notice Inbox", sub: "Review Gmail and company notices; AI highlights deadlines, amounts, and the next safe action" },
      reminders: { title: "🔔 Reminders & delivery", sub: "Choose where your alerts go and the office context they should include" },
      crafter: { title: "⚙️ Custom Corporate Compliance & Rule Crafter", sub: `Build bespoke internal compliance rules with automated 2-day early payment triggers` },
      risk: { title: "Executive Risk Matrix & Compliance Health", sub: "Real-time compliance health score, penalty exposure, and certified audit pack export" },
      radar: { title: "Autonomous Regulatory Radar & Diff Engine", sub: "Live gazette monitoring, clause parser, and plain-English impact summaries" },
      calendar: { title: "Dynamic Obligation Calendar & Workflows", sub: "Multi-horizon timeline, role-based assignments, and 2-day payment triggers" },
      auditor: { title: "Multimodal AI Document Auditor", sub: "OCR bounding box inspection, ledger cross-reconciliation, and shortfall detection" },
      profiler: { title: "Company Digital Twin & Entity Profiler", sub: `Corporate parameter mapping and legal applicability for ${org}` },
      kg: { title: "Semantic Regulatory Knowledge Graph", sub: "Interactive network mapping acts, sections, entities, and verified payments" },
      copilot: { title: "Duewise AI Copilot", sub: "A practical conversation about deadlines, notices, and next steps" }
    };

    const headerTitle = document.getElementById('top-nav-title');
    const headerSub = document.getElementById('top-nav-sub');
    if (headerTitle && titles[tabName]) {
      headerTitle.textContent = titles[tabName].title;
    }
    if (headerSub && titles[tabName]) {
      headerSub.textContent = titles[tabName].sub;
    }
  }

  async switchEntity(entity) {
    this.state.currentEntity = { ...entity };
    this.updateEntityMetaTags();
    await this.fetchBackendObligations();
    this.updateGlobalHeader();

    if (this.modules.payments) this.modules.payments.loadPaymentRequests();
    if (this.modules.profiler) this.modules.profiler.render();
    if (this.modules.radar) this.modules.radar.render();
    if (this.modules.risk) this.modules.risk.render();
    if (this.modules.calendar) this.modules.calendar.render();
    if (this.modules.treasury) this.modules.treasury.render();
    if (this.modules.notices) this.modules.notices.render();
    if (this.modules.inbox) this.modules.inbox.render();
    if (this.modules.crafter) this.modules.crafter.render();
    if (this.modules.dashboard) this.modules.dashboard.render();
    if (this.modules.reminders) this.modules.reminders.render();

    this.showToastNotification(`Switched digital twin to ${entity.name}`);
  }

  updateGlobalHeader() {
    const scoreEl = document.getElementById('header-health-score');
    if (scoreEl && this.modules.risk) {
      const score = this.modules.risk.calculateHealthScore();
      scoreEl.textContent = `${score}%`;
      scoreEl.style.color = score >= 85 ? 'var(--success-base)' : score >= 65 ? 'var(--warning-base)' : 'var(--danger-base)';
    }
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = this.state.theme === 'dark' ? '🌙' : '☀️';
    }
  }

  showToastNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      border: 1px solid var(--accent-primary);
      box-shadow: var(--shadow-lg);
      padding: 12px 18px;
      border-radius: var(--radius-md);
      font-size: 13px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeIn 0.2s ease-out;
    `;
    toast.innerHTML = `<span>🛡️</span> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aegisFlowApp = new AegisFlowApp();
});
