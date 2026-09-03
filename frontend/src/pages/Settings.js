import React, { useState } from 'react';

function Settings({ user }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    language: 'English',
    currency: 'INR',
    timeFormat: '12hr',
    autoSave: true,
    compactView: false,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('nexusSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleSwitch = ({ value, onToggle }) => (
    <div onClick={onToggle} style={{
      ...switchStyles.track,
      background: value ? 'linear-gradient(135deg, #00f5ff, #7b2fff)' : '#1a1a2e',
      boxShadow: value ? '0 0 10px #00f5ff44' : 'none'
    }}>
      <div style={{
        ...switchStyles.thumb,
        transform: value ? 'translateX(22px)' : 'translateX(2px)'
      }} />
    </div>
  );

  const SelectInput = ({ value, options, onChange }) => (
    <select
      style={styles.select}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  return (
    <div>
      <h1 style={styles.title}>⚙️ Settings</h1>
      <p style={styles.subtitle}>Customize your NEXUS experience</p>

      {/* Notifications */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔔 Notifications</h3>
        {[
          { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts for tasks and reminders' },
          { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive daily summary via email' },
        ].map(item => (
          <div key={item.key} style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>{item.label}</div>
              <div style={styles.settingDesc}>{item.desc}</div>
            </div>
            <ToggleSwitch value={settings[item.key]} onToggle={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎨 Appearance</h3>
        {[
          { key: 'darkMode', label: 'Dark Mode', desc: 'NEXUS Cyber Dark theme' },
          { key: 'compactView', label: 'Compact View', desc: 'Show more content with less spacing' },
        ].map(item => (
          <div key={item.key} style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>{item.label}</div>
              <div style={styles.settingDesc}>{item.desc}</div>
            </div>
            <ToggleSwitch value={settings[item.key]} onToggle={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🌍 Preferences</h3>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Language</div>
            <div style={styles.settingDesc}>App display language</div>
          </div>
          <SelectInput
            value={settings.language}
            options={['English', 'Tamil', 'Hindi']}
            onChange={v => setSettings(prev => ({ ...prev, language: v }))}
          />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Currency</div>
            <div style={styles.settingDesc}>Default currency for expenses</div>
          </div>
          <SelectInput
            value={settings.currency}
            options={['INR', 'USD', 'EUR', 'GBP']}
            onChange={v => setSettings(prev => ({ ...prev, currency: v }))}
          />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Time Format</div>
            <div style={styles.settingDesc}>12hr or 24hr clock</div>
          </div>
          <SelectInput
            value={settings.timeFormat}
            options={['12hr', '24hr']}
            onChange={v => setSettings(prev => ({ ...prev, timeFormat: v }))}
          />
        </div>
      </div>

      {/* Data */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💾 Data & Storage</h3>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Auto Save</div>
            <div style={styles.settingDesc}>Automatically save your changes</div>
          </div>
          <ToggleSwitch value={settings.autoSave} onToggle={() => toggle('autoSave')} />
        </div>
        <div style={styles.dataActions}>
          <button style={styles.exportBtn}>📤 Export Data</button>
          <button style={styles.clearBtn}>🗑 Clear Cache</button>
        </div>
      </div>

      {/* About */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>ℹ️ About NEXUS</h3>
        <div style={styles.aboutGrid}>
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Build', value: '2026.07.04' },
            { label: 'Backend', value: 'Spring Boot 3.3' },
            { label: 'Frontend', value: 'React 18' },
            { label: 'Database', value: 'MySQL 8.0' },
            { label: 'AI Engine', value: 'NEXUS Intelligence' },
          ].map((item, i) => (
            <div key={i} style={styles.aboutItem}>
              <div style={styles.aboutLabel}>{item.label}</div>
              <div style={styles.aboutValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div style={styles.saveSection}>
        {saved && <div style={styles.savedMsg}>✅ Settings saved successfully!</div>}
        <button style={styles.saveBtn} onClick={handleSave}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

const switchStyles = {
  track: { width: '48px', height: '26px', borderRadius: '13px',
    cursor: 'pointer', position: 'relative', transition: 'all 0.3s' },
  thumb: { position: 'absolute', top: '3px', width: '20px', height: '20px',
    borderRadius: '50%', background: 'white', transition: 'transform 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)' },
};

const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', color: '#00f5ff',
    textShadow: '0 0 10px #00f5ff55', marginBottom: '4px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  section: { background: '#12121a', border: '1px solid #00f5ff11',
    borderRadius: '12px', padding: '24px', marginBottom: '16px' },
  sectionTitle: { color: '#00f5ff', marginBottom: '16px', fontSize: '16px' },
  settingRow: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '14px 0',
    borderBottom: '1px solid #1a1a2e' },
  settingInfo: { flex: 1 },
  settingLabel: { color: '#ccc', fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' },
  settingDesc: { color: '#444', fontSize: '12px' },
  select: { background: '#0a0a0f', border: '1px solid #00f5ff33',
    color: '#00f5ff', padding: '8px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', outline: 'none' },
  dataActions: { display: 'flex', gap: '12px', marginTop: '16px' },
  exportBtn: { background: 'linear-gradient(135deg, #00f5ff22, #7b2fff22)',
    border: '1px solid #00f5ff44', color: '#00f5ff',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  clearBtn: { background: 'transparent', border: '1px solid #ff6b6b44',
    color: '#ff6b6b', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  aboutGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  aboutItem: { background: '#0a0a0f', border: '1px solid #1a1a2e',
    borderRadius: '8px', padding: '14px', textAlign: 'center' },
  aboutLabel: { color: '#444', fontSize: '11px', marginBottom: '4px' },
  aboutValue: { color: '#00f5ff', fontWeight: 'bold', fontSize: '13px' },
  saveSection: { display: 'flex', justifyContent: 'flex-end',
    alignItems: 'center', gap: '16px', marginBottom: '24px' },
  savedMsg: { color: '#6bcb77', fontSize: '14px' },
  saveBtn: { background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    color: 'white', border: 'none', padding: '14px 32px',
    borderRadius: '10px', cursor: 'pointer', fontSize: '16px',
    fontWeight: 'bold', boxShadow: '0 0 20px #00f5ff44' },
};

export default Settings;