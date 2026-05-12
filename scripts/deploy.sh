#!/bin/bash

# Nexus Global Parcel Services - Deployment Script
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Nexus Global - Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing Dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

echo -e "${YELLOW}Step 2: Running TypeScript Type Check...${NC}"
npm run typecheck 2>/dev/null || true
echo -e "${GREEN}✓ Type check complete${NC}\n"

echo -e "${YELLOW}Step 3: Building Application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}\n"

echo -e "${YELLOW}Step 4: Creating Logs Directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}\n"

echo -e "${YELLOW}Step 5: Checking Node.js Installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not installed!${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION installed${NC}\n"

echo -e "${YELLOW}Step 6: Checking PM2 Installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2 globally...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}\n"
fi

echo -e "${YELLOW}Step 7: Starting Application with PM2...${NC}"
pm2 delete nexus-parcel 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup
echo -e "${GREEN}✓ Application started${NC}\n"

echo -e "${YELLOW}Step 8: Checking Application Status...${NC}"
sleep 2
pm2 status

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "Application Details:"
echo -e "  URL: $(grep 'APP_URL' .env | cut -d '=' -f2)"
echo -e "  Port: $(grep 'PORT' .env | cut -d '=' -f2)"
echo -e "  Environment: $(grep 'NODE_ENV' .env | cut -d '=' -f2)"
echo -e "\nAdmin Access:"
echo -e "  URL: $(grep 'APP_URL' .env | cut -d '=' -f2)/admin"
echo -e "  Username: $(grep 'ADMIN_USER' .env | cut -d '=' -f2)"
echo -e "\nUseful Commands:"
echo -e "  View logs: ${BLUE}pm2 logs nexus-parcel${NC}"
echo -e "  Monitor: ${BLUE}pm2 monit${NC}"
echo -e "  Stop app: ${BLUE}pm2 stop nexus-parcel${NC}"
echo -e "  Restart app: ${BLUE}pm2 restart nexus-parcel${NC}"
echo -e "  Remove app: ${BLUE}pm2 delete nexus-parcel${NC}\n"
