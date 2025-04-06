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
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  const BACKEND_BASE = "https://todo-backend-2-z23h.onrender.com/todo/api/tasks/";

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(BACKEND_BASE);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return alert("Task cannot be empty!");
    try {
      const response = await fetch(BACKEND_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
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
      const taskToToggle = tasks.find((task) => task.id === id);
      const response = await fetch(`${BACKEND_BASE}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskToToggle, completed: !taskToToggle.completed }),
      });
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
      const response = await fetch(`${BACKEND_BASE}${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (id) => {
    if (editTaskText.trim() === "") return alert("Task cannot be empty!");
    try {
      const taskToEdit = tasks.find((task) => task.id === id);
      const response = await fetch(`${BACKEND_BASE}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskToEdit, title: editTaskText }),
      });
      if (!response.ok) throw new Error("Failed to edit task");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      setEditTaskId(null);
      setEditTaskText("");
    } catch (error) {
      console.error("Error editing task:", error);
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
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                  <button onClick={() => editTask(task.id)}>💾 Save</button>
                  <button onClick={() => setEditTaskId(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <div className="todo-actions">
                    <button onClick={() => deleteTask(task.id)}>❌</button>
                    <button
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditTaskText(task.title);
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
