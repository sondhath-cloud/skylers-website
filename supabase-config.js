// Supabase Configuration
// Replace these with your actual Supabase project details

const SUPABASE_CONFIG = {
    // You'll get these from your Supabase project settings
    url: 'https://xnvylthhrjzlfridahcz.supabase.co',  // Your Supabase URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudnlsdGhocmp6bGZyaWRhaGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODAyODksImV4cCI6MjA3NDA1NjI4OX0.rdOHMsIDj35SUqdPDrKvwEgSx2KrGs7I32cvQws_zNc'  // Your Supabase anon key
    
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
