# Stripe Microservice for Bob

## Introduction

The Stripe Microservice for Bob is a lightweight, deployable service designed to integrate subscription-based payment capabilities into your projects using Stripe. This microservice is specifically tailored for handling subscriptions through Stripe's pricing model, utilizing a predefined price ID set in the environment configuration.

## Setup

To set up the microservice, ensure you have the following environment variables configured in your `.env` file:

```
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
CLIENT_URL=
HOME_URL=
```

These variables are crucial for the microservice to interact with Stripe's API and redirect users appropriately after transactions.

### Quick Start

To quickly start the application, use the provided bash script:

```
chmod +x run-stripe-microservice.sh
./run-stripe-microservice.sh
```

This script will check for necessary dependencies, set up the environment, and start the application.

### Run Development

For development purposes, you can run the application using nodemon for automatic restarts on file changes:

```
npm run dev
```

This command uses nodemon to watch for changes and restart the server automatically, facilitating a smoother development workflow.

## Using HOME_URL

The `HOME_URL` environment variable is used to redirect users back to your application from the pre-built success and cancel pages. Ensure this URL points to the appropriate location in your application where users should land after a transaction.

## Endpoints

### POST /api/checkout

This endpoint creates a Stripe checkout session for subscriptions. The `priceId` is automatically retrieved from the environment configuration, ensuring a consistent subscription plan is used across all transactions.

Example request:

```
POST /api/checkout
Content-Type: application/json
{}
```

No additional data is required in the request body.

### Example Response

```json
{
    "id": "cs_test_a1WHz0EUClolNhVTsmjK7KWyVhUA6EqBqOESbVxUdTmOrrVBZzUnNmnYzz",
    "object": "checkout.session",
    "amount_subtotal": 3500,
    "amount_total": 3500,
    "currency": "usd",
    "mode": "subscription",
    "payment_status": "unpaid",
    "status": "open",
    "success_url": "http://localhost:5001/success",
    "cancel_url": "http://localhost:5001/cancel",
    "url": "https://checkout.stripe.com/c/pay/cs_test_a1WHz0EUClolNhVTsmjK7KWyVhUA6EqBqOESbVxUdTmOrrVBZzUnNmnYzz#fidkdWxOYHwnPyd1blpxYHZxWjA0S1M8SU9JdkNCYkFPS0F0V2lHY3FKM3NRdDZuQTBkTmBIQzUwdGxVbTd9T3FxTVxzNWBsd25EN3dOM288cXRSRnJyNzYzTTVGdDRtQFJXRkJqcjdjSlVmNTVoNVBCXDd%2FdycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
}
```

## Project Structure

### Package Dependencies

The microservice uses the following main dependencies:

- `express`: Web framework for handling HTTP requests
- `stripe`: Official Stripe SDK for Node.js
- `dotenv`: Environment variable management
- `ejs`: Template engine for rendering views

### Routes

Routes are defined in `routes/checkoutRoutes.js`:

- `POST /api/checkout`: Creates a Stripe checkout session
- `GET /success`: Renders success page after payment
- `GET /cancel`: Renders cancel page if payment fails
- `GET /`: Renders this documentation page

### Controllers

The `checkoutController.js` handles the business logic for checkout sessions.

### Services

The `stripeService.js` contains the Stripe integration logic:

- Creates checkout sessions using the Stripe API
- Configures subscription parameters
- Handles success and cancel URL redirects
- Uses environment variables for configuration

### Views

The application includes three EJS templates:

- `home.ejs`: This documentation page
- `success/index.ejs`: Payment success page with HOME_URL redirect
- `cancel/index.ejs`: Payment cancellation page with HOME_URL redirect

### Environment Configuration

The application uses environment variables for configuration, loaded via dotenv:

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PRICE_ID`: The ID of your Stripe subscription price
- `CLIENT_URL`: The URL where this microservice is hosted
- `HOME_URL`: The URL to redirect back to your main application
- `PORT`: Optional port number (defaults to 5001)

## Deployment

### AWS Deployment

#### 1. EC2 Setup

1. Launch an EC2 instance (Ubuntu Server recommended)
   - Choose t2.micro for free tier
   - Configure security group to allow HTTP (80), HTTPS (443), and SSH (22)
   - Create and download your key pair (.pem file)
2. SSH into your instance:
   ```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

#### 2. Install Required Software

```bash
# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install nginx

# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx
```

#### 3. Deploy Your Application

```bash
# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables here

# Start your application
node server.js
```

#### 4. Configure Nginx

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/your-domain.com
```

Add this configuration:

```nginx
server {
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Create symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
```

Test Nginx configuration:

```bash
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

#### 5. Domain Configuration

1. Go to your domain registrar's DNS settings
2. Add an A record:
   - Host: @ (or empty)
   - Value: Your EC2 instance's public IP
3. Add another A record for www subdomain:
   - Host: www
   - Value: Your EC2 instance's public IP
4. Wait for DNS propagation (can take up to 48 hours)

#### 6. SSL Certificate with Certbot

```bash
# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically modify your Nginx configuration
# Choose option 2 to redirect all HTTP traffic to HTTPS

# Test automatic renewal
sudo certbot renew --dry-run
```

#### 7. Maintenance

- Monitor logs:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- Update application:
  ```bash
  cd ~/your-repo
  git pull
  npm install
  node server.js
  ```
- SSL certificate auto-renews every 90 days

### Replit Deployment

1. Create a new Replit project and import your repository.
2. Set up environment variables in the Replit secrets manager.
3. Ensure your application listens on the port provided by Replit.
4. Use Replit's built-in domain management to configure a custom domain if needed.

## Domain and DNS Configuration

For both AWS and Replit, ensure your domain's DNS settings are configured to point to your server's IP address. Use a service like Route 53 (AWS) or your domain registrar's DNS management tools to set up A records and CNAMEs as needed.

## Nginx and SSL with Certbot

On AWS, install Nginx and configure it to serve your Node.js application. Use Certbot to obtain and renew SSL certificates automatically, ensuring secure connections to your microservice.


