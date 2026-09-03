import React, { useState } from 'react';

function Health() {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Morning Medicine', time: '08:00', category: 'MEDICINE', done: false },
    { id: 2, title: 'Drink Water', time: '10:00', category: 'HYDRATION', done: false },
    { id: 3, title: 'Exercise', time: '06:00', category: 'FITNESS', done: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', time: '', category: 'MEDICINE' });

  const addReminder = () => {
    if (!formData.title || !formData.time) return;
    setReminders([...reminders, { ...formData, id: Date.now(), done: false }]);
    setFormData({ title: '', time: '', category: 'MEDICINE' });
    setShowForm(false);
  };

  const toggleDone = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const categoryColors = {
    MEDICINE: '#ff6b6b', HYDRATION: '#4facfe',
    FITNESS: '#6bcb77', NUTRITION: '#ffd93d', OTHER: '#00f5ff'
  };

  const categoryIcons = {
    MEDICINE: '💊', HYDRATION: '💧', FITNESS: '🏃', NUTRITION: '🥗', OTHER: '❤️'
  };

  const completedCount = reminders.filter(r => r.done).length;
  const healthScore = Math.round((completedCount / reminders.length) * 100) || 0;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>💊 Health Reminders</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Add Reminder
        </button>
      </div>

      {/* Health Score */}
      <div style={styles.scoreCard}>
        <div style={styles.scoreIcon}>❤️</div>
        <div style={styles.scoreInfo}>
          <div style={styles.scoreLabel}>Today's Health Score</div>
          <div style={styles.scoreValue}>{healthScore}%</div>
          <div style={styles.scoreBar}>
            <div style={{
              ...styles.scoreFill,
              width: `${healthScore}%`,
              background: healthScore > 70 ? '#6bcb77' : healthScore > 40 ? '#ffd93d' : '#ff6b6b'
            }} />
          </div>
          <div style={styles.scoreMsg}>
            {completedCount}/{reminders.length} reminders completed today
          </div>
        </div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Reminder Title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} />
          <input style={styles.input} type="time"
            value={formData.time}
            onChange={e => setFormData({...formData, time: e.target.value})} />
          <select style={styles.input}
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="MEDICINE">💊 Medicine</option>
            <option value="HYDRATION">💧 Hydration</option>
            <option value="FITNESS">🏃 Fitness</option>
            <option value="NUTRITION">🥗 Nutrition</option>
            <option value="OTHER">❤️ Other</option>
          </select>
          <button style={styles.addBtn} onClick={addReminder}>Save Reminder</button>
        </div>
      )}

      <div style={styles.reminderList}>
        {reminders.map(reminder => (
          <div key={reminder.id} style={{
            ...styles.reminderCard,
            opacity: reminder.done ? 0.6 : 1,
            borderLeft: `4px solid ${categoryColors[reminder.category] || '#00f5ff'}`
          }}>
            <div style={styles.reminderLeft}>
              <div style={styles.reminderIcon}>
                {categoryIcons[reminder.category] || '❤️'}
              </div>
              <div style={styles.reminderInfo}>
                <div style={{
                  ...styles.reminderTitle,
                  textDecoration: reminder.done ? 'line-through' : 'none'
                }}>{reminder.title}</div>
                <div style={styles.reminderMeta}>
                  <span style={styles.reminderTime}>⏰ {reminder.time}</span>
                  <span style={{
                    ...styles.categoryBadge,
                    background: categoryColors[reminder.category] || '#00f5ff'
                  }}>{reminder.category}</span>
                </div>
              </div>
            </div>
            <div style={styles.reminderActions}>
              <button style={{
                ...styles.doneBtn,
                background: reminder.done ? '#444' : '#6bcb77'
              }} onClick={() => toggleDone(reminder.id)}>
                {reminder.done ? '↩ Undo' : '✓ Done'}
              </button>
              <button style={styles.deleteBtn} onClick={() => deleteReminder(reminder.id)}>
                🗑
              </button>
            </div>
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
  scoreCard: { background: '#12121a', border: '1px solid #ff6b6b44', borderRadius: '12px',
    padding: '24px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center',
    boxShadow: '0 0 20px #ff6b6b11' },
  scoreIcon: { fontSize: '48px' },
  scoreInfo: { flex: 1 },
  scoreLabel: { color: '#aaa', fontSize: '14px', marginBottom: '4px' },
  scoreValue: { fontSize: '36px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 10px #00f5ff55', marginBottom: '8px' },
  scoreBar: { height: '8px', background: '#1a1a2e', borderRadius: '4px', marginBottom: '8px' },
  scoreFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  scoreMsg: { color: '#666', fontSize: '14px' },
  form: { background: '#12121a', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', border: '1px solid #00f5ff33' },
  input: { width: '100%', padding: '12px', marginBottom: '12px',
    border: '1px solid #00f5ff33', borderRadius: '8px', fontSize: '16px',
    boxSizing: 'border-box', background: '#0a0a0f', color: '#00f5ff' },
  reminderList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reminderCard: { background: '#12121a', padding: '20px', borderRadius: '12px',
    border: '1px solid #00f5ff22', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 0 15px #00f5ff11' },
  reminderLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  reminderIcon: { fontSize: '32px' },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: '16px', fontWeight: 'bold', color: '#00f5ff', marginBottom: '4px' },
  reminderMeta: { display: 'flex', gap: '12px', alignItems: 'center' },
  reminderTime: { color: '#666', fontSize: '14px' },
  categoryBadge: { color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  reminderActions: { display: 'flex', gap: '8px' },
  doneBtn: { color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  deleteBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)', color: 'white', border: 'none',
    padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' },
};

export default Health;