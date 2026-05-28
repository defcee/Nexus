# Nexus Global - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Prerequisites

- Node.js 14+ (Check: `node --version`)
- MySQL 5.7+ (Check: `mysql --version`)
- pnpm or npm (Check: `pnpm --version` or `npm --version`)
- A text editor (VS Code recommended)

---

## 📋 Step 1: Setup (2 minutes)

### Clone & Install
```bash
# Clone repository
git clone https://github.com/yourusername/nexus-parcel.git
cd nexus-parcel

# Install dependencies
pnpm install
```

### Create .env File
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Minimum required in .env:**
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_pass
DB_NAME=nexus_global_parcel
PORT=8080
```

---

## 📦 Step 2: Database Setup (2 minutes)

### Option A: Automated (Recommended)
```bash
# Run the setup script
npm run setup:db

# Follow the prompts and enter your MySQL credentials
```

### Option B: Manual
```bash
# Login to MySQL
mysql -u root -p

# In MySQL:
CREATE DATABASE nexus_global_parcel;
CREATE USER 'nexus_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nexus_global_parcel.* TO 'nexus_user'@'localhost';
FLUSH PRIVILEGES;

# Import schema
mysql -u nexus_user -p nexus_global_parcel < database/schema.sql
```

---

## ▶️ Step 3: Run Development Server (1 minute)

```bash
# Start the development server
pnpm dev

# Open in browser:
# Frontend: http://localhost:5173
# API: http://localhost:8080
```

---

## 🏢 Step 4: Access Admin Panel

1. Open http://localhost:5173/admin
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Change password immediately after login!

---

## 🧪 Test the App

### Homepage
- Visit http://localhost:5173
- Click "Start Tracking"

### Track a Package
- Use tracking number: `NEX1234567890`

### Create New Package (Admin)
1. Go to /admin/dashboard
2. Click "Packages" tab
3. Fill in the form and click "Create Shipment"

---

## 🏭 Build for Production

```bash
# Build the app
pnpm build

# Start production server
pnpm start

# Or with PM2 (recommended)
npm run pm2:start
```

---

## 📱 Useful Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `npm run typecheck` | Check TypeScript errors |
| `npm run format.fix` | Fix code formatting |
| `npm test` | Run tests |
| `npm run pm2:logs` | View PM2 logs |
| `npm run pm2:status` | Check app status |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>
```

### Database Connection Error
```bash
# Test MySQL connection
mysql -u nexus_user -p -h localhost nexus_global_parcel

# Check .env credentials
cat .env | grep DB_
```

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules dist pnpm-lock.yaml
pnpm install
pnpm build
```

### Changes Not Reflecting
```bash
# Restart dev server
# Stop current: Ctrl+C
# Restart: pnpm dev
```

---

## 📞 Default Credentials

| Item | Value |
|------|-------|
| Admin URL | `/admin` |
| Admin Username | `admin` |
| Admin Password | `admin123` |
| Test Tracking # | `NEX1234567890` |

**⚠️ Change admin password immediately after first login!**

---

## 🌐 Multi-Language

Switch languages using flags in header:
- 🇬🇧 English
- 🇫🇷 Français
- 🇪🇸 Español

---

## 📚 Need More Help?

- **Full docs:** See [README.md](./README.md)
- **Deployment:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Database:** See [database/schema.sql](./database/schema.sql)
- **Support:** support@nexusparcel.com

---

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] MySQL running
- [ ] Dependencies installed (`pnpm install`)
- [ ] .env file created with DB credentials
- [ ] Database imported (`npm run setup:db`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Can access http://localhost:5173
- [ ] Can login to /admin
- [ ] Can track `NEX1234567890`

Once all items are checked, you're ready to go! 🎉

---

**Happy Building! 🚀**
