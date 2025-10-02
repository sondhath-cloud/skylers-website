<?php
// Client Sessions API
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
    
    // Get upcoming sessions for the client
    $stmt = $pdo->prepare("
        SELECT id, session_type, session_date, session_time, location, status, notes
        FROM scheduled_sessions 
        WHERE client_id = ? AND session_date >= CURDATE() AND status = 'scheduled'
        ORDER BY session_date ASC, session_time ASC
    ");
    
    $stmt->execute([$client_id]);
    $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the response
    $formatted_sessions = array_map(function($session) {
        return [
            'id' => $session['id'],
            'type' => $session['session_type'],
            'date' => $session['session_date'],
            'time' => $session['session_time'],
            'location' => $session['location'],
            'status' => $session['status'],
            'notes' => $session['notes']
        ];
    }, $sessions);
    
    echo json_encode([
        'success' => true,
        'sessions' => $formatted_sessions
    ]);
    
} catch (Exception $e) {
    error_log('Client sessions error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}
?>
