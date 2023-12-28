const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware to parse JSON in request body
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (replace 'your_connection_string' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/fruits', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define a schema and model for your data (e.g., a Fruit model)
const fruitSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Fruit = mongoose.model('fruits', fruitSchema);

// Endpoint to handle POST requests for adding fruits to the database
app.post('/fruits', async (req, res) => {
  const data = req.body;
  try {
    const newFruit = await Fruit.create(data);
    res.json({ message: 'Fruit added successfully', data: newFruit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add fruit', error: error.message });
  }
});

// Endpoint to handle GET requests for fetching fruits from the database
app.get('/fruits', async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch fruits', error: error.message });
  }
});

// Endpoint to handle storing checkout information
app.post('/checkout', async (req, res) => {
  const checkoutData = req.body; // Assuming the checkout data includes selected fruits and total price
  try {
    
     const Checkout = mongoose.model('checkout', checkoutSchema);
     const newCheckout = await Checkout.create(checkoutData);
    
    res.json({ message: 'Checkout information stored successfully', data: checkoutData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to store checkout information', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
