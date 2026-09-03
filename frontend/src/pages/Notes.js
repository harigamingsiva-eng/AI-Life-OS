import React, { useState, useEffect } from 'react';

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'PERSONAL', userId: user.userId
  });

  const token = localStorage.getItem("token");
  useEffect(() => {
 if(user?.userId){
   fetchNotes();
 }
}, [user]);

  const fetchNotes = async () => {
  try {

    const res = await fetch(
      `http://localhost:8080/api/notes/user/${user.userId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
    setNotes(data);
} else if (data) {
    setNotes([data]);
} else {
    setNotes([]);
}

  } catch(error){

    console.error("FETCH NOTES ERROR:",error);
    setNotes([]);

  }
};

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8080/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, userId: user.userId})
      });
      setShowForm(false);
      setFormData({ title: '', content: '', category: 'PERSONAL', userId: user.userId });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColors = {
    PERSONAL: '#667eea', WORK: '#4facfe',
    STUDY: '#f093fb', OTHER: '#43e97b'
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Notes</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Add Note
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Note Title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea style={{...styles.input, height: '120px', resize: 'vertical'}}
            placeholder="Write your note here..."
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})} />
          <select style={styles.input}
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="PERSONAL">Personal</option>
            <option value="WORK">Work</option>
            <option value="STUDY">Study</option>
            <option value="OTHER">Other</option>
          </select>
          <button style={styles.addBtn} onClick={handleSubmit}>Save Note</button>
        </div>
      )}

      <div style={styles.noteGrid}>
        {notes.length === 0 && (
          <div style={styles.empty}>No notes yet! Click "Add Note" to get started.</div>
        )}
        {notes.map(note => (
          <div key={note.id} style={{
            ...styles.noteCard,
            borderTop: `4px solid ${categoryColors[note.category] || '#00f5ff'}`
          }}>
            <div style={styles.noteHeader}>
              <h3 style={styles.noteTitle}>{note.title}</h3>
              <button style={styles.deleteBtn} onClick={() => deleteNote(note.id)}>🗑</button>
            </div>
            <p style={styles.noteContent}>{note.content}</p>
            <div style={styles.noteFooter}>
              <span style={{
                ...styles.categoryBadge,
                background: categoryColors[note.category] || '#00f5ff'
              }}>{note.category}</span>
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
  form: { background: '#12121a', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', border: '1px solid #00f5ff33' },
  input: { width: '100%', padding: '12px', marginBottom: '12px',
    border: '1px solid #00f5ff33', borderRadius: '8px', fontSize: '16px',
    boxSizing: 'border-box', background: '#0a0a0f', color: '#00f5ff' },
  noteGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  empty: { textAlign: 'center', color: '#444', padding: '40px', fontSize: '18px', gridColumn: 'span 3' },
  noteCard: { background: '#12121a', padding: '20px', borderRadius: '12px',
    border: '1px solid #00f5ff22', boxShadow: '0 0 15px #00f5ff11' },
  noteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  noteTitle: { fontSize: '16px', fontWeight: 'bold', color: '#00f5ff' },
  noteContent: { color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' },
  noteFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)', color: 'white', border: 'none',
    padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' },
};
  
export default Notes;