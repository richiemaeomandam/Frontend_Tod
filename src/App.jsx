import { useState, useEffect } from "react";
import "./App.css";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/todo/tasks/");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
      console.log("Tasks fetched:", data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return alert("Task cannot be empty!");
    try {
      const response = await fetch("http://127.0.0.1:8000/todo/tasks/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTask }),
      });
      if (!response.ok) throw new Error("Failed to add task");

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/todo/tasks/toggle/${id}/`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to toggle task");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/todo/tasks/delete/${id}/`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <button onClick={toggleDarkMode} className="dark-mode-btn">
        {darkMode ? "🌙 Dark Mode" : "🔆 Light Mode"}
      </button>
      <h2 className="title">To-Do List</h2>

      <div className="input-container">
        <input
          type="text"
          style={{ fontSize: "20px", flex: "1" }}
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>
          ➕ Add
        </button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="todo-list">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`todo-item ${task.completed ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              />
              <span>{task.text}</span>
              <div className="todo-actions">
                <button onClick={() => deleteTask(task.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
