<?php
// API endpoint for site content operations
require_once 'config/database.php';

// Set CORS headers for frontend access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests for security
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    handleError('Method not allowed', 405);
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    handleError('Invalid JSON data');
}

$action = $input['action'] ?? '';

try {
    $db = getDB();
    
    switch ($action) {
        case 'get_content':
            getContent($db, $input);
            break;
        case 'save_content':
            saveContent($db, $input);
            break;
        case 'get_photos':
            getPhotos($db, $input);
            break;
        case 'save_photo':
            savePhoto($db, $input);
            break;
        case 'get_blog_posts':
            getBlogPosts($db);
            break;
        case 'save_blog_post':
            saveBlogPost($db, $input);
            break;
        case 'get_testimonials':
            getTestimonials($db);
            break;
        case 'save_testimonial':
            saveTestimonial($db, $input);
            break;
        case 'save_training_session':
            saveTrainingSession($db, $input);
            break;
        default:
            handleError('Invalid action', 400);
    }
} catch (Exception $e) {
    handleError('Database error: ' . $e->getMessage());
}

function getContent($db, $input) {
    $sectionId = sanitizeInput($input['section_id'] ?? '');
    
    if (empty($sectionId)) {
        // Get all content
        $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['content']);
        $stmt->execute();
        $content = $stmt->fetchAll();
    } else {
        // Get specific section content
        $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['content'] . " WHERE section_id = ?");
        $stmt->execute([$sectionId]);
        $content = $stmt->fetch();
    }
    
    sendJSONResponse(['success' => true, 'data' => $content]);
}

function saveContent($db, $input) {
    $requiredFields = ['section_id', 'content'];
    $missing = validateRequiredFields($input, $requiredFields);
    
    if (!empty($missing)) {
        handleError('Missing required fields: ' . implode(', ', $missing), 400);
    }
    
    $sectionId = sanitizeInput($input['section_id']);
    $content = sanitizeInput($input['content']);
    
    $stmt = $db->prepare("
        INSERT INTO " . DatabaseConfig::TABLES['content'] . " (section_id, content) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = CURRENT_TIMESTAMP
    ");
    
    $stmt->execute([$sectionId, $content]);
    
    sendJSONResponse(['success' => true, 'message' => 'Content saved successfully']);
}

function getPhotos($db, $input) {
    $sectionId = sanitizeInput($input['section_id'] ?? '');
    
    if (empty($sectionId)) {
        // Get all photos
        $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['photos']);
        $stmt->execute();
        $photos = $stmt->fetchAll();
    } else {
        // Get specific section photo
        $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['photos'] . " WHERE section_id = ?");
        $stmt->execute([$sectionId]);
        $photos = $stmt->fetch();
    }
    
    sendJSONResponse(['success' => true, 'data' => $photos]);
}

function savePhoto($db, $input) {
    $requiredFields = ['section_id', 'photo_data'];
    $missing = validateRequiredFields($input, $requiredFields);
    
    if (!empty($missing)) {
        handleError('Missing required fields: ' . implode(', ', $missing), 400);
    }
    
    $sectionId = sanitizeInput($input['section_id']);
    $photoData = $input['photo_data']; // Don't sanitize base64 data
    
    $stmt = $db->prepare("
        INSERT INTO " . DatabaseConfig::TABLES['photos'] . " (section_id, photo_data) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE photo_data = VALUES(photo_data), updated_at = CURRENT_TIMESTAMP
    ");
    
    $stmt->execute([$sectionId, $photoData]);
    
    sendJSONResponse(['success' => true, 'message' => 'Photo saved successfully']);
}

function getBlogPosts($db) {
    $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['blogPosts'] . " ORDER BY created_at DESC");
    $stmt->execute();
    $posts = $stmt->fetchAll();
    
    sendJSONResponse(['success' => true, 'data' => $posts]);
}

function saveBlogPost($db, $input) {
    $requiredFields = ['title', 'content'];
    $missing = validateRequiredFields($input, $requiredFields);
    
    if (!empty($missing)) {
        handleError('Missing required fields: ' . implode(', ', $missing), 400);
    }
    
    $title = sanitizeInput($input['title']);
    $content = sanitizeInput($input['content']);
    
    $stmt = $db->prepare("
        INSERT INTO " . DatabaseConfig::TABLES['blogPosts'] . " (title, content) 
        VALUES (?, ?)
    ");
    
    $stmt->execute([$title, $content]);
    
    sendJSONResponse(['success' => true, 'message' => 'Blog post saved successfully']);
}

function getTestimonials($db) {
    $stmt = $db->prepare("SELECT * FROM " . DatabaseConfig::TABLES['testimonials'] . " ORDER BY created_at DESC");
    $stmt->execute();
    $testimonials = $stmt->fetchAll();
    
    sendJSONResponse(['success' => true, 'data' => $testimonials]);
}

function saveTestimonial($db, $input) {
    $requiredFields = ['name', 'testimonial'];
    $missing = validateRequiredFields($input, $requiredFields);
    
    if (!empty($missing)) {
        handleError('Missing required fields: ' . implode(', ', $missing), 400);
    }
    
    $name = sanitizeInput($input['name']);
    $testimonial = sanitizeInput($input['testimonial']);
    $rating = isset($input['rating']) ? (int)$input['rating'] : null;
    
    $stmt = $db->prepare("
        INSERT INTO " . DatabaseConfig::TABLES['testimonials'] . " (name, testimonial, rating) 
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([$name, $testimonial, $rating]);
    
    sendJSONResponse(['success' => true, 'message' => 'Testimonial saved successfully']);
}

function saveTrainingSession($db, $input) {
    $requiredFields = ['dog_name', 'breed', 'age', 'time_slot'];
    $missing = validateRequiredFields($input, $requiredFields);
    
    if (!empty($missing)) {
        handleError('Missing required fields: ' . implode(', ', $missing), 400);
    }
    
    $dogName = sanitizeInput($input['dog_name']);
    $breed = sanitizeInput($input['breed']);
    $age = sanitizeInput($input['age']);
    $trainingGoals = sanitizeInput($input['training_goals'] ?? '');
    $behavioralIssues = sanitizeInput($input['behavioral_issues'] ?? '');
    $timeSlot = sanitizeInput($input['time_slot']);
    
    $stmt = $db->prepare("
        INSERT INTO " . DatabaseConfig::TABLES['sessions'] . " 
        (dog_name, breed, age, training_goals, behavioral_issues, time_slot) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$dogName, $breed, $age, $trainingGoals, $behavioralIssues, $timeSlot]);
    
    sendJSONResponse(['success' => true, 'message' => 'Training session request saved successfully']);
}
?>
