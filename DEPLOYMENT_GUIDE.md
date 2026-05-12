# Nexus Global Parcel Services - cPanel Deployment Guide

## Table of Contents
1. [Pre-Deployment Requirements](#pre-deployment-requirements)
2. [Step-by-Step cPanel Setup](#step-by-step-cpanel-setup)
3. [Database Configuration](#database-configuration)
4. [Application Deployment](#application-deployment)
5. [Troubleshooting](#troubleshooting)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Pre-Deployment Requirements

### What You'll Need:
- Active cPanel hosting account with Node.js support
- SSH access to your cPanel server
- FTP or File Manager access
- Domain name pointing to your hosting
- MySQL database access
- Text editor (VS Code, Sublime, etc.)

### Check Your Hosting Environment:
```bash
# Login via SSH and check Node.js availability
node --version
npm --version
pnpm --version  # or npm install -g pnpm
```

If Node.js is not installed, contact your hosting provider to enable it.

---

## Step-by-Step cPanel Setup

### 1. **Access cPanel**
   - Log in to your cPanel account
   - URL: `https://yourdomain.com:2083` or provided by hosting provider
   - Use your cPanel username and password

### 2. **Create MySQL Database**

#### Via cPanel Dashboard:
1. Go to **Databases** → **MySQL Databases**
2. Create a new database:
   - **Database Name:** `nexus_global_parcel`
   - Click **Create Database**

3. Create a database user:
   - Go to **MySQL Databases**
   - Scroll to **MySQL Users** section
   - Create new user:
     - **Username:** `nexus_user` (or `cpaneluser_nexus`)
     - **Password:** Create a strong password (save it!)
     - Click **Create User**

4. Add user to database:
   - Scroll to **Add User to Database**
   - Select the user and database
   - Check **All Privileges**
   - Click **Add User to Database**

#### Via SSH (Alternative):
```bash
# Connect via SSH
ssh your_cpanel_user@yourdomain.com

# Login to MySQL
mysql -u root -p

# Inside MySQL prompt:
CREATE DATABASE nexus_global_parcel;
CREATE USER 'nexus_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON nexus_global_parcel.* TO 'nexus_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. **Import Database Schema**

#### Via cPanel phpMyAdmin:
1. Log in to phpMyAdmin from cPanel
2. Select your `nexus_global_parcel` database
3. Click the **Import** tab
4. Choose the `database/schema.sql` file
5. Click **Go**

#### Via SSH:
```bash
mysql -u nexus_user -p nexus_global_parcel < database/schema.sql
# Enter password when prompted
```

---

## Application Deployment

### 4. **Upload Application Files**

#### Option A: Using FTP
1. Use FileZilla or your preferred FTP client
2. Connect to `yourdomain.com` with your FTP credentials
3. Navigate to `public_html` directory
4. Upload all project files:
   ```
   - client/
   - server/
   - shared/
   - database/
   - package.json
   - pnpm-lock.yaml
   - .env.example
   - tsconfig.json
   - vite.config.ts
   - vite.config.server.ts
   ```

#### Option B: Using Git (Recommended)
```bash
# SSH into your server
ssh your_cpanel_user@yourdomain.com

# Navigate to public_html
cd public_html

# Clone the repository (if hosted on GitHub)
git clone https://github.com/yourusername/nexus-parcel.git .

# Or if already uploaded, just navigate
cd /home/your_cpanel_user/public_html
```

### 5. **Configure Environment Variables**

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```bash
nano .env
```

3. Update these critical values:
```
NODE_ENV=production
PORT=8080

DB_HOST=localhost
DB_USER=nexus_user
DB_PASSWORD=your_secure_password_here
DB_NAME=nexus_global_parcel
DB_PORT=3306

APP_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

JWT_SECRET=generate_random_string_here_use_head_urandom_1024
ADMIN_USER=admin
ADMIN_PASSWORD=change_this_secure_password
```

4. Generate a strong JWT secret:
```bash
# Via SSH
openssl rand -base64 32
# Copy the output to JWT_SECRET in .env
```

### 6. **Install Dependencies**

```bash
# Navigate to project directory
cd /home/your_cpanel_user/public_html

# Install dependencies using pnpm (recommended) or npm
pnpm install

# Or if using npm:
npm install
```

### 7. **Build the Application**

```bash
# Build both client and server
pnpm build

# Or with npm:
npm run build

# This creates dist/ folder with optimized files
```

### 8. **Set Up Node.js Application in cPanel**

#### Via cPanel Setup Node.js App:
1. Log in to cPanel
2. Go to **Setup Node.js App**
3. Click **Create Application**
4. Configure:
   - **Node.js Version:** Latest stable (14+)
   - **Application Root:** `/public_html` or `/public_html/yourdomain`
   - **Application Startup File:** `dist/server/index.js`
   - **Application URL:** `https://yourdomain.com`
   - **Port:** `8080` (or available port suggested by cPanel)

5. Click **Create**
6. cPanel will show a startup command - keep it for reference

#### Via SSH (Manual Setup):
```bash
# Create an ecosystem.config.js file for PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'nexus-parcel',
    script: './dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Install PM2 globally (if not already installed)
npm install -g pm2

# Start the application with PM2
pm2 start ecosystem.config.js

# Make PM2 start on reboot
pm2 startup
pm2 save
```

### 9. **Configure Web Server (Apache/Nginx)**

The application will be served through Node.js. Ensure your domain's DNS records point to your hosting server.

#### For Apache with Proxy (cPanel does this automatically):
Your cPanel Node.js setup creates an Apache proxy configuration.

#### Verify Port Forwarding:
```bash
# Check if application is running
curl http://localhost:8080

# You should see HTML response
```

---

## Database Configuration

### Update Server Routes for MySQL

The backend routes need to connect to MySQL. Update `server/index.ts`:

```typescript
// Add MySQL connection (you'll need to install mysql2)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export for use in routes
export { pool };
```

### Install MySQL Package:
```bash
pnpm add mysql2
# or
npm install mysql2
```

---

## Admin Portal Access

### Access the Admin Portal:
1. **URL:** `https://yourdomain.com/admin`
2. **Default Credentials:**
   - Username: `admin`
   - Password: `admin123`
3. **Change these immediately after login!**

### Update Admin Password:
1. Log in to phpMyAdmin or MySQL
2. Update the admin password:
```sql
UPDATE admins SET password=MD5('new_secure_password') WHERE username='admin';
```

---

## SSL Certificate

### Enable HTTPS (Free with cPanel)
1. Log in to cPanel
2. Go to **AutoSSL**
3. Click **Install**
4. Certificate will be auto-installed on your domain

### Redirect HTTP to HTTPS:
Create/update `.htaccess` in `public_html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## Troubleshooting

### Application Not Starting

1. **Check Node.js Application Status:**
```bash
pm2 status
pm2 logs nexus-parcel
```

2. **Check Server Logs:**
```bash
# SSH to server
tail -f /home/your_cpanel_user/public_html/logs/err.log
tail -f /home/your_cpanel_user/public_html/logs/out.log
```

3. **Test Port Manually:**
```bash
curl http://localhost:8080/api/ping
```

### Database Connection Issues

1. **Verify Credentials:**
```bash
mysql -u nexus_user -p nexus_global_parcel
```

2. **Check if Database Exists:**
```bash
mysql -u nexus_user -p -e "SHOW DATABASES;"
```

3. **Check Table Structure:**
```bash
mysql -u nexus_user -p nexus_global_parcel -e "SHOW TABLES;"
```

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Restart application
pm2 restart nexus-parcel
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## Post-Deployment Checklist

- [ ] Database created with correct name and user
- [ ] `.env` file configured with correct credentials
- [ ] Build completed successfully (`npm run build`)
- [ ] Node.js application running (check in cPanel or `pm2 status`)
- [ ] Domain DNS points to hosting server
- [ ] SSL certificate installed and HTTPS working
- [ ] Admin portal accessible at `/admin`
- [ ] Admin credentials changed from default
- [ ] Test package creation via admin dashboard
- [ ] Test tracking on homepage
- [ ] Chat widget functional on pages
- [ ] Multi-language selector working
- [ ] Send test email notifications (if configured)
- [ ] Check logs for any errors
- [ ] Set up automated backups for database
- [ ] Enable error monitoring (Sentry, etc.)

---

## Performance Optimization

### Enable Caching Headers:
Add to `.htaccess`:
```apache
# Expire headers for static assets
<filesMatch "\\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public"
</filesMatch>
```

### Enable Gzip Compression:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Monitor Application:
```bash
# Use PM2 monitoring
pm2 monit

# View real-time logs
pm2 logs -f
```

---

## Maintenance & Updates

### Regular Backups:

```bash
# Backup database
mysqldump -u nexus_user -p nexus_global_parcel > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup application files
tar -czf nexus_backup_$(date +%Y%m%d_%H%M%S).tar.gz /home/your_cpanel_user/public_html
```

### Update Application:

```bash
# Pull latest code
cd /home/your_cpanel_user/public_html
git pull origin main

# Install new dependencies
pnpm install

# Rebuild
pnpm build

# Restart PM2
pm2 restart nexus-parcel
```

---

## Support & Documentation

- **API Documentation:** Check `shared/api.ts` for endpoint types
- **Database Schema:** See `database/schema.sql`
- **Environment Variables:** See `.env.example`
- **Admin Routes:** Admin portal at `/admin`, login required
- **User Routes:** Homepage at `/`, tracking at `/track`

---

## Security Recommendations

1. **Change Default Admin Credentials** immediately
2. **Use Strong Passwords:** Generate with `openssl rand -base64 32`
3. **Enable 2FA** on cPanel account
4. **Regular Backups:** Database and files
5. **SSL/HTTPS:** Always use HTTPS (auto-enabled with cPanel AutoSSL)
6. **Firewall Rules:** Restrict admin access by IP if possible
7. **Monitor Logs:** Check error logs regularly
8. **Update Dependencies:** Run `pnpm audit` to check for vulnerabilities
9. **Use Environment Variables:** Never hardcode secrets
10. **Database User Privileges:** Ensure limited privileges for app user

---

## Contact Information

For support, contact:
- **Phone:** 08104728835
- **Address:** No 1 Bende Street, Rivers State, Port Harcourt
- **Email:** support@nexusparcel.com

---

**Last Updated:** 2024
**Version:** 1.0
