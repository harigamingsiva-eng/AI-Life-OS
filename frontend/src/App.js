import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    if (token && userId) return { token, userId, name };
    return null;
  });

  return (
    <div>
      {user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;