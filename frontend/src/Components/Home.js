import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [editingTask, setEditingTask] = useState(null);

    // Fetch tasks
    useEffect(() => {
        axios.get(`${API_URL}/tasks`)
            .then((response) => setTasks(response.data))
            .catch((error) => console.error("Axios Error:", error));
    }, []);

    // Add or update task
    const handleSubmit = () => {
        if (!taskName || !description) {
            alert("Task name and description are required!");
            return;
        }

        const url = editingTask ? `${API_URL}/tasks/${editingTask.id}` : `${API_URL}/tasks`;

        axios({
            method: editingTask ? "PUT" : "POST",
            url,
            data: { name: taskName, description, date },
        })
        .then((response) => {
            if (editingTask) {
                setTasks(tasks.map((task) => task.id === editingTask.id ? response.data : task));
            } else {
                setTasks([...tasks, response.data]);
            }
            resetForm();
        })
        .catch((error) => console.error("Axios Error:", error));
    };

    // Delete task
    const deleteTask = (id) => {
        axios.delete(`${API_URL}/tasks/${id}`)
            .then(() => setTasks(tasks.filter((task) => task.id !== id)))
            .catch((error) => console.error("Axios Error:", error));
    };

    // Edit task
    const editTask = (task) => {
        setTaskName(task.name);
        setDescription(task.description);
        setDate(task.date);
        setEditingTask(task);
    };

    // Reset form
    const resetForm = () => {
        setTaskName("");
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
        setEditingTask(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">To-Do List</h2>
            <div className="card p-4">
                <div className="mb-3">
                    <label>Task Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label>Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {editingTask ? "Update Task" : "Add Task"}
                </button>
                {editingTask && (
                    <button className="btn btn-secondary ms-2" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </div>

            <ul className="list-group mt-4">
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between">
                        <div>
                            <strong>{task.name}</strong> - {task.description} ({task.date})
                        </div>
                        <div>
                            <button className="btn btn-success btn-sm me-2" onClick={() => editTask(task)}>
                                Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
