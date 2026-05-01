import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../lib/auth.js';
import { api } from '../lib/api.js';

function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  date.setHours(0, 0, 0, 0);
  date.setDate(diff);
  return date;
}

export default function Dashboard() {
  const user = getUser();
  const [dbStatus, setDbStatus] = useState({ checked: false });
  const [workouts, setWorkouts] = useState(null);
  const [workoutsError, setWorkoutsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/db-ping', { auth: false })
      .then((res) => {
        if (!cancelled) setDbStatus({ checked: true, ok: true, ...res });
      })
      .catch((err) => {
        if (!cancelled)
          setDbStatus({ checked: true, ok: false, error: err.message });
      });

    api
      .get('/workouts')
      .then((res) => {
        if (!cancelled) setWorkouts(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setWorkouts([]);
          setWorkoutsError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const list = workouts || [];
  const weekStart = startOfWeek();
  const thisWeek = list.filter((w) => new Date(w.date) >= weekStart);
  const totalMinutes = list.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = list.reduce(
    (sum, w) => sum + (Number(w.calories) || 0),
    0
  );

  const stats = [
    { label: 'Workouts this week', value: thisWeek.length },
    { label: 'Total minutes', value: totalMinutes },
    { label: 'Calories burned', value: totalCalories },
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

      <div
        className={`rounded-lg border px-4 py-2 text-sm ${
          !dbStatus.checked
            ? 'bg-slate-50 border-slate-200 text-slate-600'
            : dbStatus.ok
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}
      >
        {!dbStatus.checked && 'Checking backend connection…'}
        {dbStatus.checked && dbStatus.ok && (
          <>Backend + database online. Server time: {dbStatus.time}</>
        )}
        {dbStatus.checked && !dbStatus.ok && (
          <>Backend offline: {dbStatus.error}</>
        )}
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

        {workouts === null && (
          <div className="text-center py-10 text-slate-500 text-sm">
            Loading workouts…
          </div>
        )}

        {workouts !== null && list.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            {workoutsError ? (
              <>Could not load workouts: {workoutsError}</>
            ) : (
              <>
                No workouts logged yet. Click{' '}
                <Link
                  to="/workouts/new"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Log workout
                </Link>{' '}
                to get started.
              </>
            )}
          </div>
        )}

        {workouts !== null && list.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Exercise</th>
                  <th className="py-2 pr-4 font-medium">Duration</th>
                  <th className="py-2 pr-4 font-medium">Intensity</th>
                  <th className="py-2 pr-4 font-medium">Calories</th>
                </tr>
              </thead>
              <tbody>
                {list.map((w) => (
                  <tr key={w.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-700">
                      {new Date(w.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4 text-slate-700">{w.type}</td>
                    <td className="py-2 pr-4 text-slate-700">{w.exercise}</td>
                    <td className="py-2 pr-4 text-slate-700">{w.duration} min</td>
                    <td className="py-2 pr-4 text-slate-700">{w.intensity}</td>
                    <td className="py-2 pr-4 text-slate-700">
                      {w.calories ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
