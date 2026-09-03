import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";

function Analytics({ user }) {
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, e, g, n] = await Promise.all([
        fetch(`http://localhost:8080/api/tasks/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`http://localhost:8080/api/expenses/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`http://localhost:8080/api/goals/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`http://localhost:8080/api/notes/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
      ]);
      setTasks(Array.isArray(t) ? t : []);
      setExpenses(Array.isArray(e) ? e : []);
      setGoals(Array.isArray(g) ? g : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length;
  const pendingTasks = tasks.filter(t => t.status === "PENDING").length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const completedGoals = goals.filter(g => g.status === "COMPLETED").length;
  const avgGoalProgress = goals.length === 0
    ? 0
    : Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length);

  const productivityScore = Math.min(100, Math.round(
    completedTasks * 20 + completedGoals * 30 + notes.length * 10 + avgGoalProgress * 0.4
  ));

  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const COLORS = ["#00F5FF", "#7B2FFF", "#6BCB77", "#FFD93D", "#FF6B6B", "#4FACFE"];

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const taskData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks }
  ];
  const goalData = goals.map(g => ({ name: g.title, progress: g.progress }));

  return (
    <div>
      <h1 style={styles.title}>📈 Analytics Dashboard</h1>
      <p style={styles.subtitle}>Your productivity insights powered by NEXUS AI</p>

      {/* Productivity Score */}
      <div style={styles.scoreCard}>
        <div style={styles.scoreLeft}>
          <div style={styles.scoreLabel}>⚡ NEXUS Productivity Score</div>
          <div style={styles.scoreValue}>{productivityScore}</div>
          <div style={styles.scoreMax}>/100</div>
        </div>
        <div style={styles.scoreRight}>
          <div style={styles.scoreBar}>
            <div style={{
              ...styles.scoreFill,
              width: `${productivityScore}%`,
              background: productivityScore > 70 ? "#00f5ff" : productivityScore > 40 ? "#ffd93d" : "#ff6b6b"
            }} />
          </div>
          <div style={styles.scoreMsg}>
            {productivityScore > 70 ? "🔥 Excellent! Keep it up!"
              : productivityScore > 40 ? "💪 Good Progress!"
              : "🚀 Let's Get Started!"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Total Tasks</div>
            <div style={styles.statValue}>{tasks.length}</div>
            <div style={styles.statSub}>✅ {completedTasks} Completed | ⏳ {pendingTasks} Pending</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Total Expenses</div>
            <div style={{...styles.statValue, color: "#f093fb"}}>₹{totalExpenses.toFixed(2)}</div>
            <div style={styles.statSub}>{expenses.length} Transactions</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Goal Progress</div>
            <div style={{...styles.statValue, color: "#6bcb77"}}>{avgGoalProgress}%</div>
            <div style={styles.statSub}>{completedGoals}/{goals.length} Completed</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Notes</div>
            <div style={{...styles.statValue, color: "#ffd93d"}}>{notes.length}</div>
            <div style={styles.statSub}>Notes Created</div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>🥧 Expense Distribution</h3>
        {pieData.length === 0 ? (
          <div style={styles.noData}>No expense data yet!</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={110} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{background: '#12121a', border: '1px solid #00f5ff33', color: '#00f5ff'}} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>📊 Task Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{background: '#12121a', border: '1px solid #00f5ff33', color: '#00f5ff'}} />
            <Bar dataKey="value" fill="#00F5FF" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>📈 Goal Progress</h3>
        {goalData.length === 0 ? (
          <div style={styles.noData}>No goals set yet!</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={goalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis domain={[0, 100]} stroke="#aaa" />
              <Tooltip contentStyle={{background: '#12121a', border: '1px solid #00f5ff33', color: '#00f5ff'}} />
              <Line type="monotone" dataKey="progress" stroke="#6BCB77" strokeWidth={3} dot={{fill: '#6BCB77'}} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Insights */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>🤖 NEXUS AI Insights</h3>
        <div style={{color: "#ccc", lineHeight: "30px"}}>
          {productivityScore >= 80 && <p>🔥 Excellent productivity! Keep your momentum going.</p>}
          {productivityScore >= 50 && productivityScore < 80 && <p>💪 You're making good progress. Complete a few more tasks to increase your score.</p>}
          {productivityScore < 50 && <p>🚀 Start completing tasks and goals consistently to improve productivity.</p>}
          <p>📅 Total Tasks: {tasks.length}</p>
          <p>🎯 Goals: {completedGoals}/{goals.length}</p>
          <p>💰 Total Expenses: ₹{totalExpenses.toFixed(2)}</p>
          <p>📝 Notes: {notes.length}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', color: '#00f5ff', textShadow: '0 0 10px #00f5ff55', marginBottom: '4px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  scoreCard: { background: '#12121a', border: '1px solid #00f5ff44', borderRadius: '12px', padding: '24px',
    marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center', boxShadow: '0 0 30px #00f5ff11' },
  scoreLeft: { textAlign: 'center', minWidth: '120px' },
  scoreLabel: { color: '#00f5ff', fontSize: '14px', marginBottom: '8px' },
  scoreValue: { fontSize: '64px', fontWeight: 'bold', color: '#00f5ff', textShadow: '0 0 20px #00f5ff' },
  scoreMax: { color: '#666', fontSize: '16px' },
  scoreRight: { flex: 1 },
  scoreBar: { height: '12px', background: '#1a1a2e', borderRadius: '6px', marginBottom: '12px' },
  scoreFill: { height: '100%', borderRadius: '6px', transition: 'width 0.5s', boxShadow: '0 0 10px #00f5ff' },
  scoreMsg: { color: '#aaa', fontSize: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#12121a', border: '1px solid #00f5ff22', borderRadius: '12px', padding: '20px',
    display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 0 15px #00f5ff11' },
  statIcon: { fontSize: '36px' },
  statInfo: { flex: 1 },
  statTitle: { color: '#666', fontSize: '12px', marginBottom: '4px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#00f5ff', marginBottom: '4px' },
  statSub: { color: '#444', fontSize: '11px' },
  chartCard: { background: '#12121a', border: '1px solid #00f5ff22', borderRadius: '12px',
    padding: '24px', marginBottom: '16px', boxShadow: '0 0 15px #00f5ff11' },
  chartTitle: { color: '#00f5ff', marginBottom: '16px', fontSize: '16px' },
  noData: { color: '#444', textAlign: 'center', padding: '20px' },
};

export default Analytics;