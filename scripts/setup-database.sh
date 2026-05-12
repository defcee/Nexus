#!/bin/bash

# Nexus Global - Database Setup Script
# This script helps set up the MySQL database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Nexus Global - Database Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}✗ MySQL client not found!${NC}"
    echo "Please install MySQL client"
    exit 1
fi

echo -e "${YELLOW}Enter your MySQL credentials:${NC}"
read -p "MySQL Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "MySQL Root User (default: root): " DB_ROOT_USER
DB_ROOT_USER=${DB_ROOT_USER:-root}

read -sp "MySQL Root Password: " DB_ROOT_PASS
echo ""

read -p "New Database User (default: nexus_user): " DB_USER
DB_USER=${DB_USER:-nexus_user}

read -sp "New Database User Password: " DB_PASS
echo ""

read -p "Database Name (default: nexus_global_parcel): " DB_NAME
DB_NAME=${DB_NAME:-nexus_global_parcel}

echo -e "\n${YELLOW}Summary:${NC}"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

read -p "Continue with setup? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Setup cancelled"
    exit 0
fi

echo -e "\n${YELLOW}Creating database and user...${NC}"

# Create database and user
mysql -h "$DB_HOST" -u "$DB_ROOT_USER" -p"$DB_ROOT_PASS" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✓ Database and user created${NC}\n"

echo -e "${YELLOW}Importing database schema...${NC}"

# Import schema
if [ -f "database/schema.sql" ]; then
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/schema.sql
    echo -e "${GREEN}✓ Schema imported${NC}\n"
else
    echo -e "${RED}✗ database/schema.sql not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating .env file...${NC}"

# Update .env file
if [ -f ".env" ]; then
    # Create backup
    cp .env .env.backup
    echo -e "${GREEN}✓ Backup created (.env.backup)${NC}"
    
    # Update values using sed
    sed -i.bak "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" .env
    sed -i.bak "s/^DB_USER=.*/DB_USER=$DB_USER/" .env
    sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
    sed -i.bak "s/^DB_NAME=.*/DB_NAME=$DB_NAME/" .env
    
    rm .env.bak
    echo -e "${GREEN}✓ .env file updated${NC}\n"
else
    echo -e "${RED}✗ .env file not found!${NC}"
    echo "Copy .env.example to .env and try again"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Database Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "Database Credentials:"
echo -e "  Host: ${BLUE}$DB_HOST${NC}"
echo -e "  Database: ${BLUE}$DB_NAME${NC}"
echo -e "  User: ${BLUE}$DB_USER${NC}"
echo -e "  Password: ${BLUE}(saved in .env)${NC}\n"

# Verify connection
echo -e "${YELLOW}Verifying connection...${NC}"
if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓ Connection successful!${NC}"
else
    echo -e "${RED}✗ Connection failed!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Run: ${BLUE}pnpm install${NC}"
echo "2. Run: ${BLUE}pnpm build${NC}"
echo "3. Run: ${BLUE}pnpm start${NC}"
echo ""
