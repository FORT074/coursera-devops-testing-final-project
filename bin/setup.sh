#!/bin/bash
echo "**************************************************"
echo " Setting up TDD/BDD Final Project Environment"
echo "**************************************************"

echo "*** Installing Node.js 18 and npm"
# Update package lists
sudo apt-get update

# Install NodeSource Node.js 18.x repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

echo "*** Checking Node.js and npm versions..."
node --version
npm --version

echo "*** Installing project dependencies..."
npm install

echo "*** Installing global development tools..."
sudo npm install -g nodemon

echo "*** Installing Selenium and Firefox for BDD"
sudo apt-get update
# Install Firefox and other dependencies
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y sqlite3 ca-certificates firefox-esr curl

# Install geckodriver (Firefox WebDriver)
echo "*** Installing geckodriver..."
# Get the latest version of geckodriver
GECKODRIVER_VERSION=$(curl -s "https://api.github.com/repos/mozilla/geckodriver/releases/latest" | grep -Po '"tag_name": "\K.*?(?=")')
# Download and install geckodriver
wget -q "https://github.com/mozilla/geckodriver/releases/download/$GECKODRIVER_VERSION/geckodriver-$GECKODRIVER_VERSION-linux64.tar.gz" -O /tmp/geckodriver.tar.gz
sudo tar -xzf /tmp/geckodriver.tar.gz -C /usr/local/bin
rm /tmp/geckodriver.tar.gz

echo "*** Establishing .env file"
cp .env.example .env

echo "*** Starting the PostgreSQL Docker container..."
# Check if Docker is available
if command -v docker &> /dev/null; then
    # Stop and remove any existing postgres container
    docker stop postgres 2>/dev/null || true
    docker rm postgres 2>/dev/null || true
    
    # Start new postgres container
    docker run -d --name postgres \
        -p 5432:5432 \
        -e POSTGRES_PASSWORD=postgres \
        -v postgres_data:/var/lib/postgresql/data \
        postgres:13-alpine
    
    echo "*** Waiting for PostgreSQL to start..."
    sleep 10
    
    echo "*** Checking the PostgreSQL Docker container..."
    docker ps | grep postgres
else
    echo "*** Docker not available, please ensure PostgreSQL is running on localhost:5432"
fi



echo "**************************************************"
echo " TDD/BDD Final Project Environment Setup Complete"
echo "**************************************************"
echo ""
echo "Use 'exit' to close this terminal and open a new one to initialize the environment"
echo ""