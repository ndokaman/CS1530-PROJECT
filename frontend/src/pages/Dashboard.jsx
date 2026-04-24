import { Link } from 'react-router-dom';
import { getUser } from '../lib/auth.js';

export default function Dashboard() {
  const user = getUser();

  const stats = [
    { label: 'Workouts this week', value: 0 },
    { label: 'Total minutes', value: 0 },
    { label: 'Calories burned', value: 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back{user?.username ? `, ${user.username}` : ''}.
        </h2>
        <p className="text-slate-600 mt-1">
          Here's a quick overview of your fitness activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent workouts
          </h3>
          <Link
            to="/workouts/new"
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Log workout
          </Link>
        </div>
        <div className="text-center py-10 text-slate-500 text-sm">
          No workouts logged yet. Click{' '}
          <Link
            to="/workouts/new"
            className="text-blue-600 hover:underline font-medium"
          >
            Log workout
          </Link>{' '}
          to get started.
        </div>
      </div>
    </div>
  );
}
