import React, { useState, useEffect } from 'react';
import Tasks from './Tasks';
import Expenses from './Expenses';
import Goals from './Goals';
import Notes from './Notes';
import AiChat from './AiChat';
import Health from './Health';
import Analytics from './Analytics';
import Profile from './Profile';
import Settings from './Settings';

function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [time, setTime] = useState(new Date());

  if (user && user.userId) {
    fetchDashboardData();

    fetch(`http://localhost:8081/api/productivity/score/${user.userId}`)
        .then(res => res.json())
        .then(data => {
            setProductivityScore(data.score);
        })
        .catch(error => {
            console.error("Failed to fetch productivity score:", error);
        });

    fetch(`http://localhost:8081/api/recommendations/${user.userId}`)
        .then(res => res.json())
        .then(data => {
            setRecommendations(data.recommendations || []);
        })
        .catch(error => {
            console.error("Failed to fetch recommendations:", error);
        });
}

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timer);
}, [user]);

  const fetchData = async (url) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(url, "STATUS:", res.status);

    if (!res.ok) {
      throw new Error(`API Error ${res.status}`);
    }

    return await res.json();
  };

  const fetchDashboardData = async () => {
    try {
      const [t, e, g] = await Promise.all([
        fetchData(`http://localhost:8080/api/tasks/user/${user.userId}`),
        fetchData(`http://localhost:8080/api/expenses/user/${user.userId}`),
        fetchData(`http://localhost:8080/api/goals/user/${user.userId}`)
      ]);

      console.log("TASK DATA:", t);
      console.log("EXPENSE DATA:", e);
      console.log("GOAL DATA:", g);

      setTasks(Array.isArray(t) ? t : []);
      setExpenses(Array.isArray(e) ? e : []);
      setGoals(Array.isArray(g) ? g : []);

    } catch (error) {
      console.error("DASHBOARD FETCH ERROR:", error);

      setTasks([]);
      setExpenses([]);
      setGoals([]);
    }
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '📅', label: 'Tasks' },
    { id: 'expenses', icon: '💰', label: 'Expenses' },
    { id: 'goals', icon: '🎯', label: 'Goals' },
    { id: 'notes', icon: '📚', label: 'Notes' },
    { id: 'ai', icon: '🤖', label: 'AI Chat' },
    { id: 'health', icon: '💊', label: 'Health' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab user={user} tasks={tasks} expenses={expenses} goals={goals} time={time} setActiveTab={setActiveTab} />;
      case 'tasks': return <Tasks user={user} />;
      case 'expenses': return <Expenses user={user} />;
      case 'goals': return <Goals user={user} />;
      case 'notes': return <Notes user={user} />;
      case 'ai': return <AiChat user={user} />;
      case 'health': return <Health user={user} />;
      case 'analytics': return <Analytics user={user} />;
      case 'profile': return <Profile user={user} setUser={setUser} />;
      case 'settings': return <Settings user={user} />;
      default: return <HomeTab user={user} tasks={tasks} expenses={expenses} goals={goals} time={time} setActiveTab={setActiveTab} />;
    }
  };



  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>⚡ NEXUS</div>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div style={styles.userName}>{user.name}</div>
          <div style={styles.userBadge}>⚡ NEXUS User</div>
          <div style={styles.scoreWidget}>
            <div style={styles.scoreLabel}>Productivity</div>
            <div style={styles.scoreVal}>{productivityScore}%</div>
            <div style={styles.scoreBar}>
              <div style={{
                ...styles.scoreFill,
                width: `${productivityScore}%`,
                background: productivityScore > 70 ? '#6bcb77' : productivityScore > 40 ? '#ffd93d' : '#ff6b6b'
              }} />
            </div>
          </div>
        </div>
        {menuItems.map(item => (
          <div key={item.id}
            style={{ ...styles.menuItem, ...(activeTab === item.id ? styles.activeMenu : {}) }}
            onClick={() => setActiveTab(item.id)}>
            <span style={styles.menuIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {activeTab === item.id && <span style={styles.menuArrow}>›</span>}
          </div>
        ))}
        <div style={styles.menuItem} onClick={handleLogout}>
          <span style={styles.menuIcon}>🚪</span>
          <span>Logout</span>
        </div>
        <div style={styles.sidebarFooter}>
          <div style={styles.clockDisplay}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={styles.dateDisplay}>
            {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {renderContent()}
      </div>
    </div>
  );
}

function HomeTab({ user, tasks, expenses, goals, time, setActiveTab }) {
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'HIGH' && t.status === 'PENDING');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todayExpenses = expenses.filter(e => e.date === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + e.amount, 0);
  const avgGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
  const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;

  const productivityScore = Math.min(100, Math.round(
    (completedTasks * 20) + (completedGoals * 30) + (avgGoalProgress * 0.4)
  ));

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const getAIRecommendation = () => {
    if (highPriorityTasks.length > 0) {
      return `🔥 You have ${highPriorityTasks.length} HIGH priority task(s) pending. Focus on "${highPriorityTasks[0].title}" first!`;
    } else if (avgGoalProgress < 50) {
      return `🎯 Your goals are ${avgGoalProgress}% complete. Spend 30 minutes today working on your goals!`;
    } else if (todayExpenses > 500) {
      return `💰 You've spent ₹${todayExpenses} today. Consider reviewing your expenses!`;
    } else if (pendingTasks > 5) {
      return `📅 You have ${pendingTasks} pending tasks. Try completing 3 today!`;
    } else {
      return `⚡ Great job! Keep your momentum going. Review your Analytics for insights!`;
    }
  };

  return (
    <div>
      {/* Greeting */}
      <div style={styles.greetingSection}>
        <div>
          <h1 style={styles.greeting}>{greetingEmoji} {greeting}, {user.name}!</h1>
          <p style={styles.greetingSubtitle}>
            {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={styles.productivityBadge}>
          <div style={styles.prodScore}>{productivityScore}</div>
          <div style={styles.prodLabel}>Productivity<br />Score</div>
        </div>
      </div>

      {/* AI Daily Recommendation */}
      <div style={styles.aiRecommendation}>
        <div style={styles.aiRecHeader}>
          <span style={styles.aiRecIcon}>🤖</span>
          <span style={styles.aiRecTitle}>NEXUS AI Daily Recommendation</span>
        </div>
        <p style={styles.aiRecText}>
  {getAIRecommendation()}
</p>
        <button style={styles.aiRecBtn} onClick={() => setActiveTab('ai')}>
          Ask AI for more tips →
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, borderTop: '3px solid #00f5ff'}}
          onClick={() => setActiveTab('tasks')}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Tasks</div>
            <div style={styles.statValue}>{tasks.length}</div>
            <div style={styles.statSub}>✅ {completedTasks} done | ⏳ {pendingTasks} pending</div>
            <div style={styles.statBar}>
              <div style={{
                ...styles.statBarFill,
                width: tasks.length > 0 ? `${(completedTasks / tasks.length) * 100}%` : '0%',
                background: '#00f5ff'
              }} />
            </div>
          </div>
        </div>

        <div style={{...styles.statCard, borderTop: '3px solid #f093fb'}}
          onClick={() => setActiveTab('expenses')}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Expenses</div>
            <div style={{...styles.statValue, color: '#f093fb'}}>₹{totalExpenses.toFixed(0)}</div>
            <div style={styles.statSub}>Today: ₹{todayExpenses.toFixed(0)} | {expenses.length} total</div>
            <div style={styles.statBar}>
              <div style={{...styles.statBarFill, width: '60%', background: '#f093fb'}} />
            </div>
          </div>
        </div>

        <div style={{...styles.statCard, borderTop: '3px solid #6bcb77'}}
          onClick={() => setActiveTab('goals')}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Goals</div>
            <div style={{...styles.statValue, color: '#6bcb77'}}>{avgGoalProgress}%</div>
            <div style={styles.statSub}>✅ {completedGoals} done | 📌 {goals.length} total</div>
            <div style={styles.statBar}>
              <div style={{
                ...styles.statBarFill,
                width: `${avgGoalProgress}%`,
                background: '#6bcb77'
              }} />
            </div>
          </div>
        </div>

        <div style={{...styles.statCard, borderTop: '3px solid #ffd93d'}}
          onClick={() => setActiveTab('analytics')}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statInfo}>
            <div style={styles.statTitle}>Productivity</div>
            <div style={{...styles.statValue, color: '#ffd93d'}}>{productivityScore}%</div>
            <div style={styles.statSub}>Overall performance score</div>
            <div style={styles.statBar}>
              <div style={{
                ...styles.statBarFill,
                width: `${productivityScore}%`,
                background: '#ffd93d'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoCol}>
        {/* High Priority Tasks */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetTitle}>🔥 High Priority Tasks</span>
            <button style={styles.widgetBtn} onClick={() => setActiveTab('tasks')}>View All →</button>
          </div>
          {highPriorityTasks.length === 0 ? (
            <div style={styles.emptyWidget}>
              <div style={{fontSize: '32px', marginBottom: '8px'}}>✅</div>
              <div style={{color: '#444'}}>No high priority tasks!</div>
            </div>
          ) : (
            highPriorityTasks.slice(0, 4).map(task => (
              <div key={task.id} style={styles.taskItem}>
                <div style={styles.taskDot} />
                <div style={styles.taskItemInfo}>
                  <div style={styles.taskItemTitle}>{task.title}</div>
                  {task.dueDate && (
                    <div style={styles.taskItemDate}>📅 {task.dueDate}</div>
                  )}
                </div>
                <span style={styles.highBadge}>HIGH</span>
              </div>
            ))
          )}
        </div>

        {/* Goal Progress */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetTitle}>🎯 Goal Progress</span>
            <button style={styles.widgetBtn} onClick={() => setActiveTab('goals')}>View All →</button>
          </div>
          {goals.length === 0 ? (
            <div style={styles.emptyWidget}>
              <div style={{fontSize: '32px', marginBottom: '8px'}}>🎯</div>
              <div style={{color: '#444'}}>No goals set yet!</div>
            </div>
          ) : (
            goals.slice(0, 4).map(goal => (
              <div key={goal.id} style={styles.goalItem}>
                <div style={styles.goalItemHeader}>
                  <span style={styles.goalItemTitle}>{goal.title}</span>
                  <span style={{
                    ...styles.goalItemPct,
                    color: goal.progress >= 100 ? '#6bcb77' : '#00f5ff'
                  }}>{goal.progress}%</span>
                </div>
                <div style={styles.goalBar}>
                  <div style={{
                    ...styles.goalBarFill,
                    width: `${goal.progress}%`,
                    background: goal.progress >= 100
                      ? '#6bcb77'
                      : 'linear-gradient(90deg, #00f5ff, #7b2fff)'
                  }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expense Summary */}
      <div style={styles.widget}>
        <div style={styles.widgetHeader}>
          <span style={styles.widgetTitle}>💰 Recent Expenses</span>
          <button style={styles.widgetBtn} onClick={() => setActiveTab('expenses')}>View All →</button>
        </div>
        {expenses.length === 0 ? (
          <div style={styles.emptyWidget}>
            <div style={{fontSize: '32px', marginBottom: '8px'}}>💰</div>
            <div style={{color: '#444'}}>No expenses tracked yet!</div>
          </div>
        ) : (
          <div style={styles.expenseGrid}>
            {expenses.slice(-4).reverse().map(exp => (
              <div key={exp.id} style={styles.expenseItem}>
                <div style={styles.expCat}>{exp.category}</div>
                <div style={styles.expDesc}>{exp.description || exp.category}</div>
                <div style={styles.expAmt}>₹{exp.amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.widget}>
        <div style={styles.widgetHeader}>
          <span style={styles.widgetTitle}>⚡ Quick Actions</span>
        </div>
        <div style={styles.quickActions}>
          {[
            { icon: '📅', label: 'Add Task', tab: 'tasks' },
            { icon: '💰', label: 'Add Expense', tab: 'expenses' },
            { icon: '🎯', label: 'Set Goal', tab: 'goals' },
            { icon: '📚', label: 'New Note', tab: 'notes' },
            { icon: '🤖', label: 'Ask AI', tab: 'ai' },
            { icon: '📈', label: 'Analytics', tab: 'analytics' },
          ].map((action, i) => (
            <div key={i} style={styles.quickAction}
              onClick={() => setActiveTab(action.tab)}>
              <div style={styles.quickIcon}>{action.icon}</div>
              <div style={styles.quickLabel}>{action.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#0a0a0f' },
  sidebar: { width: '240px', background: '#0d0d1a', color: 'white', padding: '20px',
    display: 'flex', flexDirection: 'column', borderRight: '1px solid #00f5ff22',
    position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  logo: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center',
    color: '#00f5ff', textShadow: '0 0 15px #00f5ff' },
  userInfo: { textAlign: 'center', marginBottom: '20px', padding: '16px',
    background: '#12121a', borderRadius: '12px', border: '1px solid #00f5ff22' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 'bold', margin: '0 auto 8px',
    boxShadow: '0 0 15px #00f5ff55' },
  userName: { fontSize: '14px', color: '#fff', fontWeight: 'bold' },
  userBadge: { fontSize: '11px', color: '#00f5ff', marginTop: '4px',
    background: '#00f5ff11', padding: '2px 8px', borderRadius: '10px',
    display: 'inline-block', marginBottom: '10px' },
  scoreWidget: { marginTop: '8px' },
  scoreLabel: { fontSize: '11px', color: '#666', marginBottom: '2px' },
  scoreVal: { fontSize: '18px', fontWeight: 'bold', color: '#00f5ff' },
  scoreBar: { height: '4px', background: '#1a1a2e', borderRadius: '2px', marginTop: '4px' },
  scoreFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s' },
  menuItem: { display: 'flex', alignItems: 'center', padding: '10px 14px',
    borderRadius: '8px', cursor: 'pointer', marginBottom: '2px',
    transition: 'all 0.2s', color: '#666', fontSize: '14px' },
  activeMenu: { background: 'linear-gradient(135deg, #00f5ff15, #7b2fff15)',
    color: '#00f5ff', borderLeft: '3px solid #00f5ff' },
  menuIcon: { marginRight: '10px', fontSize: '16px' },
  menuArrow: { marginLeft: 'auto', color: '#00f5ff' },
  sidebarFooter: { marginTop: 'auto', paddingTop: '16px', textAlign: 'center',
    borderTop: '1px solid #1a1a2e' },
  clockDisplay: { fontSize: '18px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 8px #00f5ff55', fontFamily: 'monospace' },
  dateDisplay: { fontSize: '11px', color: '#444', marginTop: '4px' },
  main: { flex: 1, padding: '32px', background: '#0a0a0f', overflowY: 'auto' },
  greetingSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px' },
  greeting: { fontSize: '26px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 10px #00f5ff33', margin: 0 },
  greetingSubtitle: { color: '#444', fontSize: '13px', marginTop: '4px' },
  productivityBadge: { background: '#12121a', border: '1px solid #00f5ff33',
    borderRadius: '12px', padding: '16px 24px', textAlign: 'center',
    boxShadow: '0 0 20px #00f5ff11' },
  prodScore: { fontSize: '36px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 15px #00f5ff' },
  prodLabel: { fontSize: '11px', color: '#666', marginTop: '4px', lineHeight: '1.4' },
  aiRecommendation: { background: 'linear-gradient(135deg, #12121a, #0d0d1a)',
    border: '1px solid #00f5ff44', borderRadius: '12px', padding: '20px',
    marginBottom: '24px', boxShadow: '0 0 20px #00f5ff11' },
  aiRecHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  aiRecIcon: { fontSize: '20px' },
  aiRecTitle: { color: '#00f5ff', fontWeight: 'bold', fontSize: '14px' },
  aiRecText: { color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' },
  aiRecBtn: { background: 'transparent', border: '1px solid #00f5ff44',
    color: '#00f5ff', padding: '6px 16px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px', marginBottom: '24px' },
  statCard: { background: '#12121a', padding: '20px', borderRadius: '12px',
    border: '1px solid #00f5ff11', cursor: 'pointer',
    boxShadow: '0 0 15px #00f5ff05', transition: 'all 0.2s' },
  statIcon: { fontSize: '28px', marginBottom: '10px' },
  statInfo: {},
  statTitle: { color: '#666', fontSize: '12px', marginBottom: '4px' },
  statValue: { fontSize: '22px', fontWeight: 'bold', color: '#00f5ff', marginBottom: '4px' },
  statSub: { color: '#444', fontSize: '11px', marginBottom: '8px' },
  statBar: { height: '4px', background: '#1a1a2e', borderRadius: '2px' },
  statBarFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  widget: { background: '#12121a', border: '1px solid #00f5ff11',
    borderRadius: '12px', padding: '20px', marginBottom: '16px',
    boxShadow: '0 0 15px #00f5ff05' },
  widgetHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px' },
  widgetTitle: { color: '#00f5ff', fontWeight: 'bold', fontSize: '14px' },
  widgetBtn: { background: 'transparent', border: '1px solid #00f5ff33',
    color: '#00f5ff', padding: '4px 12px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '12px' },
  emptyWidget: { textAlign: 'center', padding: '24px', color: '#444' },
  taskItem: { display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 0', borderBottom: '1px solid #1a1a2e' },
  taskDot: { width: '8px', height: '8px', borderRadius: '50%',
    background: '#ff6b6b', flexShrink: 0, boxShadow: '0 0 6px #ff6b6b' },
  taskItemInfo: { flex: 1 },
  taskItemTitle: { color: '#ccc', fontSize: '13px', fontWeight: 'bold' },
  taskItemDate: { color: '#444', fontSize: '11px', marginTop: '2px' },
  highBadge: { background: '#ff6b6b22', color: '#ff6b6b',
    padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
  goalItem: { marginBottom: '14px' },
  goalItemHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  goalItemTitle: { color: '#ccc', fontSize: '13px' },
  goalItemPct: { fontSize: '13px', fontWeight: 'bold' },
  goalBar: { height: '6px', background: '#1a1a2e', borderRadius: '3px' },
  goalBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s',
    boxShadow: '0 0 6px #00f5ff44' },
  expenseGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  expenseItem: { background: '#0a0a0f', border: '1px solid #1a1a2e',
    borderRadius: '8px', padding: '12px', textAlign: 'center' },
  expCat: { fontSize: '10px', color: '#00f5ff', fontWeight: 'bold',
    marginBottom: '4px', textTransform: 'uppercase' },
  expDesc: { fontSize: '12px', color: '#666', marginBottom: '6px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  expAmt: { fontSize: '16px', fontWeight: 'bold', color: '#f093fb' },
  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' },
  quickAction: { background: '#0a0a0f', border: '1px solid #00f5ff22',
    borderRadius: '10px', padding: '16px 8px', textAlign: 'center',
    cursor: 'pointer', transition: 'all 0.2s' },
  quickIcon: { fontSize: '24px', marginBottom: '6px' },
  quickLabel: { fontSize: '11px', color: '#666' },
};

export default Dashboard;