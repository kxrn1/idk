
// XSS Prevention - Sanitize user input
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate URL
function isValidImageUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }
        // Allow common image hosting services
        const allowedHosts = [
            'i.imgur.com', 'imgur.com', 'images.unsplash.com', 'unsplash.com',
            'picsum.photos', 'cdn.pixabay.com', 'pixabay.com',
            'images.pexels.com', 'pexels.com', 'media.discordapp.net', 'ibb.co', 'imgbb.com', 'discord.com', 'raw.githubusercontent.com'
        ];
        const isAllowedHost = allowedHosts.some(host => parsed.hostname.includes(host));
        const isImageExt = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(parsed.pathname);
        return isAllowedHost || isImageExt;
    } catch (_) {
        return false;
    }
}

// Validate URL format
function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Validate date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Icon definitions
const icons = {
    "lock": `<path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/><path d="M12 16v4"/><path d="M12 12a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v2a4 4 0 0 1-4 4z"/>`,
    "credit-card": `<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>`,
    "bar-chart": `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
    "bell": `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
    "cloud": `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>`,
    "search": `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    "arrow-right": `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
    "external-link": `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
    "calendar": `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    "user": `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    "message": `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    "code": `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
    "cpu": `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>`,
    "wifi": `<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`,
    "users": `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`
};

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Fetch APIs from JSONBin via serverless function
async function fetchApis() {
    try {
        const response = await fetch('/api/bin', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch APIs');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format from server');
        }
        return data;
    } catch (error) {
        console.error('Error fetching APIs:', error);
        throw new Error('Unable to load APIs. Please try again later.');
    }
}

// Submit new API to JSONBin via serverless function
async function submitApi(apiData) {
    try {
        const response = await fetch('/api/bin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit API');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting API:', error);
        throw error;
    }
}

// Create API card HTML
function createApiCard(api, index) {
    const card = document.createElement('article');
    card.className = 'api-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="card-thumbnail">
            <img src="${sanitizeInput(api.thumbnail)}" alt="${sanitizeInput(api.title)} thumbnail" loading="lazy" onerror="this.src='https://picsum.photos/seed/api/400/225'">
            <div class="thumbnail-overlay"></div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons[api.icon] || icons['search']}
                    </svg>
                </div>
                <div class="card-title-group">
                    <h3 class="card-title">${sanitizeInput(api.title)}</h3>
                </div>
            </div>
            <p class="card-description">${sanitizeInput(api.description)}</p>
            <div class="card-meta">
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons.calendar}
                    </svg>
                    <span class="label">${formatDate(api.publishedDate)}</span>
                </div>
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons.user}
                    </svg>
                    <span class="label">${sanitizeInput(api.author)}</span>
                </div>
            </div>
            <div class="card-footer">
                <a href="${sanitizeInput(api.endpoint)}" class="btn btn-primary">
                    <span>View API</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons['arrow-right']}
                    </svg>
                </a>
                <button class="btn btn-secondary" aria-label="Open website" onclick="window.open('${sanitizeInput(api.website || api.endpoint)}', '_blank')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons['external-link']}
                    </svg>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Custom Select Dropdown
function initCustomSelect() {
    const customSelect = document.getElementById('categorySelect');
    const hiddenInput = document.getElementById('apiCategory');
    if (!customSelect) return;

    const display = customSelect.querySelector('.select-display');
    const valueSpan = display.querySelector('.select-value');
    const options = customSelect.querySelectorAll('.select-option');

    display.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = display.classList.contains('open');

        // Close all other selects
        document.querySelectorAll('.custom-select .select-display.open').forEach(el => {
            el.classList.remove('open');
            el.closest('.custom-select').querySelector('.select-options').classList.remove('open');
        });

        if (!isOpen) {
            display.classList.add('open');
            customSelect.querySelector('.select-options').classList.add('open');
            customSelect.classList.add('open');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.dataset.value;
            const label = option.querySelector('span').textContent;

            hiddenInput.value = value;
            valueSpan.textContent = label;
            display.classList.remove('placeholder');

            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            display.classList.remove('open');
            customSelect.querySelector('.select-options').classList.remove('open');
            customSelect.classList.remove('open');

            // Clear error
            customSelect.classList.remove('error');
            document.getElementById('categoryError').textContent = '';
        });
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
        display.classList.remove('open');
        customSelect.querySelector('.select-options').classList.remove('open');
        customSelect.classList.remove('open');
    });
}

// Character counter for textarea
function initCharCounter() {
    const textarea = document.getElementById('apiDescription');
    const countSpan = document.getElementById('descCount');
    if (!textarea || !countSpan) return;

    textarea.addEventListener('input', () => {
        countSpan.textContent = textarea.value.length;
    });
}

// Search functionality
function searchAPIs(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        return [];
    }
    
    return apiData.filter(api => {
        return api.title.toLowerCase().includes(searchTerm) ||
               api.description.toLowerCase().includes(searchTerm) ||
               api.author.toLowerCase().includes(searchTerm);
    });
}

function renderSearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Start typing to search APIs...</p>';
        return;
    }
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <p class="search-no-results">
                No APIs found for "<strong>${escapeHtml(query)}</strong>"
            </p>`;
        return;
    }
    
    searchResults.innerHTML = `
        <p class="search-count">${results.length} API${results.length !== 1 ? 's' : ''} found</p>
        <div class="api-grid" id="searchGrid"></div>
    `;
    
    const searchGrid = document.getElementById('searchGrid');
    results.forEach((api, index) => {
        const card = createApiCard(api, index);
        searchGrid.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = searchAPIs(query);
        renderSearchResults(results, query);
        
        if (searchClear) {
            searchClear.classList.toggle('visible', query.length > 0);
        }
    });
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            renderSearchResults([], '');
            searchClear.classList.remove('visible');
        });
    }
    
    // Initial render
    renderSearchResults([], '');
}

// Publish form validation and submission
function initPublishForm() {
    const form = document.getElementById('publishForm');

    if (!form) return;

    // Initialize custom components
    initCustomSelect();
    initCharCounter();

    // Set default date to today
    const dateInput = document.getElementById('apiDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Step wizard
    let currentStep = 1;
    const totalSteps = 3;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    function updateSteps() {
        // Update form steps visibility
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });

        // Update progress indicators
        document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
            }
        });

        // Update buttons
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
        submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    nextBtn.addEventListener('click', () => {
        // Validate current step fields
        let isValid = true;
        if (currentStep === 1) {
            isValid = validateField(document.getElementById('apiName')) &&
                      validateField(document.getElementById('apiDescription'));
        } else if (currentStep === 2) {
            isValid = validateField(document.getElementById('apiImage'));
            const categoryInput = document.getElementById('apiCategory');
            const categorySelect = document.getElementById('categorySelect');
            if (!categoryInput.value) {
                categorySelect.classList.add('error');
                document.getElementById('categoryError').textContent = 'Please select a category';
                isValid = false;
            }
        }

        if (isValid && currentStep < totalSteps) {
            currentStep++;
            updateSteps();
        }
    });

    // Real-time validation
    const nameInput = document.getElementById('apiName');
    const descInput = document.getElementById('apiDescription');
    const imageInput = document.getElementById('apiImage');
    const authorInput = document.getElementById('apiAuthor');
    const endpointInput = document.getElementById('apiEndpoint');
    const websiteInput = document.getElementById('apiWebsite');

    [nameInput, descInput, imageInput, authorInput, endpointInput, websiteInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput);
        const isDescValid = validateField(descInput);
        const isImageValid = validateField(imageInput);
        const isDateValid = validateField(dateInput);
        const isAuthorValid = validateField(authorInput);
        const isEndpointValid = validateField(endpointInput);
        const isWebsiteValid = validateField(websiteInput);

        // Validate category
        const categoryInput = document.getElementById('apiCategory');
        const categorySelect = document.getElementById('categorySelect');
        const isCategoryValid = categoryInput.value !== '';
        if (!isCategoryValid) {
            categorySelect.classList.add('error');
            document.getElementById('categoryError').textContent = 'Please select a category';
        } else {
            categorySelect.classList.remove('error');
            document.getElementById('categoryError').textContent = '';
        }

        if (!isNameValid || !isDescValid || !isImageValid || !isDateValid || !isAuthorValid || !isEndpointValid || !isWebsiteValid || !isCategoryValid) {
            showModal('error', 'Validation Error', 'Please fix the errors in the form.');
            return;
        }

        // Show loading modal
        showModal('loading');
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;

        // Map category to icon
        const iconMap = {
            'authentication': 'lock',
            'data': 'bar-chart',
            'media': 'cloud',
            'communication': 'message',
            'payment': 'credit-card',
            'developer': 'code',
            'ai': 'cpu',
            'iot': 'wifi',
            'social': 'users'
        };

        const newApi = {
            id: Date.now(),
            title: sanitizeInput(nameInput.value.trim()),
            description: sanitizeInput(descInput.value.trim()),
            thumbnail: sanitizeInput(imageInput.value.trim()),
            category: sanitizeInput(categoryInput.value),
            publishedDate: sanitizeInput(dateInput.value),
            author: sanitizeInput(authorInput.value.trim()),
            endpoint: sanitizeInput(endpointInput.value.trim()) || '/api/' + nameInput.value.toLowerCase().replace(/\s+/g, '-'),
            website: websiteInput.value.trim() || null,
            icon: iconMap[categoryInput.value] || 'search'
        };

        try {
            await submitApi(newApi);

            showModal('success', 'API Published!', 'Your API has been successfully published and will appear on the homepage shortly.');

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            showModal('error', 'Publish Failed', error.message || 'Failed to publish API. Please try again.');
            submitBtn.disabled = false;
        }
    });

    // Initialize step wizard
    updateSteps();
}

function validateField(input) {
    if (!input) return true;
    
    const errorSpan = document.getElementById(input.id.replace('api', '').toLowerCase() + 'Error');
    let isValid = true;
    let errorMessage = '';

    switch (input.id) {
        case 'apiName':
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'API name is required';
            } else if (input.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'apiDescription':
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'Description is required';
            } else if (input.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Description must be at least 10 characters';
            }
            break;
            
        case 'apiImage':
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'Image URL is required';
            } else if (!isValidImageUrl(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid image URL (Imgur, Unsplash, etc.)';
            }
            break;
            
        case 'apiDate':
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'Date is required';
            } else if (!isValidDate(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid date (YYYY-MM-DD)';
            }
            break;
            
        case 'apiAuthor':
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'Author name is required';
            } else if (input.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Author name must be at least 2 characters';
            }
            break;
            
        case 'apiEndpoint':
            if (input.value.trim() && !input.value.trim().startsWith('/')) {
                isValid = false;
                errorMessage = 'Endpoint should start with /';
            }
            break;

        case 'apiWebsite':
            if (input.value.trim() && !isValidUrl(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid URL (https://...)';
            }
            break;
    }

    if (!isValid) {
        input.classList.add('error');
        if (errorSpan) errorSpan.textContent = errorMessage;
    } else {
        input.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    }

    return isValid;
}

// Modal functions
function showModal(type, title = '', message = '') {
    const modal = document.getElementById('publishModal');
    const spinner = document.getElementById('modalSpinner');
    const content = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (!modal) return;

    modal.style.display = 'flex';

    if (type === 'loading') {
        spinner.style.display = 'block';
        content.style.display = 'none';
    } else {
        spinner.style.display = 'none';
        content.style.display = 'block';

        // Set icon based on type
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        };

        modalIcon.innerHTML = icons[type] || '';
        modalIcon.className = `modal-icon modal-${type}`;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
    }
}

function hideModal() {
    const modal = document.getElementById('publishModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize modal close button
function initModal() {
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('publishModal');

    if (modalClose && modal) {
        modalClose.addEventListener('click', hideModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
}

// Global API data variable
let apiData = [];
let currentCategory = 'all';

// Render API grid
function renderApiGrid(apis) {
    const apiGrid = document.getElementById('apiGrid');
    if (!apiGrid) return;

    apiGrid.innerHTML = '';

    const filteredApis = currentCategory === 'all'
        ? apis
        : apis.filter(api => api.category === currentCategory);

    if (filteredApis.length === 0) {
        apiGrid.innerHTML = `
            <div class="no-apis">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>No APIs found in this category</p>
            </div>
        `;
        return;
    }

    filteredApis.forEach((api, index) => {
        const card = createApiCard(api, index);
        apiGrid.appendChild(card);
    });
}

// Initialize category tabs
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderApiGrid(apiData);
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const apiGrid = document.getElementById('apiGrid');

    // Initialize search if on search page
    initSearch();

    // Initialize publish form if on publish page
    initPublishForm();

    // Initialize modal
    initModal();

    // Initialize category tabs
    initCategoryTabs();

    // Initialize profile page
    initProfilePage();

    // Fetch and render APIs on home page
    if (apiGrid) {
        try {
            apiData = await fetchApis();
            renderApiGrid(apiData);
        } catch (error) {
            apiGrid.innerHTML = `
                <div class="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>${error.message || 'Unable to load APIs. Please try again later.'}</p>
                </div>
            `;
        }
    }

    // Fallback: ensure content is visible even if animations fail
    setTimeout(() => {
        document.querySelectorAll('.hero, .api-card').forEach(el => {
            if (window.getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, 1000);

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.api-card').forEach(card => {
        observer.observe(card);
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Check for reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Disable animations if reduced motion is preferred
if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    document.documentElement.style.setProperty('--transition-bounce', '0ms');
}

// Listen for changes to motion preference
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
        document.documentElement.style.setProperty('--transition-bounce', '0ms');
    } else {
        document.documentElement.style.setProperty('--transition-fast', '150ms');
        document.documentElement.style.setProperty('--transition-base', '250ms');
        document.documentElement.style.setProperty('--transition-slow', '400ms');
        document.documentElement.style.setProperty('--transition-bounce', '500ms');
    }
});

// Delete API function
async function deleteApi(apiId) {
    try {
        const response = await fetch('/api/bin', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: apiId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete API');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting API:', error);
        throw error;
    }
}

// Profile page functionality
let apiToDelete = null;

function initProfilePage() {
    const profileGrid = document.getElementById('profileGrid');
    const authorSearch = document.getElementById('authorSearch');
    const searchAuthorBtn = document.getElementById('searchAuthorBtn');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const resultModal = document.getElementById('resultModal');
    const resultClose = document.getElementById('resultClose');

    if (!profileGrid || !authorSearch) return;

    // Search for author's APIs
    searchAuthorBtn.addEventListener('click', () => {
        const authorName = authorSearch.value.trim();
        if (!authorName) {
            showResultModal('error', 'Error', 'Please enter your author name');
            return;
        }

        const userApis = apiData.filter(api => 
            api.author.toLowerCase() === authorName.toLowerCase()
        );

        if (userApis.length === 0) {
            profileGrid.innerHTML = `
                <div class="no-apis">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>No APIs found for "${escapeHtml(authorName)}"</p>
                </div>
            `;
            return;
        }

        profileGrid.innerHTML = '';
        userApis.forEach((api, index) => {
            const card = createApiCard(api, index, true);
            profileGrid.appendChild(card);
        });
    });

    // Delete modal handlers
    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
            apiToDelete = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!apiToDelete) return;

            try {
                await deleteApi(apiToDelete);
                deleteModal.style.display = 'none';
                
                // Remove from local array
                apiData = apiData.filter(api => api.id !== apiToDelete);
                
                // Re-render profile grid
                const authorName = authorSearch.value.trim();
                const userApis = apiData.filter(api => 
                    api.author.toLowerCase() === authorName.toLowerCase()
                );
                
                profileGrid.innerHTML = '';
                if (userApis.length === 0) {
                    profileGrid.innerHTML = `
                        <div class="no-apis">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p>No APIs found</p>
                        </div>
                    `;
                } else {
                    userApis.forEach((api, index) => {
                        const card = createApiCard(api, index, true);
                        profileGrid.appendChild(card);
                    });
                }

                showResultModal('success', 'Deleted!', 'Your API has been deleted successfully.');
                apiToDelete = null;
            } catch (error) {
                showResultModal('error', 'Delete Failed', error.message || 'Failed to delete API.');
            }
        });
    }

    if (resultClose && resultModal) {
        resultClose.addEventListener('click', () => {
            resultModal.style.display = 'none';
        });
        resultModal.addEventListener('click', (e) => {
            if (e.target === resultModal) {
                resultModal.style.display = 'none';
            }
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
                apiToDelete = null;
            }
        });
    }
}

function showDeleteModal(apiId, apiTitle) {
    const deleteModal = document.getElementById('deleteModal');
    const deleteMessage = document.getElementById('deleteMessage');
    
    if (!deleteModal) return;
    
    apiToDelete = apiId;
    if (deleteMessage) {
        deleteMessage.textContent = `Are you sure you want to delete "${apiTitle}"? This action cannot be undone.`;
    }
    deleteModal.style.display = 'flex';
}

function showResultModal(type, title, message) {
    const resultModal = document.getElementById('resultModal');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    if (!resultModal) return;

    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };

    if (resultIcon) resultIcon.innerHTML = icons[type] || '';
    if (resultIcon) resultIcon.className = `modal-icon modal-${type}`;
    if (resultTitle) resultTitle.textContent = title;
    if (resultMessage) resultMessage.textContent = message;

    resultModal.style.display = 'flex';
}

// Create API card with delete button for profile page
function createApiCard(api, index, isProfile = false) {
    const card = document.createElement('article');
    card.className = 'api-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const deleteButton = isProfile ? `
        <button class="btn btn-danger btn-delete" onclick="showDeleteModal(${api.id}, '${sanitizeInput(api.title).replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
            </svg>
            <span>Delete</span>
        </button>
    ` : '';

    card.innerHTML = `
        <div class="card-thumbnail">
            <img src="${sanitizeInput(api.thumbnail)}" alt="${sanitizeInput(api.title)} thumbnail" loading="lazy" onerror="this.src='https://picsum.photos/seed/api/400/225'">
            <div class="thumbnail-overlay"></div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons[api.icon] || icons['search']}
                    </svg>
                </div>
                <div class="card-title-group">
                    <h3 class="card-title">${sanitizeInput(api.title)}</h3>
                </div>
            </div>
            <p class="card-description">${sanitizeInput(api.description)}</p>
            <div class="card-meta">
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons.calendar}
                    </svg>
                    <span class="label">${formatDate(api.publishedDate)}</span>
                </div>
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons.user}
                    </svg>
                    <span class="label">${sanitizeInput(api.author)}</span>
                </div>
            </div>
            <div class="card-footer">
                <a href="${sanitizeInput(api.endpoint)}" class="btn btn-primary">
                    <span>View API</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons['arrow-right']}
                    </svg>
                </a>
                <button class="btn btn-secondary" aria-label="Open website" onclick="window.open('${sanitizeInput(api.website || api.endpoint)}', '_blank')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${icons['external-link']}
                    </svg>
                </button>
                ${deleteButton}
            </div>
        </div>
    `;

    return card;
}
