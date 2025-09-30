<?php
// Database Configuration for SiteWorks
// Update these values with your actual SiteWorks database credentials

class DatabaseConfig {
    // Database connection settings - UPDATED WITH ACTUAL SITEWORKS CREDENTIALS
    const DB_HOST = 'localhost';
    const DB_NAME = 'sondraha_skylers-site';
    const DB_USER = 'sondraha_skylers-site';
    const DB_PASS = 'GwDsY5M7jX6xRRYmkgtT';
    const DB_CHARSET = 'utf8mb4';
    
    // Table names
    const TABLES = [
        'content' => 'site_content',
        'photos' => 'site_photos',
        'blogPosts' => 'blog_posts',
        'testimonials' => 'testimonials',
        'sessions' => 'training_sessions'
    ];
}

class DatabaseConnection {
    private static $instance = null;
    private $pdo;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DatabaseConfig::DB_HOST . 
                   ";dbname=" . DatabaseConfig::DB_NAME . 
                   ";charset=" . DatabaseConfig::DB_CHARSET;
            
            $this->pdo = new PDO($dsn, DatabaseConfig::DB_USER, DatabaseConfig::DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->pdo;
    }
}

// Utility function to get database connection
function getDB() {
    return DatabaseConnection::getInstance()->getConnection();
}

// Utility function to send JSON response
function sendJSONResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Utility function to handle errors
function handleError($message, $status = 500) {
    sendJSONResponse(['error' => $message], $status);
}

// Utility function to sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Utility function to validate required fields
function validateRequiredFields($data, $requiredFields) {
    $missing = [];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing[] = $field;
        }
    }
    return $missing;
}
?>
