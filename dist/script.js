// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

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
    const isActive = blogItem.classList.contains('active');
    
    // Close all other blog items
    document.querySelectorAll('.blog-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        blogItem.classList.add('active');
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

// Scheduler Form Handling
document.querySelector('.scheduler-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
    
    // Store in localStorage for now (in production, this would go to a server)
    const existingBookings = JSON.parse(localStorage.getItem('pawsitiveBookings') || '[]');
    existingBookings.push(formData);
    localStorage.setItem('pawsitiveBookings', JSON.stringify(existingBookings));
    
    // Show success message
    alert(`Thank you, ${formData.dogName}! Your session request has been submitted. We'll contact you soon to confirm your ${formData.timeSlot} appointment.`);
    
    // Reset form
    this.reset();
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
    
    // Load current content
    const textContent = document.querySelector(`#${sectionId} .text-content`);
    if (textContent) {
        document.getElementById('edit-content').value = textContent.innerText;
    }
    
    // Save functionality
    document.getElementById('save-edit').addEventListener('click', () => {
        const newContent = document.getElementById('edit-content').value;
        if (textContent) {
            textContent.innerHTML = newContent.replace(/\n/g, '<br>');
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
