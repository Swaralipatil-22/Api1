// app.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require('./models');

const app = express();

app.use(bodyParser.json());

// Select all users
app.get("/select", async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

// Insert a new user
app.post("/insert", async (req, res) => {
    try {
        const data = req.body;
        const newUser = await db.User.create(data);
        res.json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Delete a user (example route)
// Delete a user
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await db.User.destroy({
            where: {
                id: id
            }
        });
        if (user === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(`User with ID ${id} deleted successfully`);
        }
    } catch (err) {
        console.error(err);
    }
    res.status(500).json({ error: "Failed to delete user" });
});

//update a user
app.put("/update/:id", async (req,res) => {
    const id = req.params.id;
    const data = req.body;
    try{
        const user = await db.User.update(data , {
            where: {
                id: id
            }
        });
     res.send('user updated');
        }catch(err){
            res.send(err);
        }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

// Sync database and start server
db.sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server running on port 3000`);
        });
    })
    .catch(err => {
        console.error("Database synchronization error:", err);
    });