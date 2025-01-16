#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js could not be found. Please install Node.js to continue."
    exit
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found. Please install npm to continue."
    exit
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat <<EOT >> .env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
CLIENT_URL=http://localhost:5001
HOME_URL=http://localhost:5001
PORT=5001
EOT
    echo ".env file created. Please update it with your actual configuration."
else
    echo ".env file already exists. Please ensure it is configured correctly."
fi

# Start the application using node
echo "Starting the application with node..."
node server.js

echo "Stripe Microservice is running. Press Ctrl+C to stop." 