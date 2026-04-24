import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSession } from '../lib/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.');
      return;
    }

    setLoading(true);
    try {
      // Placeholder auth flow: stubs a token + user locally so the app
      // can be exercised without the backend running yet. This will be
      // swapped for Pitt SSO callback handling once wired in.
      await new Promise((r) => setTimeout(r, 300));

      const user = {
        username,
        email: `${username}@pitt.edu`,
        provider: 'dev-stub',
      };
      setSession('dev-token', user);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handlePittSso() {
    // Redirect to the backend stub; in the real flow this would bounce to Pitt SSO.
    window.location.href = '/auth/pitt/login';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Pitt Fitness</h1>
          <p className="text-sm text-slate-500 mt-1">
            Log in to track your workouts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="pitt.student"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs uppercase tracking-wide text-slate-400">
            or
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          onClick={handlePittSso}
          className="w-full border border-blue-600 text-blue-700 font-medium py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          Continue with Pitt SSO
        </button>
      </div>
    </div>
  );
}
