<?php
// Minimal API test - just return JSON
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    // Test basic functionality
    $response = [
        'success' => true,
        'message' => 'Minimal API test successful',
        'timestamp' => date('Y-m-d H:i:s'),
        'php_version' => phpversion()
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
