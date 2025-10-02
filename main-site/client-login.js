// Client Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('client-login-form');
    const registrationForm = document.getElementById('client-registration-form');
    const registrationModal = document.getElementById('client-registration-modal');
    const registerLink = document.getElementById('register-client');
    const cancelRegistration = document.getElementById('cancel-registration');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // Handle client login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('client-email').value;
            const password = document.getElementById('client-password').value;
            
            // Clear previous errors
            clearErrors();
            
            try {
                const response = await fetch('api/client-login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Store client session
                    localStorage.setItem('clientSession', JSON.stringify({
                        clientId: result.clientId,
                        name: result.name,
                        email: result.email,
                        dogName: result.dogName
                    }));
                    
                    // Redirect to dashboard
                    window.location.href = 'client-dashboard.html';
                } else {
                    showError('email-error', result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('email-error', 'Connection error. Please try again.');
            }
        });
    }

    // Handle client registration
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('reg-phone').value,
                dogName: document.getElementById('reg-dog-name').value,
                password: document.getElementById('reg-password').value
            };
            
            try {
                const response = await fetch('api/client-register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Registration successful! You can now login.');
                    registrationModal.classList.add('hidden');
                    registrationForm.reset();
                } else {
                    alert(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration error. Please try again.');
            }
        });
    }

    // Show registration modal
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            registrationModal.classList.remove('hidden');
        });
    }

    // Hide registration modal
    if (cancelRegistration) {
        cancelRegistration.addEventListener('click', function() {
            registrationModal.classList.add('hidden');
            registrationForm.reset();
        });
    }

    // Handle forgot password
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('client-email').value;
            if (email) {
                alert('Password reset instructions have been sent to ' + email);
            } else {
                alert('Please enter your email address first');
            }
        });
    }

    // Helper functions
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
});
