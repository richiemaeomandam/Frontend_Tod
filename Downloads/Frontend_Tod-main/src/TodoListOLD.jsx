import React, { useState, useEffect } from "react";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // Update local storage when dark mode is toggled
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("https://backend-1-fvoi.onrender.com/todo/");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetch("https://backend-1-fvoi.onrender.com/todo/tasks/add/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTask }),
        });
        if (!response.ok) throw new Error("Failed to add task");

        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask(""); // Clear the input field
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Toggle task completion
  const toggleCompletion = async (taskId) => {
    try {
      const response = await fetch(`https://backend-1-fvoi.onrender.com/todo/tasks/toggle/${taskId}/`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to toggle task");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Edit a task's text
  const editTask = async (taskId, newText) => {
    try {
      const response = await fetch(`https://backend-1-fvoi.onrender.com/todo/tasks/edit/${taskId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      if (!response.ok) throw new Error("Failed to edit task");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://backend-1-fvoi.onrender.com/todo/tasks/delete/${taskId}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks based on the current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Toggle dark mode
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
        {filteredTasks.map((task) => (
          <li key={task.id} style={{
            textDecoration: task.completed ? "line-through" : "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "10px 0"
          }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleCompletion(task.id)} />
            <span>{task.text}</span>
            <button onClick={() => editTask(task.id, prompt("Edit task:", task.text))}>✏️ Edit</button>
            <button onClick={() => deleteTask(task.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
