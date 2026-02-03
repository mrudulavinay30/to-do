import React, { useEffect, useState } from "react";
import axios from "axios";
const AUTH_API = "http://localhost:3003/auth";
const TASK_API = "http://localhost:3003/task";

const API = "http://localhost:3003";


const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    background: "#f9f9f9",
    borderRadius: 8,
    padding: "30px 40px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#444",
  },
  heading: {
    textAlign: "center",
    color: "#222",
    marginBottom: 25,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 15,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s",
  },
  buttonPrimary: {
    background: "#3f51b5",
    color: "white",
    border: "none",
    padding: "12px 20px",
    width: "100%",
    borderRadius: 6,
    fontWeight: "600",
    fontSize: 16,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonPrimaryHover: {
    background: "#303f9f",
  },
  buttonSecondary: {
    background: "transparent",
    color: "#3f51b5",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 14,
  },
  flexRowCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    boxShadow: "0 1px 5px rgba(0,0,0,0.06)",
  },
  taskText: (completed) => ({
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: completed ? "#999" : "#333",
    textDecoration: completed ? "line-through" : "none",
    cursor: "pointer",
  }),
  smallDate: {
    fontSize: 11,
    color: "#999",
    marginLeft: 10,
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#e53935",
    cursor: "pointer",
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "bold",
  },
  categoryButtons: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
    gap: 12,
  },
  categoryButton: (active) => ({
    padding: "8px 14px",
    background: active ? "#3f51b5" : "#eef1f7",
    color: active ? "white" : "#606770",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
    fontSize: 14,
  }),
  logoutContainer: {
    textAlign: "right",
    marginBottom: 15,
  },
  editInput: {
    flex: 1,
    padding: "8px 10px",
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  editButtons: {
    marginLeft: 10,
    display: "flex",
    gap: 10,
  },
  smallButton: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "#9e9e9e",
    color: "white",
  }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("all");
  const [editModeId, setEditModeId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // or 'register'
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  // ✅ Add this helper to include the token with every request
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Token saved after login
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const fetchTasks = async () => {
    if (!user) return;
    try {
      const query = `?category=${category}${searchTerm ? `&search=${searchTerm}` : ""}`;
      const res = await axios.get(`http://localhost:3003/task${query}`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) logout();
    }
  };
  

  

   


 useEffect(() => {
  fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [category, searchTerm]);



  const handleAuth = async () => {
    setErrorMessage("");
    try {
      const endpoint = authMode === "login" ? "login" : "register";
      const payload =
        authMode === "login"
          ? { email: authData.email, password: authData.password }
          : authData;

      const res = await axios.post(`${AUTH_API}/${endpoint}`, payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Authentication failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(
        TASK_API,
        { task: newTask },
        { headers: getAuthHeaders() }
      );
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) logout();
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`${TASK_API}/${id}/toggle`, null, {
        headers: getAuthHeaders(),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) logout();
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${TASK_API}/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) logout();
    }
  };

  const startEdit = (id, currentTask) => {
    setEditModeId(id);
    setEditText(currentTask);
  };

  const cancelEdit = () => {
    setEditModeId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `${TASK_API}/${id}`,
        { task: editText },
        { headers: getAuthHeaders() }
      );
      setEditModeId(null);
      setEditText("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) logout();
    }
  };

  if (!user) {
    // Auth form
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>{authMode === "login" ? "Login" : "Register"}</h1>
        {authMode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={authData.name}
            onChange={(e) =>
              setAuthData({ ...authData, name: e.target.value })
            }
            style={styles.input}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={authData.email}
          onChange={(e) =>
            setAuthData({ ...authData, email: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={authData.password}
          onChange={(e) =>
            setAuthData({ ...authData, password: e.target.value })
          }
          style={styles.input}
        />
        {errorMessage && (
          <div style={styles.errorText}>{errorMessage}</div>
        )}
        <button onClick={handleAuth} style={styles.buttonPrimary}>
          {authMode === "login" ? "Login" : "Register"}
        </button>
        <p style={{ textAlign: "center", marginTop: 15, color: "#666" }}>
          {authMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            style={styles.buttonSecondary}
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    );
  }

  // Main Todo app UI
  return (
    <div style={styles.container}>
      <div style={styles.logoutContainer}>
        <b>Welcome, {user.name}</b>{" "}
        <button onClick={logout} style={styles.buttonSecondary}>
          Logout
        </button>
      </div>

      <h1 style={styles.heading}>📝 Your To-Do List</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Add new task..."
          value={newTask}
          style={styles.input}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} style={styles.buttonPrimary}>
          Add
        </button>
      </div>

      <div style={styles.categoryButtons}>
        {["all", "pending", "completed"].map((cat) => (
          <button
            key={cat}
            style={styles.categoryButton(cat === category)}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {/* 🔍 Search Bar */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
  <input
    type="text"
    placeholder="🔍 Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      ...styles.input,
      width: "70%",
      marginBottom: 0,
      fontSize: 15,
    }}
  />
  <button
    onClick={() => fetchTasks()}
    style={{
      ...styles.buttonPrimary,
      width: "auto",
      marginLeft: 10,
      padding: "10px 20px",
    }}
  >
    Search
  </button>
</div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.length === 0 && (
          <p style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No tasks to show.
          </p>
        )}
        {tasks.map((t) => (
          <li key={t._id} style={styles.taskItem}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t._id)}
            />
            {editModeId === t._id ? (
              <>
                <input
                  value={editText}
                  style={styles.editInput}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div style={styles.editButtons}>
                  <button
                    style={{ ...styles.smallButton, ...styles.saveButton }}
                    onClick={() => saveEdit(t._id)}
                  >
                    Save
                  </button>
                  <button
                    style={{ ...styles.smallButton, ...styles.cancelButton }}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span
                  style={styles.taskText(t.completed)}
                  onDoubleClick={() => startEdit(t._id, t.task)}
                  title="Double click to edit"
                >
                  {t.task}
                </span>
                <small style={styles.smallDate}>
                  {new Date(t.createdAt).toLocaleString()}
                </small>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteTask(t._id)}
                  aria-label="Delete task"
                  title="Delete task"
                >
                  &times;
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

