# 🚨 CRITICAL DEPLOYMENT CHECKLIST
## Based on Lessons Learned from Previous Database Projects

### ⚠️ **DO NOT SKIP ANY STEP - Each step prevents hours of debugging!**

---

## **PHASE 1: DATABASE SETUP (MUST DO FIRST)**

### ✅ **Step 1: Get Database Credentials**
- [ ] Log into SiteWorks control panel
- [ ] Navigate to MySQL Databases
- [ ] Create database named `canine_coaching`
- [ ] Create database user with full privileges
- [ ] **WRITE DOWN EXACTLY:**
  - Database Host: `localhost` (usually)
  - Database Name: `canine_coaching`
  - Username: `your_actual_username`
  - Password: `your_actual_password`

### ✅ **Step 2: Test Database Connection**
- [ ] Upload `test-db-connection.php` to your SiteWorks `public_html` folder
- [ ] Edit `test-db-connection.php` with your actual credentials
- [ ] Visit `https://yourdomain.com/test-db-connection.php` in browser
- [ ] **VERIFY:** You see "✅ Database connection successful!"
- [ ] **IF FAILED:** Fix credentials and try again

### ✅ **Step 3: Create Database Tables**
- [ ] Open phpMyAdmin from SiteWorks control panel
- [ ] Select your `canine_coaching` database
- [ ] Go to SQL tab
- [ ] Copy and paste contents of `database-schema.sql`
- [ ] Click "Go" to execute
- [ ] **VERIFY:** All tables created successfully

### ✅ **Step 4: Verify Sample Data**
- [ ] Refresh `test-db-connection.php` page
- [ ] **VERIFY:** You see sample data for all tables
- [ ] **IF MISSING:** Re-run database-schema.sql

---

## **PHASE 2: API SETUP**

### ✅ **Step 5: Update API Configuration**
- [ ] Edit `config/database.php`
- [ ] Replace `your_db_username` with actual username
- [ ] Replace `your_db_password` with actual password
- [ ] **DOUBLE-CHECK:** Every character is correct

### ✅ **Step 6: Test API Endpoints**
- [ ] Upload `test-api.php` to your SiteWorks `public_html` folder
- [ ] Visit `https://yourdomain.com/test-api.php` in browser
- [ ] **VERIFY:** You see "✅ Database connection successful"
- [ ] **VERIFY:** All tables show data

### ✅ **Step 7: Test Direct API Calls**
- [ ] Visit `https://yourdomain.com/api/content.php` directly
- [ ] **EXPECTED:** JSON response like `{"success":true,"data":[...]}`
- [ ] **NOT EXPECTED:** PHP errors, blank pages, or HTML
- [ ] **IF FAILED:** Check file paths and PHP errors

---

## **PHASE 3: FILE STRUCTURE VERIFICATION**

### ✅ **Step 8: Verify File Locations**
Your SiteWorks `public_html` should look like this:
```
public_html/
├── index.html
├── styles.css
├── script.js
├── test-db-connection.php
├── test-api.php
├── config/
│   └── database.php
└── api/
    ├── content.php
    └── contact.php
```

### ✅ **Step 9: Test Domain Resolution**
- [ ] Test both `www.yourdomain.com` and `yourdomain.com`
- [ ] **NOTE:** Which one works? Update all code to use the working version
- [ ] **IF NEITHER WORKS:** Check DNS settings

---

## **PHASE 4: FRONTEND INTEGRATION**

### ✅ **Step 10: Test Website**
- [ ] Visit your main website
- [ ] Open browser developer tools (F12)
- [ ] Check Console tab for errors
- [ ] **EXPECTED:** "Connected to PHP API" message
- [ ] **NOT EXPECTED:** JavaScript errors or API failures

### ✅ **Step 11: Test Contact Form**
- [ ] Fill out contact form
- [ ] Submit form
- [ ] **VERIFY:** Success message appears
- [ ] **VERIFY:** Email received
- [ ] **VERIFY:** Auto-reply sent to customer

### ✅ **Step 12: Test Owner Interface**
- [ ] Click crown icon (👑) in bottom right
- [ ] Login with: username `skyler`, password `canine2024`
- [ ] **VERIFY:** Owner toolbar appears
- [ ] **VERIFY:** Can edit content sections
- [ ] **VERIFY:** Can upload photos

---

## **PHASE 5: CLEANUP**

### ✅ **Step 13: Remove Test Files**
- [ ] Delete `test-db-connection.php` (security risk)
- [ ] Delete `test-api.php` (security risk)
- [ ] **KEEP:** All other files

### ✅ **Step 14: Final Verification**
- [ ] Test all website functionality
- [ ] Verify database operations work
- [ ] Check email delivery
- [ ] Test on mobile devices

---

## **🚨 CRITICAL SUCCESS FACTORS**

### **Database Credentials Are Paramount**
- ❌ **NEVER** assume credentials are correct
- ✅ **ALWAYS** test with simple script first
- ✅ **VERIFY** every character: host, database name, username, password

### **Database Must Exist Before API Calls**
- ❌ **NEVER** build APIs before database is ready
- ✅ **ALWAYS** create database and tables first
- ✅ **TEST** with simple SELECT query before complex APIs

### **File Paths Matter**
- ❌ **NEVER** assume files are in correct locations
- ✅ **ALWAYS** test file locations with direct URL access
- ✅ **VERIFY** relative paths work from calling file's location

### **Direct API Testing is Essential**
- ❌ **NEVER** rely only on JavaScript for debugging
- ✅ **ALWAYS** visit API URLs directly in browser
- ✅ **LOOK** for PHP errors, blank pages, or valid JSON

---

## **🔧 TROUBLESHOOTING GUIDE**

### **Database Connection Failed**
1. Check credentials in SiteWorks control panel
2. Verify database name exists
3. Confirm username has proper permissions
4. Check if MySQL is enabled

### **API Returns Errors**
1. Visit API URL directly in browser
2. Check for PHP errors in response
3. Verify file paths are correct
4. Test database connection separately

### **JavaScript Errors**
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify API endpoints return valid JSON

### **Domain Issues**
1. Test both www and non-www versions
2. Check DNS settings
3. Verify SSL certificate is working
4. Test from different devices/networks

---

## **📞 SUPPORT ESCALATION**

If you're stuck after following this checklist:
1. Document specific error messages
2. Provide URLs and steps to reproduce
3. Include browser console errors
4. Contact SiteWorks support with details

**Remember:** Most issues are solved by following this checklist step-by-step!
