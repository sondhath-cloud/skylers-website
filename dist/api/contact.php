<?php
// Contact form handler for SiteWorks
// This file handles the contact form submission and sends emails using PHP mail()

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$requiredFields = ['name', 'email', 'message'];
$missing = [];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: ' . implode(', ', $missing)]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(strip_tags(trim($input['name'])), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($input['phone']) ? htmlspecialchars(strip_tags(trim($input['phone'])), ENT_QUOTES, 'UTF-8') : '';
$message = htmlspecialchars(strip_tags(trim($input['message'])), ENT_QUOTES, 'UTF-8');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'hello@caninecoaching.app'; // Your email address
$subject = 'New Contact Form Submission - Canine Coaching';
$from = $email;

// Create email headers
$headers = [
    'From: ' . $name . ' <' . $from . '>',
    'Reply-To: ' . $from,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/html; charset=UTF-8'
];

// Create email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a4d3a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a4d3a; }
        .value { margin-top: 5px; }
        .footer { background: #2d5a47; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🐾 New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>" . $name . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . $email . "</div>
            </div>";
            
if (!empty($phone)) {
    $emailBody .= "
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . $phone . "</div>
            </div>";
}

$emailBody .= "
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Submitted:</div>
                <div class='value'>" . date('F j, Y \a\t g:i A') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This message was sent from the Canine Coaching website contact form.</p>
        </div>
    </div>
</body>
</html>";

// Send email
$mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Send auto-reply to customer
    $autoReplySubject = 'Thank you for contacting Canine Coaching!';
    $autoReplyBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a4d3a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { background: #2d5a47; color: white; padding: 15px; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>🐾 Thank You for Contacting Canine Coaching!</h2>
            </div>
            <div class='content'>
                <p>Hi " . $name . ",</p>
                <p>Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to explore our website to learn more about our training services and approach.</p>
                <p>Best regards,<br>Skyler<br>Canine Coaching</p>
            </div>
            <div class='footer'>
                <p>Phone: 602-469-9223 | Email: hello@caninecoaching.app</p>
            </div>
        </div>
    </body>
    </html>";
    
    $autoReplyHeaders = [
        'From: Canine Coaching <hello@caninecoaching.app>',
        'Reply-To: hello@caninecoaching.app',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    mail($email, $autoReplySubject, $autoReplyBody, implode("\r\n", $autoReplyHeaders));
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
    ]);
} else {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'error' => 'Sorry, there was an error sending your message. Please try again or contact us directly at hello@caninecoaching.app'
    ]);
}
?>
