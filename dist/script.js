// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    toggleMobileMenu();
});

// Handle keyboard interaction for hamburger menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
    }
});

function toggleMobileMenu() {
    const isExpanded = navMenu.classList.contains('active');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update ARIA attributes
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navMenu.setAttribute('aria-hidden', isExpanded);
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Testimonials section - simple grid layout (no carousel needed)

// Blog Accordion
function toggleBlog(index) {
    const blogItem = document.querySelectorAll('.blog-item')[index];
    const blogHeader = blogItem.querySelector('.blog-header');
    const isActive = blogItem.classList.contains('active');
    
    // Close all other blog items
    document.querySelectorAll('.blog-item').forEach(item => {
        item.classList.remove('active');
        const header = item.querySelector('.blog-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Toggle current item
    if (!isActive) {
        blogItem.classList.add('active');
        blogHeader.setAttribute('aria-expanded', 'true');
    }
}

// Keyboard handlers for interactive elements
function handleCardKeydown(event, serviceType) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showServicePopup(serviceType);
    }
}

function handleBlogKeydown(event, index) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleBlog(index);
    }
}

// Quiz Functionality (Placeholder)
function startQuiz() {
    // Store quiz data in localStorage
    const quizData = {
        started: true,
        startTime: new Date().toISOString(),
        answers: {}
    };
    
    localStorage.setItem('pawsitiveQuiz', JSON.stringify(quizData));
    
    // For now, show an alert - this will be expanded later
    alert('Quiz functionality coming soon! This will generate personalized training recommendations based on your dog\'s needs.');
    
    // In the future, this will redirect to a quiz page or open a modal
    // window.location.href = 'quiz.html';
}

// Form validation functions
function validateField(fieldId, errorId, validator) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorId);
    const isValid = validator(field.value);
    
    if (!isValid) {
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = getErrorMessage(fieldId);
        errorElement.classList.add('show');
        return false;
    } else {
        field.setAttribute('aria-invalid', 'false');
        errorElement.classList.remove('show');
        return true;
    }
}

function getErrorMessage(fieldId) {
    const messages = {
        'dog-name': 'Please enter your dog\'s name',
        'breed': 'Please enter your dog\'s breed',
        'age': 'Please enter your dog\'s age',
        'time-slot': 'Please select a time slot'
    };
    return messages[fieldId] || 'This field is required';
}

function validateForm() {
    const validations = [
        validateField('dog-name', 'dog-name-error', (value) => value.trim().length > 0),
        validateField('breed', 'breed-error', (value) => value.trim().length > 0),
        validateField('age', 'age-error', (value) => value.trim().length > 0),
        validateField('time-slot', 'time-slot-error', (value) => value.length > 0)
    ];
    
    return validations.every(valid => valid);
}

// Scheduler Form Handling
const schedulerForm = document.querySelector('.scheduler-form');
if (schedulerForm) {
    schedulerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Focus on first invalid field
            const firstInvalid = document.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }
        
        const submitButton = this.querySelector('button[type="submit"]');
        
        // Show loading state
        showButtonLoading(submitButton);
        
        // Collect form data
        const formData = {
            dogName: document.getElementById('dog-name').value,
            breed: document.getElementById('breed').value,
            age: document.getElementById('age').value,
            trainingGoals: document.getElementById('training-goals').value,
            behavioralIssues: document.getElementById('behavioral-issues').value,
            timeSlot: document.getElementById('time-slot').value,
            submittedAt: new Date().toISOString()
        };
        
        // Simulate form submission (replace with actual API call)
        setTimeout(async () => {
            // Store in database via PHP API
            await saveTrainingSessionToAPI(formData);
            
            // Hide loading state
            hideButtonLoading(submitButton);
            
            // Show success message
            alert(`Thank you, ${formData.dogName}! Your session request has been submitted. We'll contact you soon to confirm your ${formData.timeSlot} appointment.`);
            
            // Reset form
            this.reset();
            
            // Clear all error states
            document.querySelectorAll('[aria-invalid]').forEach(field => {
                field.setAttribute('aria-invalid', 'false');
            });
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
        }, 2000);
    });
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const requiredFields = ['dog-name', 'breed', 'age', 'time-slot'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldId, `${fieldId}-error`, (value) => value.trim().length > 0);
            });
            
            field.addEventListener('input', function() {
                if (field.getAttribute('aria-invalid') === 'true') {
                    validateField(fieldId, `${fieldId}-error`, (value) => value.trim().length > 0);
                }
            });
        }
    });
});

// Site Owner Interface (Simple Content Management)
function initializeOwnerInterface() {
    // Check if user is the site owner (simple check for demo purposes)
    const isOwner = localStorage.getItem('pawsitiveOwner') === 'true';
    
    if (isOwner) {
        addOwnerControls();
    } else {
        // Add a simple way to become owner for demo purposes
        addOwnerToggle();
    }
}

function addOwnerToggle() {
    // Add a hidden toggle in the footer for demo purposes
    const footer = document.querySelector('.footer');
    const ownerToggle = document.createElement('button');
    ownerToggle.textContent = 'Site Owner Mode';
    ownerToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d4af37;
        color: #1a4d3a;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    ownerToggle.addEventListener('click', () => {
        localStorage.setItem('pawsitiveOwner', 'true');
        location.reload();
    });
    
    footer.appendChild(ownerToggle);
}

function addOwnerControls() {
    // Add edit buttons to various sections
    const sections = ['about', 'rates', 'testimonials', 'blog', 'contact'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '✏️ Edit';
            editBtn.className = 'edit-btn';
            editBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(212, 175, 55, 0.8);
                color: #1a4d3a;
                border: none;
                padding: 5px 10px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                z-index: 100;
            `;
            
            editBtn.addEventListener('click', () => openEditModal(sectionId));
            section.style.position = 'relative';
            section.appendChild(editBtn);
        }
    });
}

function openEditModal(sectionId) {
    // Simple edit modal for content management
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #2d5a47;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #d4af37; margin-bottom: 1rem;">Edit ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section</h3>
        <textarea id="edit-content" style="width: 100%; height: 200px; padding: 10px; border-radius: 8px; border: 2px solid #d4af37; background: rgba(255,255,255,0.1); color: #f4f4f4; font-family: inherit;"></textarea>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
            <button id="save-edit" style="background: #d4af37; color: #1a4d3a; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 600;">Save</button>
            <button id="cancel-edit" style="background: transparent; color: #f4f4f4; border: 2px solid #f4f4f4; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 600;">Cancel</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Load current content (excluding titles)
    const textContent = document.querySelector(`#${sectionId} .text-content`);
    if (textContent) {
        // Get only paragraph content, excluding titles
        const paragraphs = textContent.querySelectorAll('p');
        const paragraphText = Array.from(paragraphs).map(p => p.innerText).join('\n\n');
        document.getElementById('edit-content').value = paragraphText;
    }
    
    // Save functionality
    document.getElementById('save-edit').addEventListener('click', () => {
        const newContent = document.getElementById('edit-content').value;
        if (textContent) {
            // Preserve the title and only update paragraphs
            const title = textContent.querySelector('h2');
            const titleHTML = title ? title.outerHTML : '';
            const paragraphsHTML = newContent.split('\n\n').map(p => `<p>${p}</p>`).join('');
            textContent.innerHTML = titleHTML + paragraphsHTML;
        }
        document.body.removeChild(modal);
    });
    
    // Cancel functionality
    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Video debugging and initialization
function initializeVideo() {
    const video = document.querySelector('.hero-video');
    const loading = document.querySelector('.video-loading');
    
    if (video) {
        // Add event listeners for debugging
        video.addEventListener('loadstart', () => {
            console.log('Video loading started');
            if (loading) loading.style.display = 'block';
        });
        
        video.addEventListener('canplay', () => {
            console.log('Video can start playing');
            if (loading) loading.classList.add('hidden');
        });
        
        video.addEventListener('playing', () => {
            console.log('Video is playing');
            if (loading) loading.classList.add('hidden');
        });
        
        video.addEventListener('ended', () => {
            console.log('Video ended - starting fade out');
            // Add fade out effect
            video.style.transition = 'opacity 2s ease-out';
            video.style.opacity = '0';
            
            // After fade completes, show the fallback background
            setTimeout(() => {
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.background = 'linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #3a6b56 100%)';
                }
                video.style.display = 'none';
            }, 2000); // 2 seconds to match the fade duration
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            if (loading) loading.classList.add('hidden');
            // Show fallback message
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.background = 'linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #3a6b56 100%)';
            }
        });
        
        video.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
        });
        
        video.addEventListener('waiting', () => {
            console.log('Video is buffering');
            if (loading) loading.style.display = 'block';
        });
        
        // Set a timeout to hide loading if video takes too long
        setTimeout(() => {
            if (loading && !video.readyState) {
                loading.classList.add('hidden');
                console.log('Video loading timeout - showing fallback');
            }
        }, 10000); // 10 second timeout
        
        // Try to play the video
        video.play().catch(error => {
            console.log('Autoplay prevented:', error);
            // This is normal on some browsers - video will play on user interaction
            if (loading) loading.classList.add('hidden');
        });
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize video
    initializeVideo();
    
    // Initialize navigation active states
    initializeNavigation();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize PHP API connection
    initializeAPIConnection();
    
    // Initialize owner interface
    initializeOwnerInterface();
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 77, 58, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 77, 58, 0.95)';
        }
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Utility function to save content changes
function saveContent(sectionId, content) {
    const contentData = JSON.parse(localStorage.getItem('pawsitiveContent') || '{}');
    contentData[sectionId] = content;
    localStorage.setItem('pawsitiveContent', JSON.stringify(contentData));
}

// Utility function to load saved content
function loadContent(sectionId) {
    const contentData = JSON.parse(localStorage.getItem('pawsitiveContent') || '{}');
    return contentData[sectionId] || null;
}

// Service popup functionality
function showServicePopup(serviceType) {
    const serviceInfo = {
        puppy: {
            title: "Puppy Classes",
            price: "$75/session",
            description: "Perfect for puppies 8-16 weeks old",
            details: "Our puppy classes focus on early socialization, basic commands, and establishing good habits from the start. We cover house training, bite inhibition, and proper play behavior. Each session includes guidance for the whole family to ensure consistency at home.",
            duration: "45-60 minutes per session",
            includes: ["Basic commands (sit, stay, come)", "House training techniques", "Socialization with other puppies", "Bite inhibition training", "Family training guidance"]
        },
        basic: {
            title: "Basic Training",
            price: "$100/session",
            description: "Essential commands and behavior",
            details: "Comprehensive basic training for dogs of all ages. We focus on essential commands, leash walking, and general good behavior. Perfect for dogs who need a solid foundation in obedience training.",
            duration: "60-75 minutes per session",
            includes: ["Sit, stay, down, come commands", "Leash walking and loose leash training", "Wait and leave it commands", "Basic impulse control", "Problem behavior prevention"]
        },
        behavioral: {
            title: "Behavioral Modification",
            price: "$125/session",
            description: "Addressing specific behavioral issues",
            details: "Specialized training for dogs with specific behavioral challenges. We work on issues like separation anxiety, aggression, fear, and other complex behaviors that require professional intervention.",
            duration: "75-90 minutes per session",
            includes: ["Behavioral assessment", "Customized training plan", "Desensitization techniques", "Counter-conditioning methods", "Ongoing support and follow-up"]
        },
        advanced: {
            title: "Advanced Training",
            price: "$100/session",
            description: "Complex commands and specialized skills",
            details: "For dogs who have mastered basic commands and are ready for more challenging training. Perfect for dogs preparing for therapy work, advanced obedience, or specialized tasks.",
            duration: "60-75 minutes per session",
            includes: ["Advanced obedience commands", "Off-leash reliability", "Distance commands", "Specialized skills training", "Public access preparation"]
        }
    };
    
    const service = serviceInfo[serviceType];
    if (!service) return;
    
    // Create popup modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #2d5a47;
        padding: 2rem;
        border-radius: 20px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        border: 2px solid #d4af37;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="color: #f4f4f4; margin: 0; font-family: 'Fredoka', cursive;">${service.title}</h2>
            <button id="close-popup" style="background: none; border: none; color: #f4f4f4; font-size: 1.5rem; cursor: pointer; padding: 5px;">×</button>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #f4f4f4; font-size: 2rem; margin: 0 0 0.5rem 0;">${service.price}</h3>
            <p style="color: #e8e8e8; font-style: italic; margin: 0;">${service.description}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <p style="color: #f4f4f4; line-height: 1.6; margin-bottom: 1rem;">${service.details}</p>
            <p style="color: #f4f4f4; font-weight: 600; margin-bottom: 1rem;">Duration: ${service.duration}</p>
        </div>
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #f4f4f4; margin-bottom: 1rem;">What's Included:</h4>
            <ul style="color: #f4f4f4; padding-left: 1.5rem;">
                ${service.includes.map(item => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join('')}
            </ul>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="closeServicePopup()" style="background: #d4af37; color: #1a4d3a; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 1rem;">Close</button>
            <button onclick="scheduleService('${serviceType}')" style="background: transparent; color: #f4f4f4; border: 2px solid #d4af37; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 1rem;">Schedule This Service</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close popup functionality
    document.getElementById('close-popup').addEventListener('click', closeServicePopup);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeServicePopup();
    });
}

function closeServicePopup() {
    const modal = document.querySelector('[style*="z-index: 10000"]');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function scheduleService(serviceType) {
    closeServicePopup();
    // Scroll to scheduler section
    document.getElementById('scheduler').scrollIntoView({ behavior: 'smooth' });
    // You could also pre-fill the form with the selected service
}

// Navigation Active States
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Function to update active navigation
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Update on page load
    updateActiveNav();
}

// ===== PHP API DATABASE INTEGRATION =====

let isAPIConnected = false;

// Initialize PHP API connection
function initializeAPIConnection() {
    // Test API connection
    testAPIConnection();
}

// Test API connection
async function testAPIConnection() {
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_content'
            })
        });
        
        if (response.ok) {
            isAPIConnected = true;
            console.log('Connected to PHP API');
            loadContentFromAPI();
        } else {
            console.log('API connection failed, using localStorage fallback');
            loadSavedContent();
        }
    } catch (error) {
        console.error('API connection error:', error);
        console.log('Using localStorage fallback');
        loadSavedContent();
    }
}

// Database Operations
async function saveContentToDatabase(sectionId, content) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('content', sectionId, content);
        return;
    }
    
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save_content',
                section_id: sectionId,
                content: content
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log(`Content saved to database for section: ${sectionId}`);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error saving to database:', error);
        // Fallback to localStorage
        saveToLocalStorage('content', sectionId, content);
    }
}

async function savePhotoToDatabase(sectionId, photoData) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('photos', sectionId, photoData);
        return;
    }
    
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save_photo',
                section_id: sectionId,
                photo_data: photoData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log(`Photo saved to database for section: ${sectionId}`);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error saving photo to database:', error);
        // Fallback to localStorage
        saveToLocalStorage('photos', sectionId, photoData);
    }
}

async function saveBlogPostToDatabase(title, content) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('blogs', Date.now(), { title, content });
        return;
    }
    
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save_blog_post',
                title: title,
                content: content
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log('Blog post saved to database');
            // Refresh blog section
            await loadBlogPostsFromAPI();
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error saving blog post to database:', error);
        // Fallback to localStorage
        saveToLocalStorage('blogs', Date.now(), { title, content });
    }
}

async function loadContentFromAPI() {
    if (!isAPIConnected) {
        loadSavedContent(); // Use existing localStorage fallback
        return;
    }
    
    try {
        // Load content
        const contentResponse = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_content'
            })
        });
        
        if (contentResponse.ok) {
            const contentResult = await contentResponse.json();
            if (contentResult.success && contentResult.data) {
                contentResult.data.forEach(item => {
                    updateSectionContent(item.section_id, item.content);
                });
            }
        }
        
        // Load photos
        const photosResponse = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_photos'
            })
        });
        
        if (photosResponse.ok) {
            const photosResult = await photosResponse.json();
            if (photosResult.success && photosResult.data) {
                photosResult.data.forEach(item => {
                    updateSectionPhoto(item.section_id, item.photo_data);
                });
            }
        }
        
        // Load blog posts
        await loadBlogPostsFromAPI();
        
        console.log('Content loaded from database');
    } catch (error) {
        console.error('Error loading from database:', error);
        loadSavedContent(); // Fallback to localStorage
    }
}

async function loadBlogPostsFromAPI() {
    if (!isAPIConnected) return;
    
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_blog_posts'
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                updateBlogSection(result.data);
            }
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function updateBlogSection(blogPosts) {
    const blogSection = document.querySelector('#blog .blog-accordion');
    if (!blogSection) return;
    
    // Clear existing blog items (keep the first few default ones or replace all)
    blogSection.innerHTML = '';
    
    blogPosts.forEach((post, index) => {
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        blogItem.innerHTML = `
            <div class="blog-header" 
                 onclick="toggleBlog(${index})" 
                 role="button" 
                 tabindex="0"
                 aria-expanded="false"
                 aria-controls="blog-content-${index}"
                 onkeydown="handleBlogKeydown(event, ${index})">
                <h3>${post.title}</h3>
                <span class="blog-toggle" aria-hidden="true">+</span>
            </div>
            <div class="blog-content" id="blog-content-${index}">
                <p>${post.content}</p>
            </div>
        `;
        blogSection.appendChild(blogItem);
    });
}

async function saveTrainingSessionToAPI(formData) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('pawsitiveBookings') || '[]');
        existingBookings.push(formData);
        localStorage.setItem('pawsitiveBookings', JSON.stringify(existingBookings));
        return;
    }
    
    try {
        const response = await fetch('./api/content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save_training_session',
                dog_name: formData.dogName,
                breed: formData.breed,
                age: formData.age,
                training_goals: formData.trainingGoals || '',
                behavioral_issues: formData.behavioralIssues || '',
                time_slot: formData.timeSlot
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log('Training session saved to database');
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error saving training session:', error);
        // Fallback to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('pawsitiveBookings') || '[]');
        existingBookings.push(formData);
        localStorage.setItem('pawsitiveBookings', JSON.stringify(existingBookings));
    }
}

// Helper functions for localStorage fallback
function saveToLocalStorage(type, key, data) {
    const storageKey = type === 'content' ? 'siteContent' : 
                      type === 'photos' ? 'sitePhotos' : 'siteBlogs';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    saved[key] = data;
    localStorage.setItem(storageKey, JSON.stringify(saved));
}

// Helper function to update section photo
function updateSectionPhoto(sectionId, photoData) {
    const section = document.getElementById(sectionId);
    const img = section?.querySelector('.section-image');
    
    if (img) {
        img.src = photoData;
    }
}

// ===== OWNER INTERFACE SYSTEM =====

// Owner credentials (in production, these should be stored securely)
const OWNER_CREDENTIALS = {
    username: 'skyler',
    password: 'canine2024'
};

let isOwnerMode = false;
let ownerSession = null;

// Initialize Owner Interface
function initializeOwnerInterface() {
    // Check for existing owner session
    ownerSession = localStorage.getItem('ownerSession');
    if (ownerSession) {
        try {
            const session = JSON.parse(ownerSession);
            if (session.expires > Date.now()) {
                activateOwnerMode();
                return;
            } else {
                localStorage.removeItem('ownerSession');
            }
        } catch (e) {
            localStorage.removeItem('ownerSession');
        }
    }
    
    // Show owner access button after 3 seconds
    setTimeout(() => {
        document.getElementById('owner-access-btn').classList.remove('hidden');
    }, 3000);
    
    // Setup event listeners
    setupOwnerEventListeners();
}

// Setup Owner Event Listeners
function setupOwnerEventListeners() {
    const ownerAccessBtn = document.getElementById('owner-access-btn');
    const loginModal = document.getElementById('owner-login-modal');
    const loginForm = document.getElementById('owner-login-form');
    const cancelLogin = document.getElementById('cancel-login');
    
    ownerAccessBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        document.getElementById('owner-username').focus();
    });
    
    cancelLogin.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });
    
    loginForm.addEventListener('submit', handleOwnerLogin);
    
    // Close modal on background click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
    });
}

// Handle Owner Login
function handleOwnerLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('owner-username').value;
    const password = document.getElementById('owner-password').value;
    
    if (username === OWNER_CREDENTIALS.username && password === OWNER_CREDENTIALS.password) {
        // Create session
        const session = {
            username: username,
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('ownerSession', JSON.stringify(session));
        ownerSession = session;
        
        // Hide login modal and activate owner mode
        document.getElementById('owner-login-modal').classList.add('hidden');
        activateOwnerMode();
        
        // Clear form
        document.getElementById('owner-login-form').reset();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Activate Owner Mode
function activateOwnerMode() {
    isOwnerMode = true;
    document.body.classList.add('owner-mode');
    
    // Hide owner access button
    document.getElementById('owner-access-btn').classList.add('hidden');
    
    // Create owner toolbar
    createOwnerToolbar();
    
    // Add edit buttons to sections
    addEditButtonsToSections();
    
    // Load saved content
    loadSavedContent();
}

// Create Owner Toolbar
function createOwnerToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'owner-toolbar';
    toolbar.innerHTML = `
        <button id="edit-content-btn" class="active">📝 Edit Content</button>
        <button id="manage-photos-btn">📸 Photos</button>
        <button id="manage-blog-btn">📰 Blog</button>
        <button id="manage-testimonials-btn">⭐ Testimonials</button>
        <button id="owner-logout-btn">🚪 Logout</button>
    `;
    
    document.body.appendChild(toolbar);
    
    // Setup toolbar event listeners
    setupToolbarEventListeners(toolbar);
}

// Setup Toolbar Event Listeners
function setupToolbarEventListeners(toolbar) {
    const editContentBtn = toolbar.querySelector('#edit-content-btn');
    const managePhotosBtn = toolbar.querySelector('#manage-photos-btn');
    const manageBlogBtn = toolbar.querySelector('#manage-blog-btn');
    const manageTestimonialsBtn = toolbar.querySelector('#manage-testimonials-btn');
    const logoutBtn = toolbar.querySelector('#owner-logout-btn');
    
    editContentBtn.addEventListener('click', () => toggleEditMode('content'));
    managePhotosBtn.addEventListener('click', () => openPhotoManager());
    manageBlogBtn.addEventListener('click', () => openBlogManager());
    manageTestimonialsBtn.addEventListener('click', () => openTestimonialManager());
    logoutBtn.addEventListener('click', logoutOwner);
    
    // Active state management
    [editContentBtn, managePhotosBtn, manageBlogBtn, manageTestimonialsBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            toolbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Toggle Edit Mode
function toggleEditMode(mode) {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const editBtn = section.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.style.display = mode === 'content' ? 'block' : 'none';
        }
    });
}

// Add Edit Buttons to Sections
function addEditButtonsToSections() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        if (!section.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = '✏️ Edit';
            editBtn.addEventListener('click', () => openSectionEditor(section.id));
            section.appendChild(editBtn);
        }
    });
}

// Open Section Editor
function openSectionEditor(sectionId) {
    const section = document.getElementById(sectionId);
    const textContent = section.querySelector('.text-content');
    
    if (!textContent) return;
    
    // Get current content (excluding titles)
    const paragraphs = textContent.querySelectorAll('p');
    const currentContent = Array.from(paragraphs).map(p => p.innerText).join('\n\n');
    
    // Create enhanced edit modal
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="login-content" style="max-width: 600px;">
            <h3>Edit ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section</h3>
            <div class="form-group">
                <label>Content (titles are protected)</label>
                <textarea id="section-content" style="width: 100%; height: 300px; padding: 1rem; border-radius: 10px; border: 2px solid rgba(212, 175, 55, 0.3); background: rgba(255, 255, 255, 0.1); color: #f4f4f4; font-family: inherit; resize: vertical;">${currentContent}</textarea>
            </div>
            <div class="login-buttons">
                <button id="save-section" class="btn btn-primary">Save Changes</button>
                <button id="cancel-section" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#save-section').addEventListener('click', () => {
        const newContent = modal.querySelector('#section-content').value;
        saveSectionContent(sectionId, newContent);
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-section').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Save Section Content
async function saveSectionContent(sectionId, content) {
    const section = document.getElementById(sectionId);
    const textContent = section.querySelector('.text-content');
    
    if (textContent) {
        // Preserve title and update paragraphs
        const title = textContent.querySelector('h2');
        const titleHTML = title ? title.outerHTML : '';
        const paragraphsHTML = content.split('\n\n').map(p => `<p>${p}</p>`).join('');
        textContent.innerHTML = titleHTML + paragraphsHTML;
        
        // Save to database (with localStorage fallback)
        await saveContentToDatabase(sectionId, content);
        
        showNotification('Content saved successfully!', 'success');
    }
}

// Photo Manager
function openPhotoManager() {
    const modal = document.createElement('div');
    modal.className = 'photo-upload-modal';
    modal.innerHTML = `
        <div class="photo-upload-content">
            <h3>📸 Photo Manager</h3>
            <div class="form-group">
                <label>Select Section to Update Photo:</label>
                <select id="photo-section" style="width: 100%; padding: 1rem; border-radius: 10px; border: 2px solid rgba(212, 175, 55, 0.3); background: rgba(255, 255, 255, 0.1); color: #f4f4f4;">
                    <option value="about">About Section</option>
                    <option value="rates">Rates Section</option>
                    <option value="scheduler">Schedule Section</option>
                    <option value="contact">Contact Section</option>
                    <option value="quiz">Quiz Section</option>
                </select>
            </div>
            <div class="form-group">
                <label>Upload New Photo:</label>
                <input type="file" id="photo-upload" accept="image/*" style="width: 100%; padding: 1rem; border-radius: 10px; border: 2px solid rgba(212, 175, 55, 0.3); background: rgba(255, 255, 255, 0.1); color: #f4f4f4;">
            </div>
            <div id="photo-preview-container" style="display: none;">
                <img id="photo-preview" class="photo-preview" alt="Preview">
            </div>
            <div class="login-buttons">
                <button id="save-photo" class="btn btn-primary">Save Photo</button>
                <button id="cancel-photo" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    const photoUpload = modal.querySelector('#photo-upload');
    const previewContainer = modal.querySelector('#photo-preview-container');
    const preview = modal.querySelector('#photo-preview');
    
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    modal.querySelector('#save-photo').addEventListener('click', () => {
        const section = modal.querySelector('#photo-section').value;
        const file = photoUpload.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateSectionPhoto(section, e.target.result);
                document.body.removeChild(modal);
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select a photo to upload.', 'error');
        }
    });
    
    modal.querySelector('#cancel-photo').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Update Section Photo
async function updateSectionPhoto(sectionId, photoData) {
    const section = document.getElementById(sectionId);
    const img = section.querySelector('.section-image');
    
    if (img) {
        img.src = photoData;
        
        // Save to database (with localStorage fallback)
        await savePhotoToDatabase(sectionId, photoData);
        
        showNotification('Photo updated successfully!', 'success');
    }
}

// Blog Manager
function openBlogManager() {
    const modal = document.createElement('div');
    modal.className = 'blog-editor-modal';
    modal.innerHTML = `
        <div class="blog-editor-content">
            <h3>📰 Blog Manager</h3>
            <div class="form-group">
                <label>Blog Post Title:</label>
                <input type="text" id="blog-title" placeholder="Enter blog post title">
            </div>
            <div class="form-group">
                <label>Blog Post Content:</label>
                <textarea id="blog-content" placeholder="Write your blog post content here..."></textarea>
            </div>
            <div class="form-group">
                <label>Add to existing blog posts:</label>
                <button id="add-blog-post" class="btn btn-primary">Add Blog Post</button>
            </div>
            <div id="blog-preview" class="blog-preview" style="display: none;">
                <h4 id="preview-title"></h4>
                <p id="preview-content"></p>
            </div>
            <div class="login-buttons">
                <button id="save-blog" class="btn btn-primary">Save Blog</button>
                <button id="cancel-blog" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    const titleInput = modal.querySelector('#blog-title');
    const contentInput = modal.querySelector('#blog-content');
    const preview = modal.querySelector('#blog-preview');
    const previewTitle = modal.querySelector('#preview-title');
    const previewContent = modal.querySelector('#preview-content');
    
    // Live preview
    [titleInput, contentInput].forEach(input => {
        input.addEventListener('input', () => {
            previewTitle.textContent = titleInput.value || 'Blog Post Title';
            previewContent.textContent = contentInput.value || 'Blog post content will appear here...';
            preview.style.display = 'block';
        });
    });
    
    modal.querySelector('#add-blog-post').addEventListener('click', () => {
        if (titleInput.value && contentInput.value) {
            addBlogPost(titleInput.value, contentInput.value);
            titleInput.value = '';
            contentInput.value = '';
            preview.style.display = 'none';
            showNotification('Blog post added!', 'success');
        } else {
            showNotification('Please fill in both title and content.', 'error');
        }
    });
    
    modal.querySelector('#save-blog').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-blog').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add Blog Post
async function addBlogPost(title, content) {
    // Save to database (with localStorage fallback)
    await saveBlogPostToDatabase(title, content);
}

// Testimonial Manager
function openTestimonialManager() {
    showNotification('Testimonial manager coming soon!', 'info');
}

// Load Saved Content
function loadSavedContent() {
    // Load saved photos
    const savedPhotos = JSON.parse(localStorage.getItem('sitePhotos') || '{}');
    Object.keys(savedPhotos).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const img = section?.querySelector('.section-image');
        if (img) {
            img.src = savedPhotos[sectionId];
        }
    });
    
    // Load saved content
    const savedContent = JSON.parse(localStorage.getItem('siteContent') || '{}');
    Object.keys(savedContent).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const textContent = section?.querySelector('.text-content');
        if (textContent) {
            const title = textContent.querySelector('h2');
            const titleHTML = title ? title.outerHTML : '';
            const paragraphsHTML = savedContent[sectionId].content.split('\n\n').map(p => `<p>${p}</p>`).join('');
            textContent.innerHTML = titleHTML + paragraphsHTML;
        }
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10003;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Logout Owner
function logoutOwner() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('ownerSession');
        ownerSession = null;
        isOwnerMode = false;
        
        // Remove owner mode styling
        document.body.classList.remove('owner-mode');
        
        // Remove toolbar
        const toolbar = document.querySelector('.owner-toolbar');
        if (toolbar) {
            document.body.removeChild(toolbar);
        }
        
        // Remove edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.remove();
        });
        
        // Show owner access button
        document.getElementById('owner-access-btn').classList.remove('hidden');
        
        showNotification('Logged out successfully!', 'info');
    }
}

// Loading States and Animations
function initializeAnimations() {
    // Scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Button Loading State Handler
function showButtonLoading(button) {
    button.classList.add('btn-loading');
    button.disabled = true;
}

function hideButtonLoading(button) {
    button.classList.remove('btn-loading');
    button.disabled = false;
}

// Form Loading States
function handleFormSubmission(form, callback) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        showButtonLoading(submitButton);
        
        // Simulate form processing (replace with actual form handling)
        setTimeout(() => {
            hideButtonLoading(submitButton);
            if (callback) callback();
        }, 2000);
    });
}
