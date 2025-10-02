<?php
// Client Info API
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
    
    // Get client information
    $stmt = $pdo->prepare("
        SELECT name, email, dog_name, dog_breed, dog_age, training_goals
        FROM clients 
        WHERE id = ?
    ");
    
    $stmt->execute([$client_id]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$client) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Client not found']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'name' => $client['name'],
        'email' => $client['email'],
        'dogName' => $client['dog_name'],
        'dogBreed' => $client['dog_breed'],
        'dogAge' => $client['dog_age'],
        'trainingGoals' => $client['training_goals']
    ]);
    
} catch (Exception $e) {
    error_log('Client info error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}
?>
