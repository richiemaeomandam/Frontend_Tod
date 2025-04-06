import React, { useState, useEffect } from "react";

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { text: newTask, completed: false, editing: false, tempText: "" }]);
            setNewTask("");
        }
    };

    const editTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].editing = true;
        updatedTasks[index].tempText = updatedTasks[index].text; // Store original text
        setTasks(updatedTasks);
    };

    const handleEditChange = (index, newText) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].tempText = newText;
        setTasks(updatedTasks);
    };

    const confirmEdit = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = updatedTasks[index].tempText;
        updatedTasks[index].editing = false;
        setTasks(updatedTasks);
    };

    const cancelEdit = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].editing = false;
        updatedTasks[index].tempText = updatedTasks[index].text; // Restore original text
        setTasks(updatedTasks);
    };

    const toggleCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <h1>To-Do List</h1>
            <button onClick={toggleDarkMode}>
                {darkMode ? "🌙 Dark Mode" : "🔆 Light Mode"}
            </button>
            <br /><br />

            <input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>

            <div>
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("pending")}>Pending</button>
            </div>

            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} style={{
                        textDecoration: task.completed ? "line-through" : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        margin: "10px 0"
                    }}>
                        <input type="checkbox" checked={task.completed} onChange={() => toggleCompletion(index)} />
                        
                        {task.editing ? (
                            <>
                                <input
                                    type="text"
                                    value={task.tempText}
                                    onChange={(e) => handleEditChange(index, e.target.value)}
                                />
                                <button onClick={() => confirmEdit(index)}>✅ Confirm</button>
                                <button onClick={() => cancelEdit(index)}>❌ Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{task.text}</span>
                                <button onClick={() => editTask(index)}>✏️ Edit</button>
                            </>
                        )}
                        <button onClick={() => deleteTask(index)}>❌ Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;