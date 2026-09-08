// auth.js - User Authentication, Custom Registration & Organization Synchronization

export class AuthManager {
  constructor(appState, onAuthChange) {
    this.appState = appState;
    this.onAuthChange = onAuthChange;
    this.currentUser = this.loadStoredUser();
    this.activeAuthTab = 'signin'; // 'signin' or 'register'
    this.initDOM();
    if (this.currentUser && this.currentUser.organization) {
      this.syncOrganization(this.currentUser.organization);
    }
  }

  loadStoredUser() {
    const saved = localStorage.getItem('regtech_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        // Replace the shipped demo persona with Vighnesh's profile.
        if (user.id === 'USR-001' || user.full_name === 'Rajesh Varma') {
          return {
            ...user,
            username: 'vighnesh',
            email: 'vighnesh@tcs.com',
            full_name: 'Vighnesh Kamale',
            organization: user.organization || 'Tata Consultancy Services (TCS)'
          };
        }
        return user;
      } catch (e) {
        return null;
      }
    }
    // Default demo profile
    return {
      id: "USR-001",
      username: "vighnesh",
      email: "vighnesh@tcs.com",
      full_name: "Vighnesh Kamale",
      role: "admin",
      organization: "Tata Consultancy Services (TCS)",
      avatar: "👔"
    };
  }

  saveUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('regtech_user', JSON.stringify(user));
      if (user.organization) {
        this.syncOrganization(user.organization);
      }
    } else {
      localStorage.removeItem('regtech_user');
    }
    this.renderHeaderWidget();
    if (this.onAuthChange) this.onAuthChange(this.currentUser);
  }

  syncOrganization(orgName) {
    if (this.appState && this.appState.currentEntity && orgName) {
      this.appState.currentEntity.name = orgName;
      const sidebarSelect = document.getElementById('sidebar-entity-select');
      if (sidebarSelect && sidebarSelect.options && sidebarSelect.options.length > 0) {
        sidebarSelect.options[0].text = `🇮🇳 ${orgName}`;
      }
      const topTitle = document.getElementById('top-nav-sub');
      if (topTitle) {
        topTitle.textContent = `Autonomous compliance & 2-day pre-due-date treasury engine for ${orgName}`;
      }
    }
  }

  initDOM() {
    this.renderHeaderWidget();
    this.bindGlobalAuthModal();
  }

  renderHeaderWidget() {
    const container = document.getElementById('header-auth-widget');
    if (!container) return;

    if (this.currentUser) {
      container.innerHTML = `
        <div id="btn-open-auth-modal" style="display: flex; align-items: center; gap: 10px; background: var(--bg-surface-elevated); padding: 5px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-default); cursor: pointer; transition: all 0.2s;" title="Click to Switch Account, Register New User, or Change Organization">
          <span style="font-size: 18px;">${this.currentUser.avatar || '👤'}</span>
          <div style="line-height: 1.2;">
            <div style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${this.currentUser.full_name}</div>
            <div style="font-size: 10px; color: var(--accent-primary); text-transform: uppercase; font-weight: 700; font-family: var(--font-mono);">
              ${this.currentUser.organization || 'Apex FinTech'} • ${this.currentUser.role.toUpperCase()}
            </div>
          </div>
          <span style="font-size: 11px; color: var(--text-muted); margin-left: 4px;">▼</span>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button id="btn-open-auth-modal" class="btn-primary" style="padding: 6px 14px; font-size: 12px;">
          <span>🔐</span> Sign In / Register
        </button>
      `;
    }

    const trigger = document.getElementById('btn-open-auth-modal');
    if (trigger) {
      trigger.addEventListener('click', () => this.openAuthModal());
    }
  }

  bindGlobalAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    this.renderModalContent(modal);
  }

  renderModalContent(modal) {
    modal.innerHTML = `
      <div class="modal-content" style="width: 560px; padding: 26px;">
        <div class="modal-header" style="margin-bottom: 16px;">
          <div class="modal-title" style="display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Duewise Account & Organization
          </div>
          <button class="modal-close-btn" id="btn-close-auth">&times;</button>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; border-bottom: 1px solid var(--border-default); margin-bottom: 20px;">
          <button id="tab-btn-signin" class="btn-secondary" style="flex: 1; border-radius: 0; border: none; border-bottom: 2px solid ${this.activeAuthTab === 'signin' ? 'var(--accent-primary)' : 'transparent'}; background: ${this.activeAuthTab === 'signin' ? 'var(--bg-surface-hover)' : 'transparent'}; color: ${this.activeAuthTab === 'signin' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; font-weight: 700;">
            🔑 Sign In / Login
          </button>
          <button id="tab-btn-register" class="btn-secondary" style="flex: 1; border-radius: 0; border: none; border-bottom: 2px solid ${this.activeAuthTab === 'register' ? 'var(--accent-primary)' : 'transparent'}; background: ${this.activeAuthTab === 'register' ? 'var(--bg-surface-hover)' : 'transparent'}; color: ${this.activeAuthTab === 'register' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; font-weight: 700;">
            ➕ Create Account & Organization
          </button>
        </div>

        <!-- TAB 1: SIGN IN -->
        <div id="auth-tab-signin" style="display: ${this.activeAuthTab === 'signin' ? 'block' : 'none'};">
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 16px;">
            Sign in with your credentials or switch to a demo persona:
          </p>

          <!-- 1-Click Role Switcher Personas -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
            <button class="btn-secondary role-quick-login" data-role="admin" style="display: flex; align-items: center; gap: 8px; padding: 10px; text-align: left;">
              <span style="font-size: 20px;">👔</span>
              <div>
                <div style="font-weight: 700; font-size: 12px;">Vighnesh</div>
                <div style="font-size: 10px; color: var(--accent-primary);">VP Finance / Admin</div>
              </div>
            </button>

            <button class="btn-secondary role-quick-login" data-role="finance" style="display: flex; align-items: center; gap: 8px; padding: 10px; text-align: left;">
              <span style="font-size: 20px;">💼</span>
              <div>
                <div style="font-weight: 700; font-size: 12px;">Priya Sharma</div>
                <div style="font-size: 10px; color: var(--accent-primary);">Senior Tax Lead</div>
              </div>
            </button>

            <button class="btn-secondary role-quick-login" data-role="legal" style="display: flex; align-items: center; gap: 8px; padding: 10px; text-align: left;">
              <span style="font-size: 20px;">⚖️</span>
              <div>
                <div style="font-weight: 700; font-size: 12px;">Adv. Sunita K.</div>
                <div style="font-size: 10px; color: var(--accent-primary);">Company Secretary</div>
              </div>
            </button>

            <button class="btn-secondary role-quick-login" data-role="auditor" style="display: flex; align-items: center; gap: 8px; padding: 10px; text-align: left;">
              <span style="font-size: 20px;">🔍</span>
              <div>
                <div style="font-weight: 700; font-size: 12px;">Karthik Menon</div>
                <div style="font-size: 10px; color: var(--accent-primary);">Statutory Auditor</div>
              </div>
            </button>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px;">
            <form id="auth-login-form" style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Username or Email</label>
                <input type="text" id="auth-username" class="form-input" placeholder="Enter username or email" value="${this.currentUser ? this.currentUser.username : 'admin'}" required />
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Password</label>
                  <span id="btn-toggle-pwd-login" style="font-size: 11px; color: var(--accent-primary); cursor: pointer; font-weight: 600;">👁️ Show Password</span>
                </div>
                <input type="password" id="auth-password" class="form-input" placeholder="Enter password" value="admin123" required />
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <button type="button" id="btn-auth-signout" class="btn-danger" style="font-size: 12px; padding: 7px 14px;">
                  Sign Out
                </button>
                <button type="submit" class="btn-primary" style="padding: 9px 24px;">
                  <span>🔑</span> Sign In
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- TAB 2: CREATE NEW ACCOUNT & ORGANIZATION -->
        <div id="auth-tab-register" style="display: ${this.activeAuthTab === 'register' ? 'block' : 'none'};">
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
            Enter your details and company name to personalize your Duewise workspace:
          </p>

          <form id="auth-register-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Your Full Name *</label>
                <input type="text" id="reg-fullname" class="form-input" placeholder="e.g. John Doe" required />
              </div>

              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Choose Username *</label>
                <input type="text" id="reg-username" class="form-input" placeholder="e.g. johndoe" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Company / Organization Name *</label>
                <input type="text" id="reg-org" class="form-input" placeholder="e.g. Acme Tech Ltd" required />
              </div>

              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Compliance Role *</label>
                <select id="reg-role" class="form-input">
                  <option value="admin">👔 VP Finance / Admin</option>
                  <option value="finance">💼 Senior Tax Accountant</option>
                  <option value="legal">⚖️ Company Secretary / Legal</option>
                  <option value="auditor">🔍 Statutory Auditor</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Work Email</label>
                <input type="email" id="reg-email" class="form-input" placeholder="john@company.com" />
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Password *</label>
                  <span id="btn-toggle-pwd-reg" style="font-size: 11px; color: var(--accent-primary); cursor: pointer; font-weight: 600;">👁️ Show</span>
                </div>
                <input type="password" id="reg-password" class="form-input" placeholder="Create password" required />
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <button type="submit" class="btn-primary" style="padding: 10px 26px; font-size: 14px;">
                <span>✨</span> Create Profile & Synchronize Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindModalEvents(modal);
  }

  bindModalEvents(modal) {
    const closeBtn = modal.querySelector('#btn-close-auth');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeAuthModal());

    const tabSignIn = modal.querySelector('#tab-btn-signin');
    const tabRegister = modal.querySelector('#tab-btn-register');

    if (tabSignIn && tabRegister) {
      tabSignIn.addEventListener('click', () => {
        this.activeAuthTab = 'signin';
        this.renderModalContent(modal);
      });
      tabRegister.addEventListener('click', () => {
        this.activeAuthTab = 'register';
        this.renderModalContent(modal);
      });
    }

    // Toggle password visibility (Login)
    const togglePwdLogin = modal.querySelector('#btn-toggle-pwd-login');
    const pwdLoginInput = modal.querySelector('#auth-password');
    if (togglePwdLogin && pwdLoginInput) {
      togglePwdLogin.addEventListener('click', () => {
        if (pwdLoginInput.type === 'password') {
          pwdLoginInput.type = 'text';
          togglePwdLogin.textContent = '🙈 Hide Password';
        } else {
          pwdLoginInput.type = 'password';
          togglePwdLogin.textContent = '👁️ Show Password';
        }
      });
    }

    // Toggle password visibility (Register)
    const togglePwdReg = modal.querySelector('#btn-toggle-pwd-reg');
    const pwdRegInput = modal.querySelector('#reg-password');
    if (togglePwdReg && pwdRegInput) {
      togglePwdReg.addEventListener('click', () => {
        if (pwdRegInput.type === 'password') {
          pwdRegInput.type = 'text';
          togglePwdReg.textContent = '🙈 Hide';
        } else {
          pwdRegInput.type = 'password';
          togglePwdReg.textContent = '👁️ Show';
        }
      });
    }

    const signOutBtn = modal.querySelector('#btn-auth-signout');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        this.saveUser(null);
        this.closeAuthModal();
        alert("Signed out successfully.");
      });
    }

    const loginForm = modal.querySelector('#auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = modal.querySelector('#auth-username').value.trim();
        const p = modal.querySelector('#auth-password').value.trim();
        await this.performLogin(u, p);
      });
    }

    const regForm = modal.querySelector('#auth-register-form');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = modal.querySelector('#reg-fullname').value.trim();
        const username = modal.querySelector('#reg-username').value.trim();
        const email = modal.querySelector('#reg-email').value.trim();
        const role = modal.querySelector('#reg-role').value;
        const password = modal.querySelector('#reg-password').value.trim();
        const organization = modal.querySelector('#reg-org').value.trim() || 'Custom Enterprise';

        await this.performRegistration({ full_name, username, email, role, password, organization });
      });
    }

    const quickBtns = modal.querySelectorAll('.role-quick-login');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        const roleUsers = {
          admin: { id: "USR-001", username: "vighnesh", email: "vighnesh@duewise.local", full_name: "Vighnesh", role: "admin", organization: "Vighnesh’s Workspace", avatar: "👔" },
          finance: { id: "USR-002", username: "tax_lead", email: "priya.sharma@apexfintech.com", full_name: "Priya Sharma", role: "finance", organization: "Apex FinTech Solutions Pvt Ltd", avatar: "💼" },
          legal: { id: "USR-003", username: "legal_counsel", email: "sunita.k@apexfintech.com", full_name: "Adv. Sunita Kulkarni", role: "legal", organization: "Apex FinTech Solutions Pvt Ltd", avatar: "⚖️" },
          auditor: { id: "USR-004", username: "statutory_auditor", email: "auditor@deloitte.com", full_name: "Karthik Menon (CPA)", role: "auditor", organization: "Deloitte Touche LLP", avatar: "🔍" }
        };
        if (roleUsers[role]) {
          this.saveUser(roleUsers[role]);
          this.closeAuthModal();
          alert(`✅ Logged in as ${roleUsers[role].full_name} (${roleUsers[role].organization})`);
        }
      });
    });
  }

  async performLogin(username, password) {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      if (resp.ok && data.user) {
        this.saveUser(data.user);
        this.closeAuthModal();
        alert(`✅ Welcome back, ${data.user.full_name}!\n\nActive Organization: ${data.user.organization}`);
      } else {
        alert(data.error || "Invalid login credentials. Please check your password or create a new account.");
      }
    } catch (e) {
      const user = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        username: username,
        email: `${username}@compliance.corp`,
        full_name: username,
        role: "admin",
        organization: "Apex FinTech Solutions Pvt Ltd",
        avatar: "👔"
      };
      this.saveUser(user);
      this.closeAuthModal();
      alert(`✅ Logged in as ${user.full_name}`);
    }
  }

  async performRegistration(payload) {
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (resp.ok && data.user) {
        this.saveUser(data.user);
        this.closeAuthModal();
        alert(`🎉 Account & Organization Successfully Created!\n\nWelcome, ${data.user.full_name} (@${data.user.username})\nOrganization: ${data.user.organization}\nRole: ${data.user.role.toUpperCase()}\n\nSaved to SQLite database: compliance.db`);
      } else {
        alert(data.error || "Registration failed. Please verify your details.");
      }
    } catch (e) {
      const user = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        username: payload.username,
        email: payload.email || `${payload.username}@compliance.corp`,
        full_name: payload.full_name,
        role: payload.role || "admin",
        organization: payload.organization || "Custom Enterprise",
        avatar: payload.role === 'admin' ? "👔" : payload.role === 'finance' ? "💼" : payload.role === 'legal' ? "⚖️" : "🔍"
      };
      this.saveUser(user);
      this.closeAuthModal();
      alert(`🎉 Account Created!\n\nWelcome, ${user.full_name} (${user.organization})!`);
    }
  }

  openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      this.renderModalContent(modal);
      modal.classList.add('open');
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
  }
}
