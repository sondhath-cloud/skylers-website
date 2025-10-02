# SiteWorks Migration Guide - Canine Coaching Website

## Overview
This guide will help you migrate your Canine Coaching website from Supabase to SiteWorks hosting with MySQL database and PHP backend.

## Prerequisites
- SiteWorks hosting account with MySQL database access
- PHP support enabled
- Access to phpMyAdmin or MySQL command line
- Basic understanding of file uploads via SiteWorks file manager

## ⚠️ CRITICAL: Follow DEPLOYMENT_CHECKLIST.md First!

**IMPORTANT:** Before proceeding, please follow the step-by-step checklist in `DEPLOYMENT_CHECKLIST.md`. This checklist is based on lessons learned from previous database projects and will save you hours of debugging time.

## Step 1: Database Setup

### 1.1 Create MySQL Database
1. Log into your SiteWorks control panel
2. Navigate to MySQL Databases
3. Create a new database named `canine_coaching`
4. Create a database user with full privileges
5. **CRITICAL:** Write down your EXACT database credentials:
   - Database Host: `localhost` (usually)
   - Database Name: `canine_coaching`
   - Username: `your_actual_username` (not placeholder)
   - Password: `your_actual_password` (not placeholder)

### 1.2 Test Database Connection FIRST
1. Upload `test-db-connection.php` to your SiteWorks `public_html` folder
2. Edit the file with your actual database credentials
3. Visit `https://yourdomain.com/test-db-connection.php` in browser
4. **VERIFY:** You see "✅ Database connection successful!"
5. **IF FAILED:** Fix credentials and try again

### 1.3 Import Database Schema
1. Open phpMyAdmin from your SiteWorks control panel
2. Select your `canine_coaching` database
3. Go to the "SQL" tab
4. Copy and paste the contents of `database-schema.sql`
5. Click "Go" to execute the SQL commands
6. **VERIFY:** All tables created successfully

## Step 2: File Upload

### 2.1 Upload Files to SiteWorks
Upload the following files to your SiteWorks `public_html` directory:

**Main Website Files:**
- `index.html`
- `styles.css`
- `script.js`
- `blog.html`
- All image files (`.jpeg`, `.png`, `.mp4`)

**PHP Backend Files:**
- `config/database.php`
- `api/content.php`
- `api/contact.php`

**Optional Files:**
- `api-config.js` (if you want to customize API settings)

### 2.2 File Structure
Your SiteWorks `public_html` should look like this:
```
public_html/
├── index.html
├── styles.css
├── script.js
├── blog.html
├── Skyler.png
├── AdobeStock_*.jpeg
├── hero-video.mp4
├── config/
│   └── database.php
└── api/
    ├── content.php
    └── contact.php
```

## Step 3: Configuration

### 3.1 Update Database Credentials
1. Open `config/database.php` in SiteWorks file manager
2. Update the database credentials:
   ```php
   const DB_HOST = 'localhost';
   const DB_NAME = 'canine_coaching';
   const DB_USER = 'your_actual_db_username';
   const DB_PASS = 'your_actual_db_password';
   ```

### 3.2 Update Email Settings
1. Open `api/contact.php` in SiteWorks file manager
2. Update the email address:
   ```php
   $to = 'your-email@yourdomain.com';
   ```

## Step 4: Testing

### 4.1 Test Database Connection
1. Visit your website
2. Open browser developer tools (F12)
3. Check the console for "Connected to PHP API" message
4. If you see "API connection failed, using localStorage fallback", check your database credentials

### 4.2 Test Contact Form
1. Fill out the contact form on your website
2. Submit the form
3. Check your email for the form submission
4. Verify the auto-reply was sent to the customer

### 4.3 Test Owner Interface
1. Click the crown icon (👑) in the bottom right corner
2. Login with credentials:
   - Username: `skyler`
   - Password: `canine2024`
3. Test editing content and uploading photos

## Step 5: Cleanup

### 5.1 Remove Old Supabase Files
You can safely delete these files:
- `supabase-config.js`
- `supabase-schema.sql`
- `SUPABASE_SETUP_GUIDE.md`

### 5.2 Optional: Remove api-config.js
If you don't need to customize API settings, you can delete `api-config.js` as the main functionality is built into `script.js`.

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `config/database.php`
- Check that MySQL is enabled on your SiteWorks account
- Ensure the database user has proper permissions

### Email Issues
- Verify PHP mail() function is enabled
- Check spam folder for test emails
- Consider using SMTP if PHP mail() doesn't work

### File Permission Issues
- Ensure PHP files have proper permissions (usually 644)
- Check that the `api` and `config` directories are accessible

### API Errors
- Check browser console for JavaScript errors
- Verify all PHP files are uploaded correctly
- Test API endpoints directly by visiting `yoursite.com/api/content.php`

## Security Considerations

### Database Security
- Use strong database passwords
- Regularly backup your database
- Keep database credentials secure

### File Security
- Set proper file permissions
- Consider adding `.htaccess` rules to protect sensitive files
- Regularly update your PHP version

### Form Security
- The contact form includes basic validation and sanitization
- Consider adding CAPTCHA for additional spam protection
- Monitor form submissions for suspicious activity

## Maintenance

### Regular Tasks
- Monitor database size and performance
- Check email delivery rates
- Update content through the owner interface
- Backup database regularly

### Updates
- Keep PHP version updated
- Monitor for security updates
- Test functionality after any hosting changes

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Verify all files are uploaded correctly
3. Test database connection independently
4. Contact SiteWorks support for hosting-specific issues

## Features Included

✅ **Content Management System**
- Edit website content through owner interface
- Upload and manage photos
- Add blog posts
- Manage testimonials

✅ **Contact Form**
- Professional email handling
- Auto-reply to customers
- Form validation and sanitization

✅ **Training Session Booking**
- Store session requests in database
- Form validation
- Email notifications

✅ **Responsive Design**
- Mobile-friendly interface
- Accessibility features
- Modern UI/UX

✅ **Database Integration**
- MySQL database storage
- PHP API backend
- localStorage fallback for reliability

Your Canine Coaching website is now fully migrated to SiteWorks hosting with a robust PHP/MySQL backend!
