import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950 text-neutral-300">
      <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-neutral-100">Admin Login</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-neutral-800 p-2 text-white outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-neutral-800 p-2 text-white outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
