// PHP API Configuration for SiteWorks
// Replace Supabase with PHP backend API

const API_CONFIG = {
    baseUrl: './api/', // Adjust this path based on your SiteWorks file structure
    endpoints: {
        content: 'content.php',
        contact: 'contact.php'
    }
};

// Initialize API connection
let isAPIConnected = false;

function initializeAPIConnection() {
    // Test API connection
    testAPIConnection();
}

// Test API connection
async function testAPIConnection() {
    try {
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.content, {
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

// API Helper Functions
async function apiCall(endpoint, data) {
    try {
        const response = await fetch(API_CONFIG.baseUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Database Operations using PHP API
async function saveContentToAPI(sectionId, content) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('content', sectionId, content);
        return;
    }
    
    try {
        const result = await apiCall(API_CONFIG.endpoints.content, {
            action: 'save_content',
            section_id: sectionId,
            content: content
        });
        
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

async function savePhotoToAPI(sectionId, photoData) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('photos', sectionId, photoData);
        return;
    }
    
    try {
        const result = await apiCall(API_CONFIG.endpoints.content, {
            action: 'save_photo',
            section_id: sectionId,
            photo_data: photoData
        });
        
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

async function saveBlogPostToAPI(title, content) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        saveToLocalStorage('blogs', Date.now(), { title, content });
        return;
    }
    
    try {
        const result = await apiCall(API_CONFIG.endpoints.content, {
            action: 'save_blog_post',
            title: title,
            content: content
        });
        
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

async function saveTrainingSessionToAPI(formData) {
    if (!isAPIConnected) {
        // Fallback to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('pawsitiveBookings') || '[]');
        existingBookings.push(formData);
        localStorage.setItem('pawsitiveBookings', JSON.stringify(existingBookings));
        return;
    }
    
    try {
        const result = await apiCall(API_CONFIG.endpoints.content, {
            action: 'save_training_session',
            dog_name: formData.dogName,
            breed: formData.breed,
            age: formData.age,
            training_goals: formData.trainingGoals || '',
            behavioral_issues: formData.behavioralIssues || '',
            time_slot: formData.timeSlot
        });
        
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

async function loadContentFromAPI() {
    if (!isAPIConnected) {
        loadSavedContent(); // Use existing localStorage fallback
        return;
    }
    
    try {
        // Load content
        const contentResult = await apiCall(API_CONFIG.endpoints.content, {
            action: 'get_content'
        });
        
        if (contentResult.success && contentResult.data) {
            contentResult.data.forEach(item => {
                updateSectionContent(item.section_id, item.content);
            });
        }
        
        // Load photos
        const photosResult = await apiCall(API_CONFIG.endpoints.content, {
            action: 'get_photos'
        });
        
        if (photosResult.success && photosResult.data) {
            photosResult.data.forEach(item => {
                updateSectionPhoto(item.section_id, item.photo_data);
            });
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
        const result = await apiCall(API_CONFIG.endpoints.content, {
            action: 'get_blog_posts'
        });
        
        if (result.success && result.data && result.data.length > 0) {
            updateBlogSection(result.data);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Contact Form Handler
async function submitContactForm(formData) {
    try {
        const result = await apiCall(API_CONFIG.endpoints.contact, formData);
        
        if (result.success) {
            showNotification(result.message, 'success');
            return true;
        } else {
            showNotification(result.error || 'Error sending message', 'error');
            return false;
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showNotification('Error sending message. Please try again.', 'error');
        return false;
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

// Helper function to update section content
function updateSectionContent(sectionId, content) {
    const section = document.getElementById(sectionId);
    const textContent = section?.querySelector('.text-content');
    
    if (textContent) {
        const title = textContent.querySelector('h2');
        const titleHTML = title ? title.outerHTML : '';
        const paragraphsHTML = content.split('\n\n').map(p => `<p>${p}</p>`).join('');
        textContent.innerHTML = titleHTML + paragraphsHTML;
    }
}

// Helper function to update section photo
function updateSectionPhoto(sectionId, photoData) {
    const section = document.getElementById(sectionId);
    const img = section?.querySelector('.section-image');
    
    if (img) {
        img.src = photoData;
    }
}

// Update blog section with new posts
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

// Load saved content from localStorage
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

// Export functions for use in main script
window.API_CONFIG = API_CONFIG;
window.initializeAPIConnection = initializeAPIConnection;
window.saveContentToAPI = saveContentToAPI;
window.savePhotoToAPI = savePhotoToAPI;
window.saveBlogPostToAPI = saveBlogPostToAPI;
window.saveTrainingSessionToAPI = saveTrainingSessionToAPI;
window.submitContactForm = submitContactForm;
