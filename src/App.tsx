import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, Button, Typography, Box } from '@mui/material';
import './App.css';

interface Fruit {
  Name: string;
  Price?: number;
}

const App: React.FC = () => {
  const [selectedFruits, setSelectedFruits] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);

  useEffect(() => {
    // Fetch fruits data from the API endpoint
    fetch('http://localhost:3000/fruits')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Fruit[]) => {
        setFruits(data); // Set the fetched fruits data to the state
      })
      .catch(error => {
        console.error('There was a problem fetching fruits data:', error);
      });
  }, []);

  const handleFruitSelection = (event: React.ChangeEvent<{ value: unknown }>, fruitName: string) => {
    const quantity = event.target.value as string | unknown;
    const parsedQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

    if (!isNaN(parsedQuantity as number)) {
      const updatedSelection = { ...selectedFruits, [fruitName]: parsedQuantity as number };
      setSelectedFruits(updatedSelection);
      calculateTotalPrice(updatedSelection);
    }
  };

  const calculateTotalPrice = (selection: { [key: string]: number }) => {
    let total = 0;
    for (const fruit in selection) {
      const quantity = selection[fruit];
      const currentFruit = fruits.find(item => item.Name === fruit);
      if (currentFruit && currentFruit.Price !== undefined) {
        total += currentFruit.Price * quantity;
      }
    }
    setTotalPrice(total);
  };

  const handleCheckout = async () => {
    try {
      // Send the checkout details to the backend API
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFruits,
          totalPrice,
        }),
      });

      if (response.ok) {
        console.log('Checkout successful');
        // Reset selectedFruits and totalPrice after successful checkout
        setSelectedFruits({});
        setTotalPrice(0);
      } else {
        console.error('Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="background"> 
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Fruit Shop POS
      </Typography>
      <Box mb={2}>
        {fruits.map(fruit => (
          <div key={fruit.Name}>
            <Select
              labelId={`${fruit.Name}-label`}
              id={fruit.Name}
              value={selectedFruits[fruit.Name] || 0}
              onChange={(e) => handleFruitSelection(e as React.ChangeEvent<{ value: unknown }>, fruit.Name)}
              >
              {[...Array(10).keys()].map(i => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
            <Typography component="span">
              {fruit.Name} - {typeof fruit.Price === 'number' ? `${fruit.Price.toFixed(2)}` : 'N/A'} each
            </Typography>
          </div>
        ))}
      </Box>
      <Typography variant="h6" align="center" gutterBottom>
        Total Price: ${totalPrice.toFixed(2)}
      </Typography>
       <Button variant="contained" color="primary" onClick={handleCheckout}>
        Checkout
      </Button>
    </Container>
    </div>
  );
};

export default App;
