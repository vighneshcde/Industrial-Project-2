// copilot.js - Autonomous Legal & Tax AI Copilot

import { COPILOT_PRELOADED_QA } from '../data/mockData.js';

export class ComplianceCopilot {
  constructor(appState) {
    this.appState = appState;
    this.messages = [
      {
        role: "assistant",
        text: `👋 Greetings! I am your **Autonomous RegTech Legal & Tax Copilot**.\n\nI monitor your statutory obligations and automatically schedule payment authorizations **2 days prior to each due date** across GSTN, CBDT, EPFO, and MCA.\n\nHow can I help your finance or legal team today?`
      }
    ];
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-copilot');
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 20px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>🤖</span> Autonomous Compliance & Legal Intelligence Copilot
          </div>
          <span class="badge-status info">Agentic Model: Gemini 2.0 RegTech Core</span>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary);">
          Ask questions regarding statutory payment deadlines, penalty calculations, cross-border tax liabilities, or automated 2-day pre-due-date payment authorizations.
        </p>
      </div>

      <div class="grid-2col" style="grid-template-columns: 320px 1fr; gap: 20px;">
        <!-- Shortcuts -->
        <div class="card-panel" style="display: flex; flex-direction: column; gap: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Quick Inquiries</div>
          
          <button class="btn-secondary prompt-q" data-q="How does the 2-day pre-due-date payment engine work?" style="text-align: left; font-size: 12px;">
            ⚡ 2-Day Pre-Due-Date Auto-Pay Engine
          </button>

          <button class="btn-secondary prompt-q" data-q="What are the statutory requirements for hiring remote employees in another state?" style="text-align: left; font-size: 12px;">
            🌐 Hiring Remote Employees in Another State
          </button>
        </div>

        <!-- Chat Box -->
        <div class="card-panel" style="display: flex; flex-direction: column; height: 500px;">
          <div id="chat-history" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-bottom: 12px;">
            ${this.messages.map(m => `
              <div style="display: flex; gap: 10px; align-self: ${m.role === 'user' ? 'flex-end' : 'flex-start'}; max-width: 85%;">
                <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${m.role === 'user' ? 'var(--accent-primary)' : 'var(--info-base)'}; font-size: 12px; flex-shrink: 0;">
                  ${m.role === 'user' ? '👤' : '🛡️'}
                </div>
                <div style="background: ${m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)'}; color: ${m.role === 'user' ? '#090d16' : 'var(--text-primary)'}; padding: 12px 16px; border-radius: var(--radius-md); font-size: 13px; line-height: 1.5;">
                  ${m.text.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')}
                </div>
              </div>
            `).join('')}
          </div>

          <form id="chat-form" style="display: flex; gap: 10px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
            <input type="text" id="chat-input" class="search-command-bar" style="flex: 1; font-size: 13px;" placeholder="Ask about laws, taxes, or payment authorizations..." />
            <button type="submit" class="btn-primary">Send ➔</button>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (val) {
          this.handleQuery(val);
          input.value = '';
        }
      });
    }

    const shortcuts = this.container.querySelectorAll('.prompt-q');
    shortcuts.forEach(b => {
      b.addEventListener('click', () => {
        const q = b.getAttribute('data-q');
        if (q) this.handleQuery(q);
      });
    });
  }

  handleQuery(query) {
    this.messages.push({ role: 'user', text: query });
    this.render();

    setTimeout(() => {
      let answer = `### 🛡️ Compliance Intelligence Summary\n\nRegarding **"${query}"**:\n\n1. **Statutory Requirement**: Our automated engine continuously maps this rule against your company profile (${this.appState.currentEntity.name}).\n2. **2-Day Pre-Due-Date Engine**: Any resulting payment or tax return will be automatically computed and presented for your 1-click authorization **2 days before deadline**.\n3. **Audit Readiness**: All actions are logged with immutable SHA-256 digital seals.`;

      for (const item of COPILOT_PRELOADED_QA) {
        if (item.triggers.some(t => query.toLowerCase().includes(t))) {
          answer = item.answer;
          break;
        }
      }

      this.messages.push({ role: 'assistant', text: answer });
      this.render();
    }, 600);
  }
}
