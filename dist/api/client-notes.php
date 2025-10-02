<?php
// Client Notes API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    if (!isset($_GET['clientId']) || empty($_GET['clientId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Client ID is required']);
        exit;
    }
    
    $client_id = (int)$_GET['clientId'];
    
    // Get training notes for the client
    $stmt = $pdo->prepare("
        SELECT id, title, content, session_date, created_at
        FROM training_notes 
        WHERE client_id = ? 
        ORDER BY created_at DESC
    ");
    
    $stmt->execute([$client_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the response
    $formatted_notes = array_map(function($note) {
        return [
            'id' => $note['id'],
            'title' => $note['title'],
            'content' => $note['content'],
            'sessionDate' => $note['session_date'],
            'date' => $note['created_at']
        ];
    }, $notes);
    
    echo json_encode([
        'success' => true,
        'notes' => $formatted_notes
    ]);
    
} catch (Exception $e) {
    error_log('Client notes error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}
?>
