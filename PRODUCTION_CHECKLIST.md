# Nexus Global - Production Deployment Checklist

Use this checklist to ensure your application is production-ready before deployment.

## ✅ Pre-Deployment (Before Build)

### Code & Security
- [ ] All environment variables configured in `.env`
- [ ] Removed sensitive data from codebase (API keys, passwords)
- [ ] Changed default admin password from `admin123`
- [ ] JWT_SECRET is a strong random string (32+ characters)
- [ ] Database password is strong (12+ characters with mixed case)
- [ ] No console.log() or debugging code left in production files
- [ ] All dependencies are up-to-date (`pnpm audit`)

### Configuration
- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` has placeholder values only
- [ ] `.gitignore` includes `.env`, `dist/`, `node_modules/`, `logs/`
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` set to appropriate value (8080 or higher)
- [ ] `APP_URL` points to correct domain
- [ ] `API_URL` points to correct API endpoint

### Database
- [ ] MySQL database created
- [ ] Database schema imported (`database/schema.sql`)
- [ ] Database user has limited privileges (not root)
- [ ] Database user password is strong
- [ ] Database backups configured
- [ ] Connection string in `.env` is correct

### Build
- [ ] No build errors: `pnpm build`
- [ ] No TypeScript errors: `pnpm typecheck`
- [ ] No ESLint warnings: `pnpm lint` (if available)
- [ ] Build output is under 1MB per bundle

---

## ✅ Deployment Setup

### Server Requirements
- [ ] Node.js 14+ installed on server
- [ ] MySQL 5.7+ installed on server
- [ ] pnpm or npm available
- [ ] PM2 installed globally (or will be installed)
- [ ] SSH access to server configured
- [ ] FTP/SFTP access working
- [ ] Enough disk space (min 500MB)
- [ ] Enough RAM (min 512MB recommended)

### cPanel Specific
- [ ] cPanel account created
- [ ] MySQL database quota available
- [ ] Node.js application support enabled
- [ ] AutoSSL certificate available
- [ ] Disk space allocated
- [ ] Email account configured (for notifications)

### Domain & DNS
- [ ] Domain registered
- [ ] DNS pointing to correct host
- [ ] Domain SSL/HTTPS enabled
- [ ] CNAME records configured (if needed)
- [ ] Email MX records configured (if using email)

---

## ✅ Deployment Process

### Upload Files
- [ ] All project files uploaded to server
- [ ] File permissions are correct (644 for files, 755 for dirs)
- [ ] `.env` file uploaded (NOT via git)
- [ ] `node_modules/` NOT uploaded (will install on server)
- [ ] `dist/` NOT uploaded (will build on server)

### Install Dependencies
- [ ] SSH connected to server
- [ ] Navigated to project directory
- [ ] Ran `pnpm install` successfully
- [ ] All dependencies installed without errors
- [ ] `pnpm-lock.yaml` created

### Build Application
- [ ] Ran `pnpm build` successfully
- [ ] No build errors in output
- [ ] `dist/` folder created with content
- [ ] Build time under 5 minutes

### Setup Application
- [ ] PM2 configuration (`ecosystem.config.js`) in place
- [ ] `logs/` directory created
- [ ] PM2 application started: `pm2 start ecosystem.config.js`
- [ ] PM2 configured to start on reboot: `pm2 startup`
- [ ] Application status is running: `pm2 status`

### Verify Database
- [ ] Can connect to MySQL: `mysql -u user -p -h host dbname`
- [ ] All tables exist: `SHOW TABLES;`
- [ ] Admin user exists: `SELECT * FROM admins;`
- [ ] Database contains seed data

---

## ✅ Post-Deployment Testing

### Application Access
- [ ] Homepage loads at domain URL
- [ ] Can access `/admin` page
- [ ] Can login with admin credentials
- [ ] All pages load without 404 errors
- [ ] Navigation links work correctly

### Functionality Testing
- [ ] Can create a new shipment (Admin)
- [ ] Can view all packages (Admin)
- [ ] Can track package with `NEX1234567890`
- [ ] Can see tracking history and ETA
- [ ] Chat widget appears on pages
- [ ] Language selector works (English, French, Spanish)
- [ ] Admin dashboard shows statistics

### API Testing
```bash
# Test API endpoints
curl https://yourdomain.com/api/ping

# Should return: {"message":"pong"}

# Test tracking
curl https://yourdomain.com/api/packages/track/NEX1234567890
```

### Security Testing
- [ ] HTTPS/SSL certificate valid
- [ ] Secure headers present:
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security
- [ ] Admin panel requires authentication
- [ ] Cannot access admin without login
- [ ] Can logout from admin
- [ ] No errors in browser console

### Performance Testing
- [ ] Page loads in under 3 seconds
- [ ] Admin dashboard responds quickly
- [ ] Database queries are fast
- [ ] No memory leaks: `pm2 monit`

### Browser Compatibility
- [ ] Works on Chrome/Edge
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Responsive on mobile
- [ ] Responsive on tablet

---

## ✅ Monitoring & Maintenance

### Logging & Monitoring
- [ ] PM2 logs configured: `pm2 logs`
- [ ] Application logs accessible
- [ ] Error logging working
- [ ] Database slow query log enabled
- [ ] Server monitoring setup (Cloudwatch, New Relic, etc.)

### Backups
- [ ] Database backup scheduled daily
- [ ] Files backup scheduled weekly
- [ ] Backup storage location configured
- [ ] Tested backup restore process
- [ ] Backup retention policy set (e.g., 30 days)

### Updates
- [ ] Security updates planned
- [ ] Process for testing updates
- [ ] Backup before updates
- [ ] Update schedule documented

---

## ✅ Documentation

### For Admins
- [ ] Admin credentials documented (securely)
- [ ] Default packages documented
- [ ] How to create shipments documented
- [ ] How to update package status documented
- [ ] Troubleshooting guide available

### For Users
- [ ] Homepage has all necessary information
- [ ] Tracking instructions clear
- [ ] Contact information visible
- [ ] FAQ available (if applicable)
- [ ] Help/Support page available

### For Developers
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment instructions documented
- [ ] Troubleshooting guide for deployment

---

## ✅ Final Checks

### Performance
- [ ] Google PageSpeed score > 80
- [ ] Database has proper indexes
- [ ] Static assets cached
- [ ] Gzip compression enabled
- [ ] Images optimized

### Security
- [ ] No hardcoded passwords in code
- [ ] No API keys exposed
- [ ] Dependencies scanned for vulnerabilities
- [ ] SQL injection prevention implemented
- [ ] XSS prevention implemented
- [ ] CSRF tokens in forms
- [ ] Input validation on all forms

### Compliance
- [ ] Privacy policy available
- [ ] Terms of service available
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy documented
- [ ] Cookies policy disclosed

---

## 📋 Sign-Off

- **Prepared By:** _________________ **Date:** _________
- **Reviewed By:** _________________ **Date:** _________
- **Approved By:** _________________ **Date:** _________
- **Deployed By:** _________________ **Date:** _________

---

## 🚨 Issues Found

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| | | | |
| | | | |
| | | | |

---

## 📞 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Server Admin | | | |
| Database Admin | | | |
| App Owner | | | |

---

## 🔄 Post-Launch Monitoring

### Week 1
- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Verify backups running
- [ ] Test admin functions
- [ ] Monitor user feedback

### Month 1
- [ ] Review analytics
- [ ] Check database size growth
- [ ] Verify backup integrity
- [ ] Update documentation based on findings
- [ ] Plan for next updates

### Ongoing
- [ ] Monthly security updates
- [ ] Quarterly full system review
- [ ] Yearly disaster recovery test
- [ ] Continuous performance monitoring

---

**Important:** Keep this checklist for your records and refer to it during any future deployments.
