//Setting up express server 

const express = require('express');
const app = express();
const port = 3000;
const db = require('./database');  // Import SQLite3 database

//Middleware to parse incoming JSON requests
//applicationlevelmiddleware

app.use(express.json());

// Validation middleware for food items
const validateFoodItem = (req, res, next) => {
    const { name, quantity } = req.body;

    // Check if 'name' is a non-empty string
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
    }

    // Check if 'quantity' is a positive integer
    if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: 'Quantity is required and must be a positive integer.' });
    }

    // If all validations pass, proceed to the next middleware or route handler
    next();
};

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
