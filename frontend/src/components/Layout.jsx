import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../lib/auth.js';

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-blue-700">Pitt Fitness</h1>
            <nav className="flex items-center gap-2">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/workouts/new" className={navLinkClass}>
                Log Workout
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-slate-600 hidden sm:inline">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
