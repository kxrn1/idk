// API Showcase - Modern Black & White
const ADMIN_KEY = 'h[%B7aaG@Y2=L(#-7g^C}@qmq+|u`5X~RiRF3ATa8d_u$~FU};HUf_b@K>uP:/wK1(gzL/1(yCV8+_Jv7Sazl$D3_cF@57nuPqQ/w-OY(ma@[qYlfh:Ju)+ZeZ@sg(VA';

// Sanitize input
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
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
        const allowedHosts = ['i.imgur.com', 'imgur.com', 'images.unsplash.com', 'unsplash.com', 'picsum.photos', 'cdn.pixabay.com', 'pixabay.com', 'images.pexels.com', 'pexels.com', 'i.waifu.pics', 'waifu.pics'];
        const isAllowedHost = allowedHosts.some(host => parsed.hostname.includes(host));
        const isImageExt = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(parsed.pathname);
        return isAllowedHost || isImageExt;
    } catch (_) { return false; }
}

// Validate URL format
function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) { return false; }
}

// Validate date
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Icons
const icons = {
    lock: `<path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/><path d="M12 16v4"/><path d="M12 12a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v2a4 4 0 0 1-4 4z"/>`,
    "credit-card": `<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>`,
    "bar-chart": `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
    bell: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
    cloud: `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>`,
    search: `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    "arrow-right": `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
    "external-link": `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
    calendar: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    user: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    message: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    code: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
    cpu: `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>`,
    wifi: `<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`,
    users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`
};

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Fetch APIs
async function fetchApis() {
    const response = await fetch('/api/bin', { headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error('Failed to fetch APIs');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

// Submit API
async function submitApi(apiData) {
    const response = await fetch('/api/bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
        body: JSON.stringify(apiData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit API');
    }
    return await response.json();
}

// Delete API
async function deleteApi(apiId) {
    const response = await fetch('/api/bin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
        body: JSON.stringify({ id: apiId })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete API');
    }
    return await response.json();
}

// Create API Card
function createApiCard(api, index, isProfile = false) {
    const card = document.createElement('article');
    card.className = 'api-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const deleteButton = isProfile ? `
        <button class="btn btn-delete" onclick="showDeleteModal(${api.id}, '${sanitizeInput(api.title).replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            <span>Delete</span>
        </button>` : '';

    card.innerHTML = `
        <div class="card-thumbnail">
            <img src="${sanitizeInput(api.thumbnail)}" alt="${sanitizeInput(api.title)}" loading="lazy" onerror="this.src='https://picsum.photos/seed/api/400/225'">
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[api.icon] || icons.search}</svg>
                </div>
                <div class="card-title-group">
                    <h3 class="card-title">${sanitizeInput(api.title)}</h3>
                </div>
            </div>
            <p class="card-description">${sanitizeInput(api.description)}</p>
            <div class="card-meta">
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons.calendar}</svg>
                    <span class="label">${formatDate(api.publishedDate)}</span>
                </div>
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons.user}</svg>
                    <span class="label">${sanitizeInput(api.author)}</span>
                </div>
            </div>
            <div class="card-footer">
                <a href="${sanitizeInput(api.endpoint)}" class="btn btn-primary">
                    <span>View</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons['arrow-right']}</svg>
                </a>
                <button class="btn btn-secondary" onclick="window.open('${sanitizeInput(api.website || api.endpoint)}', '_blank')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons['external-link']}</svg>
                </button>
                ${deleteButton}
            </div>
        </div>
    `;
    return card;
}

// Render API Grid
let apiData = [];
let currentCategory = 'all';

function renderApiGrid(apis) {
    const apiGrid = document.getElementById('apiGrid');
    if (!apiGrid) return;

    const filteredApis = currentCategory === 'all' ? apis : apis.filter(api => api.category === currentCategory);

    if (filteredApis.length === 0) {
        apiGrid.innerHTML = `<div class="no-apis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No APIs found</p></div>`;
        return;
    }

    apiGrid.innerHTML = '';
    filteredApis.forEach((api, index) => apiGrid.appendChild(createApiCard(api, index)));
}

// Category Tabs
function initCategoryTabs() {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderApiGrid(apiData);
        });
    });
}

// Custom Select
function initCustomSelect() {
    const customSelect = document.getElementById('categorySelect');
    if (!customSelect) return;

    const display = customSelect.querySelector('.select-display');
    const hiddenInput = document.getElementById('apiCategory');
    const valueSpan = display.querySelector('.select-value');
    const options = customSelect.querySelectorAll('.select-option');

    display.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = display.classList.contains('open');
        document.querySelectorAll('.custom-select .select-display.open').forEach(el => {
            el.classList.remove('open');
            el.closest('.custom-select').querySelector('.select-options').classList.remove('open');
        });
        if (!isOpen) {
            display.classList.add('open');
            customSelect.querySelector('.select-options').classList.add('open');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            hiddenInput.value = option.dataset.value;
            valueSpan.textContent = option.querySelector('span').textContent;
            display.classList.remove('placeholder');
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            display.classList.remove('open');
            customSelect.querySelector('.select-options').classList.remove('open');
            customSelect.classList.remove('error');
            document.getElementById('categoryError').textContent = '';
        });
    });

    document.addEventListener('click', () => {
        display.classList.remove('open');
        customSelect.querySelector('.select-options').classList.remove('open');
    });
}

// Character Counter
function initCharCounter() {
    const textarea = document.getElementById('apiDescription');
    const countSpan = document.getElementById('descCount');
    if (!textarea || !countSpan) return;
    textarea.addEventListener('input', () => countSpan.textContent = textarea.value.length);
}

// Search
function searchAPIs(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];
    return apiData.filter(api => api.title.toLowerCase().includes(searchTerm) || api.description.toLowerCase().includes(searchTerm) || api.author.toLowerCase().includes(searchTerm));
}

function renderSearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Start typing to search...</p>';
        return;
    }

    if (results.length === 0) {
        searchResults.innerHTML = `<p class="search-no-results">No APIs found for "<strong>${escapeHtml(query)}</strong>"</p>`;
        return;
    }

    searchResults.innerHTML = `<p class="search-count">${results.length} API${results.length !== 1 ? 's' : ''} found</p><div class="api-grid" id="searchGrid"></div>`;
    const searchGrid = document.getElementById('searchGrid');
    results.forEach((api, index) => searchGrid.appendChild(createApiCard(api, index)));
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
        renderSearchResults(searchAPIs(query), query);
        if (searchClear) searchClear.classList.toggle('visible', query.length > 0);
    });

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            renderSearchResults([], '');
            searchClear.classList.remove('visible');
        });
    }
    renderSearchResults([], '');
}

// Validate Field
function validateField(input) {
    if (!input) return true;
    const errorSpan = document.getElementById(input.id.replace('api', '').toLowerCase() + 'Error');
    let isValid = true, errorMessage = '';

    switch (input.id) {
        case 'apiName':
            if (!input.value.trim()) { isValid = false; errorMessage = 'Name is required'; }
            else if (input.value.trim().length < 2) { isValid = false; errorMessage = 'Min 2 characters'; }
            break;
        case 'apiDescription':
            if (!input.value.trim()) { isValid = false; errorMessage = 'Description is required'; }
            else if (input.value.trim().length < 10) { isValid = false; errorMessage = 'Min 10 characters'; }
            break;
        case 'apiImage':
            if (!input.value.trim()) { isValid = false; errorMessage = 'Image URL is required'; }
            else if (!isValidImageUrl(input.value.trim())) { isValid = false; errorMessage = 'Invalid image URL'; }
            break;
        case 'apiDate':
            if (!input.value.trim()) { isValid = false; errorMessage = 'Date is required'; }
            else if (!isValidDate(input.value.trim())) { isValid = false; errorMessage = 'Use YYYY-MM-DD'; }
            break;
        case 'apiAuthor':
            if (!input.value.trim()) { isValid = false; errorMessage = 'Author is required'; }
            else if (input.value.trim().length < 2) { isValid = false; errorMessage = 'Min 2 characters'; }
            break;
        case 'apiEndpoint':
            if (input.value.trim() && !input.value.trim().startsWith('/')) { isValid = false; errorMessage = 'Start with /'; }
            break;
        case 'apiWebsite':
            if (input.value.trim() && !isValidUrl(input.value.trim())) { isValid = false; errorMessage = 'Invalid URL'; }
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

// Modal
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
        spinner.style.display = 'flex';
        content.style.display = 'none';
    } else {
        spinner.style.display = 'none';
        content.style.display = 'flex';
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
    if (modal) modal.style.display = 'none';
}

function initModal() {
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('publishModal');
    if (modalClose && modal) {
        modalClose.addEventListener('click', hideModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    }
}

// Publish Form
function initPublishForm() {
    const form = document.getElementById('publishForm');
    if (!form) return;

    initCustomSelect();
    initCharCounter();

    const dateInput = document.getElementById('apiDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    let currentStep = 1;
    const totalSteps = 3;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    function updateSteps() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });
        document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < currentStep) step.classList.add('completed');
            else if (index + 1 === currentStep) step.classList.add('active');
        });
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
        submitBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
    }

    prevBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateSteps(); } });

    nextBtn.addEventListener('click', () => {
        let isValid = true;
        if (currentStep === 1) isValid = validateField(document.getElementById('apiName')) && validateField(document.getElementById('apiDescription'));
        else if (currentStep === 2) {
            isValid = validateField(document.getElementById('apiImage'));
            const categoryInput = document.getElementById('apiCategory');
            if (!categoryInput.value) {
                document.getElementById('categorySelect').classList.add('error');
                document.getElementById('categoryError').textContent = 'Select a category';
                isValid = false;
            }
        }
        if (isValid && currentStep < totalSteps) { currentStep++; updateSteps(); }
    });

    ['apiName', 'apiDescription', 'apiImage', 'apiAuthor', 'apiEndpoint', 'apiWebsite'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(input); });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fields = ['apiName', 'apiDescription', 'apiImage', 'apiDate', 'apiAuthor', 'apiEndpoint', 'apiWebsite'];
        const allValid = fields.every(id => validateField(document.getElementById(id)));
        const categoryInput = document.getElementById('apiCategory');
        const categoryValid = categoryInput.value !== '';

        if (!categoryValid) {
            document.getElementById('categorySelect').classList.add('error');
            document.getElementById('categoryError').textContent = 'Select a category';
        }

        if (!allValid || !categoryValid) {
            showModal('error', 'Validation Error', 'Please fix the errors.');
            return;
        }

        showModal('loading');
        submitBtn.disabled = true;

        const iconMap = { authentication: 'lock', data: 'bar-chart', media: 'cloud', communication: 'message', payment: 'credit-card', ai: 'cpu' };

        const newApi = {
            id: Date.now(),
            title: sanitizeInput(document.getElementById('apiName').value.trim()),
            description: sanitizeInput(document.getElementById('apiDescription').value.trim()),
            thumbnail: sanitizeInput(document.getElementById('apiImage').value.trim()),
            category: sanitizeInput(categoryInput.value),
            publishedDate: sanitizeInput(document.getElementById('apiDate').value),
            author: sanitizeInput(document.getElementById('apiAuthor').value.trim()),
            endpoint: sanitizeInput(document.getElementById('apiEndpoint').value.trim()) || '/api/' + document.getElementById('apiName').value.toLowerCase().replace(/\s+/g, '-'),
            website: document.getElementById('apiWebsite').value.trim() || null,
            icon: iconMap[categoryInput.value] || 'search'
        };

        try {
            await submitApi(newApi);
            showModal('success', 'Published!', 'Your API has been published.');
            setTimeout(() => window.location.href = '/', 2000);
        } catch (error) {
            showModal('error', 'Failed', error.message || 'Failed to publish.');
            submitBtn.disabled = false;
        }
    });

    updateSteps();
}

// Profile Page
let apiToDelete = null;

function initProfilePage() {
    const profileGrid = document.getElementById('profileGrid');
    const authorSearch = document.getElementById('authorSearch');
    const searchAuthorBtn = document.getElementById('searchAuthorBtn');
    if (!profileGrid || !authorSearch) return;

    searchAuthorBtn.addEventListener('click', () => {
        const authorName = authorSearch.value.trim();
        if (!authorName) { showResultModal('error', 'Error', 'Enter your author name'); return; }

        const userApis = apiData.filter(api => api.author.toLowerCase() === authorName.toLowerCase());

        if (userApis.length === 0) {
            profileGrid.innerHTML = `<div class="no-apis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No APIs found for "${escapeHtml(authorName)}"</p></div>`;
            return;
        }

        profileGrid.innerHTML = '';
        userApis.forEach((api, index) => profileGrid.appendChild(createApiCard(api, index, true)));
    });

    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => { deleteModal.style.display = 'none'; apiToDelete = null; });
        deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) { deleteModal.style.display = 'none'; apiToDelete = null; } });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!apiToDelete) return;
            try {
                await deleteApi(apiToDelete);
                deleteModal.style.display = 'none';
                apiData = apiData.filter(api => api.id !== apiToDelete);
                const userApis = apiData.filter(api => api.author.toLowerCase() === authorSearch.value.trim().toLowerCase());
                profileGrid.innerHTML = '';
                if (userApis.length === 0) {
                    profileGrid.innerHTML = `<div class="no-apis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No APIs found</p></div>`;
                } else {
                    userApis.forEach((api, index) => profileGrid.appendChild(createApiCard(api, index, true)));
                }
                showResultModal('success', 'Deleted!', 'API deleted successfully.');
                apiToDelete = null;
            } catch (error) {
                showResultModal('error', 'Failed', error.message || 'Failed to delete.');
            }
        });
    }

    const resultModal = document.getElementById('resultModal');
    const resultClose = document.getElementById('resultClose');
    if (resultClose && resultModal) {
        resultClose.addEventListener('click', () => resultModal.style.display = 'none');
        resultModal.addEventListener('click', (e) => { if (e.target === resultModal) resultModal.style.display = 'none'; });
    }
}

function showDeleteModal(apiId, apiTitle) {
    const deleteModal = document.getElementById('deleteModal');
    const deleteMessage = document.getElementById('deleteMessage');
    if (!deleteModal) return;
    apiToDelete = apiId;
    if (deleteMessage) deleteMessage.textContent = `Delete "${apiTitle}"? This cannot be undone.`;
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

    if (resultIcon) { resultIcon.innerHTML = icons[type] || ''; resultIcon.className = `modal-icon modal-${type}`; }
    if (resultTitle) resultTitle.textContent = title;
    if (resultMessage) resultMessage.textContent = message;
    resultModal.style.display = 'flex';
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const apiGrid = document.getElementById('apiGrid');

    initSearch();
    initPublishForm();
    initModal();
    initCategoryTabs();
    initProfilePage();

    if (apiGrid) {
        try {
            apiData = await fetchApis();
            renderApiGrid(apiData);
        } catch (error) {
            apiGrid.innerHTML = `<div class="no-apis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>Unable to load APIs</p></div>`;
        }
    }
});
