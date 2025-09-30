<?php
// Simple API Debug Script
// This will help us identify what's causing the 500 error

echo "<h2>API Debug Test</h2>";
echo "<p>Testing step by step...</p>";
echo "<hr>";

// Step 1: Test basic PHP
echo "<p>✅ Step 1: PHP is working</p>";

// Step 2: Test file inclusion
echo "<p>Step 2: Testing config file inclusion...</p>";
try {
    require_once 'config/database.php';
    echo "<p>✅ Step 2: Config file loaded successfully</p>";
} catch (Exception $e) {
    echo "<p>❌ Step 2: Config file error: " . $e->getMessage() . "</p>";
    exit;
}

// Step 3: Test database connection
echo "<p>Step 3: Testing database connection...</p>";
try {
    $db = getDB();
    echo "<p>✅ Step 3: Database connection successful</p>";
} catch (Exception $e) {
    echo "<p>❌ Step 3: Database connection error: " . $e->getMessage() . "</p>";
    exit;
}

// Step 4: Test simple query
echo "<p>Step 4: Testing simple database query...</p>";
try {
    $stmt = $db->query("SELECT COUNT(*) as count FROM site_content");
    $result = $stmt->fetch();
    echo "<p>✅ Step 4: Query successful - Found {$result['count']} content records</p>";
} catch (Exception $e) {
    echo "<p>❌ Step 4: Query error: " . $e->getMessage() . "</p>";
    exit;
}

// Step 5: Test JSON response
echo "<p>Step 5: Testing JSON response...</p>";
try {
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Debug test completed successfully']);
} catch (Exception $e) {
    echo "<p>❌ Step 5: JSON error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><strong>If you see all green checkmarks above, the issue is in the main API file.</strong></p>";
echo "<p><strong>If you see any red X's, that's where the problem is.</strong></p>";
?>
