import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = "https://backend-1-fvoi.onrender.com/api/tasks/";

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return alert("Please enter a task");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });

      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API_URL}${task.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>To-Do List</h1>

      <input
        type="text"
        placeholder="Add new task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        style={{ padding: "10px", width: "70%", marginRight: "10px" }}
      />
      <button onClick={addTask}>Add</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              <span style={{ marginLeft: "10px" }}>{task.title}</span>
              <button style={{ marginLeft: "10px" }} onClick={() => deleteTask(task.id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
