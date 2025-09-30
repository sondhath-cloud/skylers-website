<?php
// Simple API Test Script
// Test your API endpoints directly in the browser
// Visit: https://yourdomain.com/test-api.php

require_once 'config/database.php';

echo "<h2>API Endpoint Tests</h2>";
echo "<p>Testing API endpoints directly...</p>";
echo "<hr>";

try {
    $db = getDB();
    echo "<p style='color: green;'>✅ Database connection successful</p>";
    
    // Test 1: Get all content
    echo "<h3>Test 1: Get All Content</h3>";
    $stmt = $db->query("SELECT section_id, LEFT(content, 100) as preview FROM site_content");
    $content = $stmt->fetchAll();
    
    if (count($content) > 0) {
        echo "<p style='color: green;'>✅ Content found: " . count($content) . " sections</p>";
        echo "<ul>";
        foreach ($content as $item) {
            echo "<li><strong>{$item['section_id']}:</strong> " . htmlspecialchars($item['preview']) . "...</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ No content found</p>";
    }
    
    // Test 2: Get blog posts
    echo "<h3>Test 2: Get Blog Posts</h3>";
    $stmt = $db->query("SELECT title, LEFT(content, 100) as preview FROM blog_posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();
    
    if (count($posts) > 0) {
        echo "<p style='color: green;'>✅ Blog posts found: " . count($posts) . " posts</p>";
        echo "<ul>";
        foreach ($posts as $post) {
            echo "<li><strong>{$post['title']}:</strong> " . htmlspecialchars($post['preview']) . "...</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ No blog posts found</p>";
    }
    
    // Test 3: Get testimonials
    echo "<h3>Test 3: Get Testimonials</h3>";
    $stmt = $db->query("SELECT name, LEFT(testimonial, 100) as preview, rating FROM testimonials ORDER BY created_at DESC");
    $testimonials = $stmt->fetchAll();
    
    if (count($testimonials) > 0) {
        echo "<p style='color: green;'>✅ Testimonials found: " . count($testimonials) . " testimonials</p>";
        echo "<ul>";
        foreach ($testimonials as $testimonial) {
            echo "<li><strong>{$testimonial['name']}</strong> ({$testimonial['rating']} stars): " . htmlspecialchars($testimonial['preview']) . "...</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ No testimonials found</p>";
    }
    
    // Test 4: Test API endpoint directly
    echo "<h3>Test 4: API Endpoint Test</h3>";
    echo "<p>Testing API endpoint: <a href='api/content.php' target='_blank'>api/content.php</a></p>";
    echo "<p><strong>Note:</strong> Click the link above to test the actual API endpoint. You should see JSON data, not a webpage.</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Test failed: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h3>Manual API Tests</h3>";
echo "<p>Test these URLs directly in your browser:</p>";
echo "<ul>";
echo "<li><a href='api/content.php' target='_blank'>api/content.php</a> - Should return JSON</li>";
echo "<li><a href='api/contact.php' target='_blank'>api/contact.php</a> - Should return error (POST only)</li>";
echo "</ul>";

echo "<p><strong>Expected Results:</strong></p>";
echo "<ul>";
echo "<li>✅ JSON response with success/data fields</li>";
echo "<li>❌ PHP errors or blank pages</li>";
echo "<li>❌ HTML error pages</li>";
echo "</ul>";
?>
