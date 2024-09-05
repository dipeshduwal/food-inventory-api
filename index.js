//Setting up express server 

const express = require('express');
const app = express();
const port = 3000;

//Middleware to parse incoming JSON requests

app.use(express.json());

//array to store food items

let foodItems = [];

//route to handle create food item

app.post('/food', (req, res) => {
    const newItem = {
        id: foodItems.length + 1,
        name: req.body.name,
        quantity: req.body.quantity
    };
    foodItems.push(newItem);
    res.status(201).json(newItem);
});


//get all food items

app.get('/food', (req, res) => {
    res.json(foodItems);
});

//get specific food item
app.get('/food/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foodItem = foodItems.find(item => item.id === id);

    if (foodItem) {
        res.json(foodItem);
    } else {
        res.status(404).send('Food item not found');
    }
});

//update food item
app.put('/food/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foodItem = foodItems.find(item => item.id === id);

    if (foodItem) {
        foodItem.name = req.body.name || foodItem.name;
        foodItem.quantity = req.body.quantity || foodItem.quantity;
        res.json(foodItem);
    } else {
        res.status(404).send('Food item not found');
    }
});

//delete a food item
app.delete('/food/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = foodItems.findIndex(item => item.id === id);

    if (index !== -1) {
        foodItems.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Food item not found');
    }
});

//middleware

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
