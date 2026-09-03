import React, { useState, useEffect } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  const colors = {
    success: { bg: '#6bcb7722', border: '#6bcb77', icon: '✅' },
    error: { bg: '#ff6b6b22', border: '#ff6b6b', icon: '❌' },
    info: { bg: '#00f5ff22', border: '#00f5ff', icon: '💡' },
    warning: { bg: '#ffd93d22', border: '#ffd93d', icon: '⚠️' },
  };

  return (
    <div style={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          ...styles.toast,
          background: colors[toast.type]?.bg || colors.info.bg,
          borderLeft: `4px solid ${colors[toast.type]?.border || '#00f5ff'}`,
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={styles.icon}>{colors[toast.type]?.icon}</span>
          <span style={styles.message}>{toast.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { position: 'fixed', top: '20px', right: '20px',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' },
  toast: { display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 20px', borderRadius: '10px', minWidth: '280px',
    maxWidth: '350px', background: '#12121a',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
  icon: { fontSize: '18px' },
  message: { color: '#fff', fontSize: '14px', flex: 1 },
};