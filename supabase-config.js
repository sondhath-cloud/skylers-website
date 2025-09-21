// Supabase Configuration
// Replace these with your actual Supabase project details

const SUPABASE_CONFIG = {
    // You'll get these from your Supabase project settings
    url: 'https://your-project-ref.supabase.co',  // Replace with your Supabase URL
    anonKey: 'your-anon-key-here',                // Replace with your Supabase anon key
    
    // Database table names
    tables: {
        content: 'site_content',
        photos: 'site_photos', 
        blogPosts: 'blog_posts',
        testimonials: 'testimonials'
    }
};

// Initialize Supabase client
let supabase = null;

function initializeSupabase() {
    if (SUPABASE_CONFIG.url.includes('your-project-ref') || SUPABASE_CONFIG.anonKey.includes('your-anon-key')) {
        console.warn('Supabase not configured yet. Using localStorage fallback.');
        return false;
    }
    
    try {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return false;
    }
}

// Export for use in main script
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initializeSupabase = initializeSupabase;
