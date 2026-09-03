import React, { useState, useEffect } from 'react';

function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', priority: 'MEDIUM', userId: user.userId
  });

  
  const token = localStorage.getItem("token");
  console.log("USER:", user);
console.log("TOKEN:", token);
  

  useEffect(() => {
    if (user?.userId) {
    fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/tasks/user/${user.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

console.log("TASK RESPONSE:", data);

if (Array.isArray(data)) {
    setTasks(data);
} else if (data) {
    setTasks([data]);
} else {
    setTasks([]);
}

  } catch (error) {
    console.error("FETCH TASK ERROR:", error);
    setTasks([]);
  }
};

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, userId: user.userId})
      });
      setShowForm(false);
      setFormData({ title: '', description: '', dueDate: '', priority: 'MEDIUM', userId: user.userId });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const completeTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, status: 'COMPLETED' })
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📅 Task Management</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Add Task
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Task Title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} />
          <input style={styles.input} placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} />
          <input style={styles.input} type="date"
            value={formData.dueDate}
            onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          <select style={styles.input}
            value={formData.priority}
            onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <button style={styles.addBtn} onClick={handleSubmit}>Save Task</button>
        </div>
      )}

     <div style={styles.taskList}> {Array.isArray(tasks) && tasks.length === 0 && ( <div style={styles.empty}>No tasks yet! Click "Add Task" to get started.</div> )} {Array.isArray(tasks) && tasks.map(task => ( <div key={task.id} style={{ ...styles.taskCard, opacity: task.status === 'COMPLETED' ? 0.6 : 1 }}> <div style={styles.taskInfo}> <h3 style={{ ...styles.taskTitle, textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>{task.title}</h3> <p style={styles.taskDesc}>{task.description}</p> <div style={styles.taskMeta}> <span style={{ ...styles.priority, background: task.priority === 'HIGH' ? '#ff6b6b' : task.priority === 'MEDIUM' ? '#ffd93d' : '#6bcb77' }}>{task.priority}</span> {task.dueDate && <span style={styles.date}>📅 {task.dueDate}</span>} <span style={styles.status}>{task.status}</span> </div> </div> <div style={styles.taskActions}> {task.status !== 'COMPLETED' && ( <button style={styles.completeBtn} onClick={() => completeTask(task.id)}> ✓ Done </button> )} <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}> 🗑 Delete </button> </div> </div> )) } </div> </div> ); }



const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#00f5ff', textShadow: '0 0 10px #00f5ff55' },
  addBtn: { background: 'linear-gradient(135deg, #00f5ff, #7b2fff)', color: 'white', border: 'none',
    padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
    boxShadow: '0 0 15px #00f5ff44' },
  form: { background: '#12121a', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', border: '1px solid #00f5ff33' },
  input: { width: '100%', padding: '12px', marginBottom: '12px',
    border: '1px solid #00f5ff33', borderRadius: '8px', fontSize: '16px',
    boxSizing: 'border-box', background: '#0a0a0f', color: '#00f5ff' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#444', padding: '40px', fontSize: '18px' },
  taskCard: { background: '#12121a', padding: '20px', borderRadius: '12px',
    border: '1px solid #00f5ff22', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 0 15px #00f5ff11' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: '18px', fontWeight: 'bold', color: '#00f5ff', marginBottom: '4px' },
  taskDesc: { color: '#666', marginBottom: '8px' },
  taskMeta: { display: 'flex', gap: '12px', alignItems: 'center' },
  priority: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  date: { color: '#666', fontSize: '14px' },
  status: { color: '#00f5ff', fontSize: '14px', fontWeight: 'bold' },
  taskActions: { display: 'flex', gap: '8px' },
  completeBtn: { background: 'linear-gradient(135deg, #00f5ff, #00aa88)', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  deleteBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
};

export default Tasks;