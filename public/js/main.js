// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icon}"></i>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function closeToast(closeButton) {
    const toast = closeButton.closest('.toast');
    if (toast) {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }
}

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    if (typeof initializeNotifications === "function") {
    initializeNotifications();
}
    initializeForms();
    initializeTooltips();
    
    // Check for URL parameters and show messages
    checkUrlMessages();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
    
    // Highlight active navigation link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Notification functionality
function initializeNotifications() {
    // Load notification count
    loadNotificationCount();
    
    // Set up periodic notification checking
    setInterval(loadNotificationCount, 30000); // Check every 30 seconds
}

async function loadNotificationCount() {
    try {
        const response = await fetch('/notifications', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const unreadCount = data.notifications.filter(notification => !notification.isRead).length;
            
            const badge = document.getElementById('notification-count');
            if (badge) {
                badge.textContent = unreadCount;
                badge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        }
    } catch (error) {
        console.error('Failed to load notification count:', error);
    }
}

// Form functionality
function initializeForms() {
    // Add loading states to form submissions
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Re-enable button after 5 seconds as fallback
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButton.dataset.originalText || 'Submit';
                }, 5000);
            }
        });
    });
    
    // Store original button text
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.dataset.originalText = button.innerHTML;
    });
}

// Tooltip functionality
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Utility functions
function getAuthToken() {
    // In a real app, this would get the token from localStorage or session
    // For now, we'll rely on server-side session management
    return null;
}

function checkUrlMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    if (error) {
        showToast('error', 'Error', error);
        // Remove error from URL
        removeUrlParam('error');
    }
    
    if (success) {
        showToast('success', 'Success', success);
        // Remove success from URL
        removeUrlParam('success');
    }
}

function removeUrlParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.replaceState({}, document.title, url);
}

// Format date utility
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time utility
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format currency utility
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading state management
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Confirmation dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Export functions for use in other scripts
window.HackOverflow = {
    showToast,
    formatDate,
    formatTime,
    formatCurrency,
    debounce,
    showLoading,
    hideLoading,
    confirmAction
};

// Enhanced form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Password validation
    const passwordFields = form.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (field.value && field.value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters long');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Close on backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modalId);
            }
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// Enhanced search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        const searchHandler = debounce(function() {
            const query = input.value.trim();
            const targetContainer = input.dataset.target;
            
            if (targetContainer) {
                performSearch(query, targetContainer);
            }
        }, 300);
        
        input.addEventListener('input', searchHandler);
    });
}

function performSearch(query, targetContainer) {
    const container = document.getElementById(targetContainer);
    if (!container) return;
    
    const items = container.querySelectorAll('.searchable-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query.toLowerCase());
        
        item.style.display = matches || !query ? 'block' : 'none';
    });
    
    // Show no results message if needed
    const visibleItems = container.querySelectorAll('.searchable-item[style*="block"], .searchable-item:not([style])');
    const noResultsMsg = container.querySelector('.no-results');
    
    if (visibleItems.length === 0 && query) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-results empty-state';
            msg.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Try adjusting your search terms</p>
            `;
            container.appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Auto-save functionality for forms
function initializeAutoSave() {
    const autoSaveForms = document.querySelectorAll('[data-autosave]');
    
    autoSaveForms.forEach(form => {
        const formId = form.id || 'form-' + Date.now();
        const saveKey = 'autosave-' + formId;
        
        // Load saved data
        loadAutoSavedData(form, saveKey);
        
        // Save on input
        const saveHandler = debounce(() => {
            saveFormData(form, saveKey);
        }, 1000);
        
        form.addEventListener('input', saveHandler);
        
        // Clear on successful submit
        form.addEventListener('submit', () => {
            localStorage.removeItem(saveKey);
        });
    });
}

function saveFormData(form, saveKey) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(saveKey, JSON.stringify(data));
    showToast('Draft saved', 'info', 2000);
}

function loadAutoSavedData(form, saveKey) {
    const savedData = localStorage.getItem(saveKey);
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'file') {
                    field.value = data[key];
                }
            });
            
            showToast('Draft restored', 'info', 3000);
        } catch (error) {
            console.error('Failed to load auto-saved data:', error);
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.getElementById("addVenueBtn");
    const addFirstBtn = document.getElementById("addFirstVenueBtn");
    const cancelBtn = document.getElementById("cancelAddVenueBtn");
    const formCard = document.getElementById("addVenueForm");

    function toggleForm() {
        if (!formCard) return;

        const isVisible = formCard.style.display !== "none";

        if (isVisible) {
            formCard.style.display = "none";
            const form = formCard.querySelector("form");
            if (form) form.reset();
        } else {
            formCard.style.display = "block";
        }
    }

    if (addBtn) addBtn.addEventListener("click", toggleForm);
    if (addFirstBtn) addFirstBtn.addEventListener("click", toggleForm);
    if (cancelBtn) cancelBtn.addEventListener("click", toggleForm);

    // Delete confirmation
    const deleteForms = document.querySelectorAll(".deleteVenueForm");
    deleteForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            const venueName = form.dataset.name;
            const confirmDelete = confirm(`Are you sure you want to delete "${venueName}"?`);
            if (!confirmDelete) {
                e.preventDefault();
            }
        });
    });

});

// ==============================
// Venue Page Functions
// ==============================

// Toggle Add Venue Form
window.toggleAddVenueForm = function () {
    const form = document.getElementById('addVenueForm');
    if (!form) return;

    const isVisible = form.style.display !== 'none';

    if (isVisible) {
        form.style.display = 'none';
        const innerForm = form.querySelector('form');
        if (innerForm) innerForm.reset();
    } else {
        form.style.display = 'block';
        const nameInput = form.querySelector('#name');
        if (nameInput) nameInput.focus();
    }
};

// Edit placeholder
window.editVenue = function (venueId) {
    alert('Edit functionality coming soon!');
};

// Schedule placeholder
window.viewVenueSchedule = function (venueId) {
    alert('Schedule view coming soon!');
};

// Auto-hide alerts
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// Initialize additional functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeAutoSave();
});