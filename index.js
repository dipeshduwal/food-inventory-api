//Setting up express server 

const express = require('express');
const app = express();
const port = 3000;
const db = require('./database');  // Import SQLite3 database

//Middleware to parse incoming JSON requests
//applicationlevelmiddleware

app.use(express.json());

//array to store food items

/*let foodItems = [{ id: 1, name: "Apple", quantity: 10 },
    { id: 2, name: "Banana", quantity: 5 },
    { id: 3, name: "Carrot", quantity: 8 }];*/

//route to handle create food item

/*app.post('/food', (req, res) => {
    const newItem = {
        id: foodItems.length + 1,
        name: req.body.name,
        quantity: req.body.quantity
    };
    foodItems.push(newItem);
    res.status(201).json(newItem);
});*/

// Create a food item (POST)
app.post('/food', (req, res) => {
    const { name, quantity } = req.body;

    const query = `INSERT INTO food_items (name, quantity) VALUES (?, ?)`;
    db.run(query, [name, quantity], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            name,
            quantity
        });
    });
});

//get all food items

/*app.get('/food', (req, res) => {
    res.json(foodItems);
});*/

// Get all food items (GET)
app.get('/food', (req, res) => {
    const query = `SELECT * FROM food_items`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//get specific food item
/*app.get('/food/:id', (req, res) => {
    const id = parseInt(req.params.id); //request parameter id
    const foodItem = foodItems.find(item => item.id === id);

    if (foodItem) {
        res.json(foodItem);
    } else {
        res.status(404).send('Food item not found');
    }
});*/

// Get a specific food item by ID (GET)
app.get('/food/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM food_items WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Food item not found' });
        }
    });
});

//update food item
/*app.put('/food/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foodItem = foodItems.find(item => item.id === id);

    if (foodItem) {
        foodItem.name = req.body.name || foodItem.name;
        foodItem.quantity = req.body.quantity || foodItem.quantity;
        res.json(foodItem);
    } else {
        res.status(404).send('Food item not found');
    }
});*/

// Update a food item (PUT)
app.put('/food/:id', (req, res) => {
    const id = req.params.id;
    const { name, quantity } = req.body;

    const query = `UPDATE food_items SET name = ?, quantity = ? WHERE id = ?`;
    db.run(query, [name, quantity, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Food item not found' });
        } else {
            res.json({ id, name, quantity });
        }
    });
});

//delete a food item
/*app.delete('/food/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = foodItems.findIndex(item => item.id === id);

    if (index !== -1) {
        foodItems.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Food item not found');
    }
});*/

// Delete a food item (DELETE)
app.delete('/food/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM food_items WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Food item not found' });
        } else {
            res.status(204).send();
        }
    });
});

//middleware

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
