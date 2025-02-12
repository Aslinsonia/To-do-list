const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

let tasks = [];

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
    const { name, description, date } = req.body;
    if (!name || !description || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newTask = { id: Date.now(), name, description, date };
    tasks.push(newTask);
    res.json(newTask);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const { name, description, date } = req.body;

    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, name, description, date } : task
    );

    res.json({ message: "Task updated successfully" });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
