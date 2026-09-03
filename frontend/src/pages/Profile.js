import React, { useState } from 'react';

function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedUser = { ...user, name };
    localStorage.setItem('name', name);
    setUser(updatedUser);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { icon: '📅', label: 'Member Since', value: 'Jul 2026' },
    { icon: '⚡', label: 'NEXUS ID', value: `#${user.userId}` },
    { icon: '🌍', label: 'Region', value: 'India' },
    { icon: '💎', label: 'Plan', value: 'NEXUS Pro' },
  ];

  const achievements = [
    { icon: '🔥', title: 'First Login', desc: 'Welcome to NEXUS!', unlocked: true },
    { icon: '📅', title: 'Task Master', desc: 'Complete 10 tasks', unlocked: false },
    { icon: '💰', title: 'Budget Pro', desc: 'Track 20 expenses', unlocked: false },
    { icon: '🎯', title: 'Goal Getter', desc: 'Complete 5 goals', unlocked: false },
    { icon: '📚', title: 'Note Taker', desc: 'Create 10 notes', unlocked: false },
    { icon: '🤖', title: 'AI Explorer', desc: 'Chat with AI 10 times', unlocked: true },
  ];

  return (
    <div>
      <h1 style={styles.title}>👤 Profile</h1>
      <p style={styles.subtitle}>Manage your NEXUS account</p>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.avatarGlow} />
        </div>

        <div style={styles.profileInfo}>
          {editing ? (
            <div style={styles.editRow}>
              <input
                style={styles.editInput}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
              <button style={styles.saveBtn} onClick={handleSave}>Save</button>
              <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div style={styles.nameRow}>
              <h2 style={styles.profileName}>{name}</h2>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit</button>
            </div>
          )}
          <div style={styles.profileEmail}>{user.email || 'nexus@user.com'}</div>
          <div style={styles.profileBadge}>⚡ NEXUS Pro Member</div>
          {saved && <div style={styles.savedMsg}>✅ Profile updated!</div>}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{stat.icon}</div>
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🏆 Achievements</h3>
        <div style={styles.achievementGrid}>
          {achievements.map((ach, i) => (
            <div key={i} style={{
              ...styles.achievementCard,
              opacity: ach.unlocked ? 1 : 0.4,
              border: ach.unlocked ? '1px solid #00f5ff44' : '1px solid #333'
            }}>
              <div style={styles.achIcon}>{ach.icon}</div>
              <div style={styles.achTitle}>{ach.title}</div>
              <div style={styles.achDesc}>{ach.desc}</div>
              {ach.unlocked && <div style={styles.achUnlocked}>✅ Unlocked</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={styles.dangerZone}>
        <h3 style={styles.dangerTitle}>⚠️ Account Actions</h3>
        <div style={styles.dangerButtons}>
          <button style={styles.logoutBtn} onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 10px #00f5ff55', marginBottom: '4px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  profileCard: { background: '#12121a', border: '1px solid #00f5ff33',
    borderRadius: '16px', padding: '32px', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '32px',
    boxShadow: '0 0 30px #00f5ff11' },
  avatarSection: { position: 'relative' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '40px', fontWeight: 'bold', color: 'white',
    position: 'relative', zIndex: 1 },
  avatarGlow: { position: 'absolute', top: '-5px', left: '-5px',
    width: '110px', height: '110px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #00f5ff44, #7b2fff44)',
    filter: 'blur(10px)', zIndex: 0 },
  profileInfo: { flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' },
  profileName: { fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 },
  editBtn: { background: 'transparent', border: '1px solid #00f5ff44',
    color: '#00f5ff', padding: '6px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px' },
  editRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' },
  editInput: { padding: '10px 14px', background: '#0a0a0f',
    border: '1px solid #00f5ff44', borderRadius: '8px',
    color: '#00f5ff', fontSize: '16px', outline: 'none' },
  saveBtn: { background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer' },
  cancelBtn: { background: 'transparent', border: '1px solid #333',
    color: '#666', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  profileEmail: { color: '#666', fontSize: '14px', marginBottom: '8px' },
  profileBadge: { display: 'inline-block', background: '#00f5ff11',
    border: '1px solid #00f5ff33', color: '#00f5ff',
    padding: '4px 14px', borderRadius: '20px', fontSize: '12px' },
  savedMsg: { color: '#6bcb77', fontSize: '13px', marginTop: '8px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px', marginBottom: '24px' },
  statCard: { background: '#12121a', border: '1px solid #00f5ff11',
    borderRadius: '12px', padding: '20px', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statLabel: { color: '#666', fontSize: '11px', marginBottom: '4px' },
  statValue: { color: '#00f5ff', fontWeight: 'bold', fontSize: '16px' },
  section: { background: '#12121a', border: '1px solid #00f5ff11',
    borderRadius: '12px', padding: '24px', marginBottom: '16px' },
  sectionTitle: { color: '#00f5ff', marginBottom: '16px', fontSize: '16px' },
  achievementGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  achievementCard: { background: '#0a0a0f', borderRadius: '12px',
    padding: '20px', textAlign: 'center' },
  achIcon: { fontSize: '32px', marginBottom: '8px' },
  achTitle: { color: '#fff', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' },
  achDesc: { color: '#666', fontSize: '12px', marginBottom: '8px' },
  achUnlocked: { color: '#6bcb77', fontSize: '11px' },
  dangerZone: { background: '#12121a', border: '1px solid #ff6b6b22',
    borderRadius: '12px', padding: '24px', marginBottom: '16px' },
  dangerTitle: { color: '#ff6b6b', marginBottom: '16px', fontSize: '16px' },
  dangerButtons: { display: 'flex', gap: '12px' },
  logoutBtn: { background: 'linear-gradient(135deg, #ff6b6b, #ff2255)',
    color: 'white', border: 'none', padding: '12px 24px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};

export default Profile;