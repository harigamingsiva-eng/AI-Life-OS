import React, { useState, useEffect } from 'react';

function Goals({ user }) {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', targetDate: '', userId: user.userId
  });

  const token = localStorage.getItem("token");

 useEffect(() => {
 if(user?.userId){
   fetchGoals();
 }
}, [user]);

  const fetchGoals = async () => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/goals/user/${user.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

   if (Array.isArray(data)) {
    setGoals(data);
} else if (data) {
    setGoals([data]);
} else {
    setGoals([]);
}

  } catch(error){
    console.error("FETCH GOALS ERROR:", error);
    setGoals([]);
  }
};
  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8080/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, userId: user.userId})
      });
      setShowForm(false);
      setFormData({ title: '', description: '', targetDate: '', userId: user.userId });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      await fetch(`http://localhost:8080/api/goals/${id}/progress?progress=${progress}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Goal Tracking</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Add Goal
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Goal Title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} />
          <input style={styles.input} placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} />
          <input style={styles.input} type="date"
            value={formData.targetDate}
            onChange={e => setFormData({...formData, targetDate: e.target.value})} />
          <button style={styles.addBtn} onClick={handleSubmit}>Save Goal</button>
        </div>
      )}

      <div style={styles.goalList}>
        {goals.length === 0 && (
          <div style={styles.empty}>No goals yet! Click "Add Goal" to get started.</div>
        )}
        {goals.map(goal => (
          <div key={goal.id} style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <h3 style={styles.goalTitle}>{goal.title}</h3>
              <span style={{
                ...styles.statusBadge,
                background: goal.status === 'COMPLETED' ? '#6bcb77' : '#7b2fff'
              }}>{goal.status}</span>
            </div>
            <p style={styles.goalDesc}>{goal.description}</p>
            {goal.targetDate && (
              <p style={styles.goalDate}>🎯 Target: {goal.targetDate}</p>
            )}
            <div style={styles.progressSection}>
              <div style={styles.progressLabel}>
                <span>Progress</span>
                <span style={{color: '#00f5ff'}}>{goal.progress}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${goal.progress}%`,
                  background: goal.progress >= 100 ? '#6bcb77' : 'linear-gradient(90deg, #00f5ff, #7b2fff)'
                }} />
              </div>
              <input type="range" min="0" max="100"
                value={goal.progress}
                onChange={e => updateProgress(goal.id, e.target.value)}
                style={styles.slider} />
            </div>
            <button style={styles.deleteBtn} onClick={() => deleteGoal(goal.id)}>
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
  
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
  goalList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty: { textAlign: 'center', color: '#444', padding: '40px', fontSize: '18px' },
  goalCard: { background: '#12121a', padding: '24px', borderRadius: '12px',
    border: '1px solid #00f5ff22', boxShadow: '0 0 15px #00f5ff11' },
  goalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  goalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#00f5ff' },
  statusBadge: { color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  goalDesc: { color: '#666', marginBottom: '8px' },
  goalDate: { color: '#666', fontSize: '14px', marginBottom: '16px' },
  progressSection: { marginBottom: '16px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa' },
  progressBar: { height: '8px', background: '#1a1a2e', borderRadius: '4px', marginBottom: '8px' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s', boxShadow: '0 0 8px #00f5ff' },
  slider: { width: '100%', cursor: 'pointer', accentColor: '#00f5ff' },
  deleteBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
};
export default Goals;