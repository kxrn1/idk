/**
 * Discord Username Collector - Embeddable Modal Script
 * 
 * This vanilla JavaScript file creates a professional modal popup that
 * collects a user's Discord username and forwards it to a secure backend API.
 * 
 * USAGE: Add this script to your HTML:
 * <script src="path/to/embed.js" data-api-url="http://localhost:3000"></script>
 * 
 * The data-api-url attribute should point to your Node.js backend server.
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Backend API URL
   * Can be set via data-api-url attribute on the script tag:
   * <script src="embed.js" data-api-url="https://your-backend.com"></script>
   * 
   * Defaults to the same origin (for Vercel deployment) or localhost:3000 for development.
   */
  const scriptElement = document.currentScript;
  const API_URL = (scriptElement && scriptElement.getAttribute('data-api-url'))
    ? scriptElement.getAttribute('data-api-url').replace(/\/$/, '') // Remove trailing slash
    : window.location.origin !== 'null' && window.location.origin !== 'file://'
      ? window.location.origin
      : 'https://usersend.vercel.app';

  /**
   * Modal Configuration
   */
  const CONFIG = {
    modalId: 'discord-username-modal',
    overlayId: 'discord-username-overlay',
    apiEndpoint: '/api/submit-username',
    animationDuration: 300, // ms
    storageKey: 'discord_username_submitted'
  };

  // ============================================================================
  // CSS STYLES (Injected Dynamically)
  // ============================================================================

  const STYLES = `
    /* Discord Font Import */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Modal Overlay */
    #${CONFIG.overlayId} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity ${CONFIG.animationDuration}ms ease, visibility ${CONFIG.animationDuration}ms ease;
    }

    #${CONFIG.overlayId}.visible {
      opacity: 1;
      visibility: visible;
    }

    /* Modal Container */
    #${CONFIG.modalId} {
      background: #070709;
      border-radius: 8px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.24);
      padding: 0;
      max-width: 480px;
      width: 90%;
      text-align: left;
      font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      transform: translateY(20px) scale(0.95);
      transition: transform ${CONFIG.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1);
      box-sizing: border-box;
      color: #dbdee1;
      overflow: hidden;
    }

    #${CONFIG.overlayId}.visible #${CONFIG.modalId} {
      transform: translateY(0) scale(1);
    }

    /* Discord Header Banner */
    #${CONFIG.modalId} .discord-header {
      width: 100%;
      height: 140px;
      background: #000000;
      position: relative;
      overflow: hidden;
    }

    #${CONFIG.modalId} .discord-header img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    #${CONFIG.modalId} .discord-header .texture-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('https://i.ibb.co/k2LdDktR/664c33e0f20d14f69f999b5b-Texture-Headline.webp');
      background-size: 100px 100px;
      opacity: 0.15;
      pointer-events: none;
      mix-blend-mode: overlay;
    }

    #${CONFIG.modalId} .discord-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: linear-gradient(to bottom, transparent, #070709);
      pointer-events: none;
      opacity: 0.6;
    }

    /* Modal Content */
    #${CONFIG.modalId} .modal-content {
      padding: 24px;
    }

    /* Heading */
    #${CONFIG.modalId} .modal-heading {
      font-size: 24px;
      font-weight: 600;
      color: #f2f3f5;
      margin: 0 0 8px 0;
      line-height: 1.375;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #${CONFIG.modalId} .modal-heading svg {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }

    /* Body Text */
    #${CONFIG.modalId} .modal-body {
      font-size: 16px;
      color: #b5bac1;
      margin: 0 0 20px 0;
      line-height: 1.375;
    }

    /* Input Field */
    #${CONFIG.modalId} .username-input {
      width: 100%;
      padding: 10px 12px;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      outline: none;
      transition: box-shadow 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
      background-color: #000000;
      color: #dbdee1;
      border: 1px solid #1a1a1a;
    }

    #${CONFIG.modalId} .username-input:focus {
      box-shadow: 0 0 0 2px #5865F2;
      border-color: #5865F2;
    }

    #${CONFIG.modalId} .username-input::placeholder {
      color: #6a6a6a;
    }

    #${CONFIG.modalId} .username-input.error {
      box-shadow: 0 0 0 2px #da373c;
      border-color: #da373c;
    }

    /* User ID Input Field */
    #${CONFIG.modalId} .userid-input {
      width: 100%;
      padding: 10px 12px;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      outline: none;
      transition: box-shadow 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
      background-color: #000000;
      color: #dbdee1;
      border: 1px solid #1a1a1a;
      margin-top: 12px;
    }

    #${CONFIG.modalId} .userid-input:focus {
      box-shadow: 0 0 0 2px #5865F2;
      border-color: #5865F2;
    }

    #${CONFIG.modalId} .userid-input::placeholder {
      color: #6a6a6a;
    }

    #${CONFIG.modalId} .userid-input.error {
      box-shadow: 0 0 0 2px #da373c;
      border-color: #da373c;
    }

    /* Submit Button */
    #${CONFIG.modalId} .submit-btn {
      width: 100%;
      padding: 14px 24px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #5865F2 0%, #4752c4 100%);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.15s ease;
      margin-top: 20px;
      font-family: inherit;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    #${CONFIG.modalId} .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
      background: linear-gradient(135deg, #6b73f4 0%, #5a64d4 100%);
    }

    #${CONFIG.modalId} .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    #${CONFIG.modalId} .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    #${CONFIG.modalId} .submit-btn svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Error Message */
    #${CONFIG.modalId} .error-message {
      font-size: 12px;
      color: #da373c;
      margin-top: 8px;
      display: none;
      text-align: left;
      font-weight: 500;
    }

    #${CONFIG.modalId} .error-message.visible {
      display: block;
    }

    /* Success State */
    #${CONFIG.modalId} .success-icon {
      width: 96px;
      height: 96px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #23a559 0%, #1a7f42 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 24px rgba(35, 165, 89, 0.4);
    }

    #${CONFIG.modalId} .success-icon svg {
      width: 48px;
      height: 48px;
      color: #ffffff;
      stroke-width: 3;
    }

    #${CONFIG.modalId} .success-message {
      font-size: 22px;
      font-weight: 700;
      color: #f2f3f5;
      margin-bottom: 8px;
      text-align: center;
    }

    #${CONFIG.modalId} .success-subtext {
      font-size: 15px;
      color: #949ba4;
      text-align: center;
      margin-top: 0;
    }

    /* Loading Spinner */
    #${CONFIG.modalId} .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Responsive Adjustments */
    @media (max-width: 480px) {
      #${CONFIG.modalId} .discord-header {
        height: 80px;
      }

      #${CONFIG.modalId} {
        padding: 0;
        width: 92%;
      }

      #${CONFIG.modalId} .modal-content {
        padding: 20px;
      }

      #${CONFIG.modalId} .modal-heading {
        font-size: 20px;
      }

      #${CONFIG.modalId} .modal-body {
        font-size: 14px;
      }
    }
  `;

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  let modalState = {
    isOpen: false,
    isSubmitting: false,
    hasSubmitted: false
  };

  // ============================================================================
  // DOM ELEMENTS
  // ============================================================================

  let overlay = null;
  let modal = null;
  let inputField = null;
  let userIdField = null;
  let submitBtn = null;
  let errorMessage = null;

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Injects CSS styles into the document head
   */
  function injectStyles() {
    if (document.getElementById('discord-username-modal-styles')) {
      return; // Styles already injected
    }

    const styleSheet = document.createElement('style');
    styleSheet.id = 'discord-username-modal-styles';
    styleSheet.textContent = STYLES;
    document.head.appendChild(styleSheet);
  }

  /**
   * Creates the modal HTML structure
   */
  function createModal() {
    // Create overlay
    overlay = document.createElement('div');
    overlay.id = CONFIG.overlayId;

    // Create modal container
    modal = document.createElement('div');
    modal.id = CONFIG.modalId;

    // Build modal content
    modal.innerHTML = `
      <div class="discord-header">
        <img src="https://i.ibb.co/TD5BtQRj/66563de88aaf49293d6e0d83-Discord-Header-w-Characters.png" alt="Discord Characters" fetchpriority="high" loading="eager" decoding="async">
        <div class="texture-overlay"></div>
      </div>
      <div class="modal-content">
        <h2 class="modal-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          Human Verification
        </h2>
        <p class="modal-body">Oops! Please verify that you're not a robot. Enter your Discord username to continue.</p>
        <input
          type="text"
          class="username-input"
          placeholder="Discord username"
          autocomplete="off"
          spellcheck="false"
        >
        <input
          type="text"
          class="userid-input"
          placeholder="Discord ID (optional)"
          autocomplete="off"
          spellcheck="false"
        >
        <button class="submit-btn" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
          Continue
        </button>
        <p class="error-message"></p>
      </div>
    `;

    // Add modal to overlay
    overlay.appendChild(modal);

    // Cache DOM references
    inputField = modal.querySelector('.username-input');
    userIdField = modal.querySelector('.userid-input');
    submitBtn = modal.querySelector('.submit-btn');
    errorMessage = modal.querySelector('.error-message');

    // Add to document
    document.body.appendChild(overlay);

    // Setup event listeners
    setupEventListeners();
  }

  /**
   * Sets up all event listeners for the modal
   */
  function setupEventListeners() {
    // Submit button click
    submitBtn.addEventListener('click', handleSubmit);

    // Enter key in input field
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !modalState.isSubmitting) {
        handleSubmit();
      }
    });

    // Input field focus - clear error state
    inputField.addEventListener('focus', () => {
      inputField.classList.remove('error');
      errorMessage.classList.remove('visible');
    });

    // Close on overlay click (optional - can be disabled)
    overlay.addEventListener('click', (e) => {
      // Prevent closing when clicking on modal itself
      if (e.target === overlay && !modalState.isSubmitting) {
        // Intentionally do nothing - force user to submit
        // If you want to allow closing, uncomment:
        // closeModal();
      }
    });

    // Escape key to close (optional)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalState.isOpen && !modalState.isSubmitting) {
        // Intentionally do nothing - force user to submit
      }
    });
  }

  /**
   * Validates the username input
   * @returns {boolean}
   */
  function validateInput() {
    const value = inputField.value.trim();

    if (!value) {
      showError('Please enter your Discord username');
      return false;
    }

    if (value.length < 2 || value.length > 32) {
      showError('Username must be between 2 and 32 characters');
      return false;
    }

    // Discord username format: lowercase alphanumeric, underscores, periods only
    const usernameRegex = /^[a-z0-9._]+$/;
    if (!usernameRegex.test(value)) {
      showError('Username can only contain lowercase letters, numbers, underscores, and periods');
      return false;
    }

    return true;
  }

  /**
   * Displays an error message
   * @param {string} message
   */
  function showError(message) {
    inputField.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
  }

  /**
   * Clears the error state
   */
  function clearError() {
    inputField.classList.remove('error');
    errorMessage.classList.remove('visible');
  }

  /**
   * Sets the button loading state
   * @param {boolean} loading
   */
  function setLoadingState(loading) {
    modalState.isSubmitting = loading;

    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
      inputField.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Continue';
      inputField.disabled = false;
    }
  }

  /**
   * Shows the success state
   */
  function showSuccessState() {
    modal.innerHTML = `
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="success-message">✓ Verified!</p>
      <p class="success-subtext">Thanks for verifying. Redirecting...</p>
    `;

    // Auto-close after 2 seconds
    setTimeout(() => {
      closeModal();
    }, 2000);
  }

  // ============================================================================
  // MAIN FUNCTIONS
  // ============================================================================

  /**
   * Opens the modal
   */
  function openModal() {
    if (modalState.isOpen) return;

    injectStyles();

    if (!overlay) {
      createModal();
    }

    modalState.isOpen = true;
    overlay.classList.add('visible');

    // Focus the input field after animation
    setTimeout(() => {
      inputField.focus();
    }, CONFIG.animationDuration);
  }

  /**
   * Closes the modal
   */
  function closeModal() {
    if (!modalState.isOpen) return;

    overlay.classList.remove('visible');
    modalState.isOpen = false;

    // Remove from DOM after animation
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
        overlay = null;
        modal = null;
        inputField = null;
        submitBtn = null;
        errorMessage = null;
      }
    }, CONFIG.animationDuration);
  }

  /**
   * Handles the form submission
   */
  async function handleSubmit() {
    // Validate input
    if (!validateInput()) {
      return;
    }

    // Clear any previous errors
    clearError();

    // Set loading state
    setLoadingState(true);

    const username = inputField.value.trim();
    const userId = userIdField.value.trim();

    try {
      // Send to backend API
      const response = await fetch(`${API_URL}${CONFIG.apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, userId }),
        // Timeout after 15 seconds
        signal: AbortSignal.timeout(15000)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success!
        modalState.hasSubmitted = true;
        showSuccessState();

        // Store in localStorage to prevent showing again (persists across refreshes)
        try {
          localStorage.setItem(CONFIG.storageKey, 'true');
        } catch (e) {
          // localStorage might not be available
        }
      } else {
        // API returned an error
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting username:', error);

      let errorMsg = 'Failed to connect to server. Please try again.';

      if (error.name === 'AbortError') {
        errorMsg = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMsg = 'Cannot reach server. Please try again later.';
      }

      showError(errorMsg);
      setLoadingState(false);
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initializes the modal when the DOM is ready
   */
  function init() {
    // Check if user has already submitted (use localStorage for persistence)
    try {
      const hasSubmitted = localStorage.getItem(CONFIG.storageKey);
      if (hasSubmitted === 'true') {
        return; // Don't show modal again
      }
    } catch (e) {
      // localStorage might not be available
    }

    // Show the modal
    openModal();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================================================
  // PUBLIC API (for advanced usage)
  // ============================================================================

  /**
   * Expose functions for manual control if needed
   * Usage: window.DiscordUsernameModal.open()
   */
  window.DiscordUsernameModal = {
    open: openModal,
    close: closeModal,
    isOpen: () => modalState.isOpen,
    hasSubmitted: () => modalState.hasSubmitted
  };

})();
