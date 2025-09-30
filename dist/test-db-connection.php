<?php
// Database Connection Test Script
// Use this to verify your database credentials work BEFORE building the full API
// Visit this file directly in your browser: https://yourdomain.com/test-db-connection.php

// Database credentials - UPDATED WITH ACTUAL SITEWORKS CREDENTIALS
$host = 'localhost';
$dbname = 'sondraha_skylers-site';
$username = 'sondraha_skylers-site';
$password = 'GwDsY5M7jX6xRRYmkgtT';

echo "<h2>Database Connection Test</h2>";
echo "<p>Testing connection to: <strong>$host</strong></p>";
echo "<p>Database: <strong>$dbname</strong></p>";
echo "<p>Username: <strong>$username</strong></p>";
echo "<hr>";

try {
    // Test database connection
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "<p style='color: green; font-weight: bold;'>✅ Database connection successful!</p>";
    
    // Test if tables exist
    $tables = ['site_content', 'site_photos', 'blog_posts', 'testimonials', 'training_sessions'];
    
    echo "<h3>Table Verification:</h3>";
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch();
            echo "<p style='color: green;'>✅ Table '$table' exists with {$result['count']} records</p>";
        } catch (PDOException $e) {
            echo "<p style='color: red;'>❌ Table '$table' missing or error: " . $e->getMessage() . "</p>";
        }
    }
    
    // Test sample query
    echo "<h3>Sample Data Test:</h3>";
    try {
        $stmt = $pdo->query("SELECT section_id, LEFT(content, 50) as preview FROM site_content LIMIT 3");
        $results = $stmt->fetchAll();
        
        if (count($results) > 0) {
            echo "<p style='color: green;'>✅ Sample data found:</p>";
            echo "<ul>";
            foreach ($results as $row) {
                echo "<li><strong>{$row['section_id']}:</strong> " . htmlspecialchars($row['preview']) . "...</li>";
            }
            echo "</ul>";
        } else {
            echo "<p style='color: orange;'>⚠️ No sample data found. Run the database-schema.sql script to insert sample data.</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: red;'>❌ Sample query failed: " . $e->getMessage() . "</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Database connection failed!</p>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "<p><strong>Possible solutions:</strong></p>";
    echo "<ul>";
    echo "<li>Check your database credentials in SiteWorks control panel</li>";
    echo "<li>Verify the database name exists</li>";
    echo "<li>Confirm the username has proper permissions</li>";
    echo "<li>Check if MySQL is enabled on your hosting</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><strong>Next steps:</strong></p>";
echo "<ol>";
echo "<li>If connection failed: Fix credentials and try again</li>";
echo "<li>If connection succeeded: Delete this test file and proceed with API setup</li>";
echo "<li>If tables are missing: Run database-schema.sql in phpMyAdmin</li>";
echo "</ol>";
?>
