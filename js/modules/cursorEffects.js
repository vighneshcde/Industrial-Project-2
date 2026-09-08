// cursorEffects.js - Smooth Interactive Cursor Follower, Glow Pop-Up & Contextual Tooltip Micro-Animations

export class CursorEffectsManager {
  constructor() {
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.targetX = this.cursorX;
    this.targetY = this.cursorY;
    this.isHoveringInteractive = false;
    this.activeTooltipText = null;

    this.initElements();
    this.bindEvents();
    this.animate();
  }

  initElements() {
    // 1. Ambient Glow Follower
    this.glowOrb = document.createElement('div');
    this.glowOrb.id = 'cursor-glow-follower';
    document.body.appendChild(this.glowOrb);

    // 2. Precision Center Dot
    this.cursorDot = document.createElement('div');
    this.cursorDot.id = 'cursor-dot';
    document.body.appendChild(this.cursorDot);

    // 3. Dynamic Contextual Smart Pop-Up Tooltip
    this.popupTooltip = document.createElement('div');
    this.popupTooltip.id = 'cursor-popup-tooltip';
    this.popupTooltip.innerHTML = `<span class="popup-icon">⚡</span> <span class="popup-text"></span>`;
    document.body.appendChild(this.popupTooltip);
  }

  bindEvents() {
    // Mouse movement tracking
    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;

      // Position center dot immediately
      if (this.cursorDot) {
        this.cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check for contextual statutory hints
      this.updateContextualTooltip(e.target);
    }, { passive: true });

    // Click pop-up ripple animation
    window.addEventListener('click', (e) => {
      this.createClickRipple(e.clientX, e.clientY);
    });

    // Detect interactive element hover
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('button, a, input, select, .card-panel, .tag-pill, .nav-item, .health-pill-widget, .doc-tab-btn, .pipeline-step-node, table tr');
      if (interactive) {
        this.isHoveringInteractive = true;
        this.glowOrb.classList.add('hovering');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const interactive = e.target.closest('button, a, input, select, .card-panel, .tag-pill, .nav-item, .health-pill-widget, .doc-tab-btn, .pipeline-step-node, table tr');
      if (interactive) {
        this.isHoveringInteractive = false;
        this.glowOrb.classList.remove('hovering');
        this.hideTooltip();
      }
    }, { passive: true });

    // Window blur / mouse leave
    document.addEventListener('mouseleave', () => {
      this.glowOrb.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
      this.hideTooltip();
    });

    document.addEventListener('mouseenter', () => {
      this.glowOrb.style.opacity = '1';
      this.cursorDot.style.opacity = '1';
    });
  }

  animate() {
    // Smooth lerp for outer ambient glow
    this.cursorX += (this.targetX - this.cursorX) * 0.18;
    this.cursorY += (this.targetY - this.cursorY) * 0.18;

    if (this.glowOrb) {
      this.glowOrb.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) translate(-50%, -50%)`;
    }

    // Position pop-up tooltip slightly offset from cursor
    if (this.popupTooltip && this.activeTooltipText) {
      const tooltipX = this.targetX + 16;
      const tooltipY = this.targetY - 28;
      this.popupTooltip.style.transform = `translate3d(${tooltipX}px, ${tooltipY}px, 0)`;
    }

    requestAnimationFrame(() => this.animate());
  }

  createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  updateContextualTooltip(target) {
    if (!target) return;

    let hint = null;
    let icon = "⚡";

    // 1. Payment Buttons / Cards
    if (target.closest('.btn-approve-pay')) {
      hint = "1-Click T-2 Pre-Due-Date Execution & SHA-256 Seal";
      icon = "💸";
    } else if (target.closest('.btn-reject-payment')) {
      hint = "Defer Payment to Re-Verify Invoice Figures";
      icon = "⏳";
    } else if (target.closest('#btn-review-selected')) {
      hint = "Batch Authorization of Selected Safe Payments";
      icon = "🛡️";
    }
    // 2. Health & Risk Scores
    else if (target.closest('.health-pill-widget') || target.closest('#header-health-score')) {
      hint = "Real-Time Compliance Solvency: Severity × Probability × Urgency";
      icon = "📊";
    }
    // 3. Digital Signatures / Seals
    else if (target.closest('.signature-pill') || (target.textContent && target.textContent.includes('SIG-SHA256'))) {
      hint = "Verifiable Cryptographic Digital Receipt Seal";
      icon = "🔐";
    }
    // 4. Statutory Authorities
    else if (target.textContent && (target.textContent.includes('GSTN') || target.textContent.includes('GSTR-3B'))) {
      hint = "GSTN Portal (gst.gov.in) · CGST Act 2017";
      icon = "🏛️";
    } else if (target.textContent && (target.textContent.includes('CBDT') || target.textContent.includes('TDS'))) {
      hint = "Income Tax Department (incometax.gov.in) · Sec 194J / 281";
      icon = "💼";
    } else if (target.textContent && (target.textContent.includes('MCA') || target.textContent.includes('AOC-4'))) {
      hint = "Ministry of Corporate Affairs (mca.gov.in) · Companies Act 2013";
      icon = "🏢";
    } else if (target.textContent && target.textContent.includes('EPFO')) {
      hint = "EPFO Unified Portal · EPF Scheme 1952";
      icon = "👥";
    }

    if (hint) {
      this.showTooltip(hint, icon);
    } else {
      this.hideTooltip();
    }
  }

  showTooltip(text, icon = "⚡") {
    if (!this.popupTooltip) return;
    this.activeTooltipText = text;
    this.popupTooltip.querySelector('.popup-icon').textContent = icon;
    this.popupTooltip.querySelector('.popup-text').textContent = text;
    this.popupTooltip.classList.add('visible');
  }

  hideTooltip() {
    if (!this.popupTooltip) return;
    this.activeTooltipText = null;
    this.popupTooltip.classList.remove('visible');
  }
}
