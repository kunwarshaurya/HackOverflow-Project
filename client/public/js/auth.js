// Authentication form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthForms();
    initializePasswordValidation();
    initializeRoleFields();
});

function initializeAuthForms() {
    const loginForm = document.querySelector('form[action="/auth/login"]');
    const registerForm = document.querySelector('form[action="/auth/register"]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

function handleLoginSubmit(event) {
    const form = event.target;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    // Basic validation
    if (!email || !password) {
        event.preventDefault();
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        event.preventDefault();
        showAuthError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    showLoadingButton(submitButton, 'Signing In...');
}

function handleRegisterSubmit(event) {
    const form = event.target;
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    const role = form.querySelector('#role').value;
    const terms = form.querySelector('input[name="terms"]').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
        event.preventDefault();
        showAuthError('Please fill in all required fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        event.preventDefault();
        showAuthError('Please enter a valid email address');
        return;
    }
    
    if (password !== confirmPassword) {
        event.preventDefault();
        showAuthError('Passwords do not match');
        return;
    }
    
    if (!isStrongPassword(password)) {
        event.preventDefault();
        showAuthError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
        return;
    }
    
    if (!terms) {
        event.preventDefault();
        showAuthError('Please accept the Terms of Service and Privacy Policy');
        return;
    }
    
    // Role-specific validation
    if (role === 'student') {
        const department = form.querySelector('#department').value;
        const year = form.querySelector('#year').value;
        
        if (!department || !year) {
            event.preventDefault();
            showAuthError('Please fill in department and year for student registration');
            return;
        }
    }
    
    if (role === 'club_lead') {
        const clubName = form.querySelector('#clubName').value;
        
        if (!clubName) {
            event.preventDefault();
            showAuthError('Please enter your club name');
            return;
        }
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    showLoadingButton(submitButton, 'Creating Account...');
}

function initializePasswordValidation() {
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePasswordStrength(this.value);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

function validatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('password-strength');
    if (!strengthIndicator) return;
    
    const strength = getPasswordStrength(password);
    
    strengthIndicator.className = `password-strength ${strength.level}`;
    strengthIndicator.textContent = strength.message;
}

function getPasswordStrength(password) {
    if (password.length === 0) {
        return { level: '', message: '' };
    }
    
    if (password.length < 6) {
        return { level: 'weak', message: 'Too short' };
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 3) {
        return { level: 'weak', message: 'Weak password' };
    } else if (score < 5) {
        return { level: 'medium', message: 'Medium strength' };
    } else {
        return { level: 'strong', message: 'Strong password' };
    }
}

function validatePasswordMatch() {
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const confirmInput = document.querySelector('#confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.setCustomValidity('Passwords do not match');
        confirmInput.classList.add('error');
    } else {
        confirmInput.setCustomValidity('');
        confirmInput.classList.remove('error');
    }
}

function initializeRoleFields() {
    const roleSelect = document.querySelector('#role');
    if (roleSelect) {
        roleSelect.addEventListener('change', toggleRoleFields);
    }
}

function toggleRoleFields() {
    const role = document.querySelector('#role').value;
    const studentFields = document.getElementById('student-fields');
    const clubLeadFields = document.getElementById('club-lead-fields');
    
    // Hide all role-specific fields
    if (studentFields) studentFields.style.display = 'none';
    if (clubLeadFields) clubLeadFields.style.display = 'none';
    
    // Show relevant fields
    if (role === 'student' && studentFields) {
        studentFields.style.display = 'block';
        // Make fields required
        studentFields.querySelectorAll('input, select').forEach(field => {
            field.required = true;
        });
    } else if (role === 'club_lead' && clubLeadFields) {
        clubLeadFields.style.display = 'block';
        // Make fields required
        clubLeadFields.querySelectorAll('input, select').forEach(field => {
            field.required = true;
        });
    }
    
    // Remove required attribute from hidden fields
    document.querySelectorAll('.role-fields').forEach(fieldGroup => {
        if (fieldGroup.style.display === 'none') {
            fieldGroup.querySelectorAll('input, select').forEach(field => {
                field.required = false;
            });
        }
    });
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
}

function showAuthError(message) {
    // Remove existing error alerts
    const existingAlert = document.querySelector('.alert-error');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new error alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    
    // Insert at the top of the form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(alert, form.firstChild);
        
        // Scroll to error
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

function showLoadingButton(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

// Auto-focus first input
document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.querySelector('.auth-form input:not([type="hidden"])');
    if (firstInput) {
        firstInput.focus();
    }
});

// Handle form errors from server
document.addEventListener('DOMContentLoaded', function() {
    const errorElement = document.querySelector('.alert-error');
    if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Export functions for global use
window.togglePassword = togglePassword;
window.toggleRoleFields = toggleRoleFields;