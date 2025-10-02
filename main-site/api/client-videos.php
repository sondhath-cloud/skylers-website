<?php
// Client Videos API
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
    
    // Get videos for the client
    $stmt = $pdo->prepare("
        SELECT id, title, description, file_path, upload_date, session_date, duration
        FROM progress_videos 
        WHERE client_id = ? 
        ORDER BY upload_date DESC
    ");
    
    $stmt->execute([$client_id]);
    $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the response
    $formatted_videos = array_map(function($video) {
        return [
            'id' => $video['id'],
            'title' => $video['title'],
            'description' => $video['description'],
            'filePath' => $video['file_path'],
            'uploadDate' => $video['upload_date'],
            'sessionDate' => $video['session_date'],
            'duration' => $video['duration']
        ];
    }, $videos);
    
    echo json_encode([
        'success' => true,
        'videos' => $formatted_videos
    ]);
    
} catch (Exception $e) {
    error_log('Client videos error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}
?>
