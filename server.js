const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('src'));

// Import routes
const checkoutRoutes = require('./routes/checkoutRoutes');

// Use routes
app.use('/api', checkoutRoutes);

// Render the success page with dynamic URL
app.get('/success', (req, res) => {
  res.render('success/index', { homeUrl: process.env.HOME_URL });
});

// Render the cancel page
app.get('/cancel', (req, res) => {
  res.render('cancel/index', { homeUrl: process.env.HOME_URL });
});

app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
