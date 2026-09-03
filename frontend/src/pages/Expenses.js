import React, { useState, useEffect } from 'react';

function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', category: 'FOOD', description: '', date: '', userId: user.userId
  });
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
  try {

    const res = await fetch(
      `http://localhost:8080/api/expenses/user/${user.userId}`,
      {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();

    console.log("EXPENSE RESPONSE:", data);


    if (Array.isArray(data)) {
    setExpenses(data);
} else if (data) {
    setExpenses([data]);
} else {
    setExpenses([]);
}


  } catch(error){

    console.log("Expense Error:", error);
    setExpenses([]);

  }
};

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, userId: user.userId})
      });
      setShowForm(false);
      setFormData({ amount: '', category: 'FOOD', description: '', date: '', userId: user.userId });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColors = {
    FOOD: '#ff6b6b', TRANSPORT: '#4facfe', SHOPPING: '#f093fb',
    HEALTH: '#6bcb77', EDUCATION: '#ffd93d', OTHER: '#00f5ff'
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>💰 Expense Tracking</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Add Expense
        </button>
      </div>

      <div style={styles.totalCard}>
        <div style={styles.totalLabel}>Total Expenses</div>
        <div style={styles.totalAmount}>₹{total.toFixed(2)}</div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} type="number" placeholder="Amount (₹)"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})} />
          <select style={styles.input}
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="FOOD">🍕 Food</option>
            <option value="TRANSPORT">🚗 Transport</option>
            <option value="SHOPPING">🛍 Shopping</option>
            <option value="HEALTH">💊 Health</option>
            <option value="EDUCATION">📚 Education</option>
            <option value="OTHER">📦 Other</option>
          </select>
          <input style={styles.input} placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} />
          <input style={styles.input} type="date"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})} />
          <button style={styles.addBtn} onClick={handleSubmit}>Save Expense</button>
        </div>
      )}

      <div style={styles.expenseList}>
        {expenses.length === 0 && (
          <div style={styles.empty}>No expenses yet! Click "Add Expense" to get started.</div>
        )}
        {Array.isArray(expenses) && expenses.map(expense => (
          <div key={expense.id} style={styles.expenseCard}>
            <div style={{...styles.categoryBadge,
              background: categoryColors[expense.category] || '#667eea'}}>
              {expense.category}
            </div>
            <div style={styles.expenseInfo}>
              <div style={styles.expenseDesc}>{expense.description}</div>
              <div style={styles.expenseDate}>📅 {expense.date}</div>
            </div>
            <div style={styles.expenseAmount}>₹{expense.amount}</div>
            <button style={styles.deleteBtn} onClick={() => deleteExpense(expense.id)}>
              🗑
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
  totalCard: { background: 'linear-gradient(135deg, #12121a, #0d0d1a)',
    color: '#00f5ff', padding: '24px', borderRadius: '12px', marginBottom: '24px',
    textAlign: 'center', border: '1px solid #00f5ff44', boxShadow: '0 0 30px #00f5ff11' },
  totalLabel: { fontSize: '16px', opacity: 0.9, marginBottom: '8px', color: '#aaa' },
  totalAmount: { fontSize: '40px', fontWeight: 'bold', color: '#00f5ff', textShadow: '0 0 10px #00f5ff55' },
  form: { background: '#12121a', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', border: '1px solid #00f5ff33' },
  input: { width: '100%', padding: '12px', marginBottom: '12px',
    border: '1px solid #00f5ff33', borderRadius: '8px', fontSize: '16px',
    boxSizing: 'border-box', background: '#0a0a0f', color: '#00f5ff' },
  expenseList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#444', padding: '40px', fontSize: '18px' },
  expenseCard: { background: '#12121a', padding: '20px', borderRadius: '12px',
    border: '1px solid #00f5ff22', display: 'flex',
    alignItems: 'center', gap: '16px', boxShadow: '0 0 15px #00f5ff11' },
  categoryBadge: { color: 'white', padding: '8px 16px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' },
  expenseInfo: { flex: 1 },
  expenseDesc: { fontWeight: 'bold', color: '#00f5ff', marginBottom: '4px' },
  expenseDate: { color: '#666', fontSize: '14px' },
  expenseAmount: { fontSize: '20px', fontWeight: 'bold', color: '#7b2fff' },
  deleteBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)', color: 'white', border: 'none',
    padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' },
};

export default Expenses;