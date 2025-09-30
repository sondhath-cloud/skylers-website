<?php
// Very simple test to check PHP and basic functionality
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Simple PHP Test</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";

// Test file inclusion
echo "<p>Testing file inclusion...</p>";
if (file_exists('config/database.php')) {
    echo "<p>✅ config/database.php exists</p>";
} else {
    echo "<p>❌ config/database.php not found</p>";
}

if (file_exists('api/content.php')) {
    echo "<p>✅ api/content.php exists</p>";
} else {
    echo "<p>❌ api/content.php not found</p>";
}

// Test basic database connection
echo "<p>Testing database connection...</p>";
try {
    require_once 'config/database.php';
    echo "<p>✅ Config loaded</p>";
    
    $db = getDB();
    echo "<p>✅ Database connected</p>";
    
    $stmt = $db->query("SELECT 1 as test");
    $result = $stmt->fetch();
    echo "<p>✅ Query successful: " . $result['test'] . "</p>";
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
    echo "<p>Error details: " . print_r($e, true) . "</p>";
}

echo "<hr>";
echo "<p><strong>If you see all green checkmarks, PHP is working fine.</strong></p>";
echo "<p><strong>If you see any red X's, that's the problem.</strong></p>";
?>
