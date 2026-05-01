import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

const WORKOUT_TYPES = [
  'Strength',
  'Cardio',
  'HIIT',
  'Yoga',
  'Stretching',
  'Sports',
  'Other',
];

const INTENSITIES = ['Low', 'Moderate', 'High'];

export default function WorkoutLog() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: today,
    type: 'Strength',
    exercise: '',
    duration: '',
    intensity: 'Moderate',
    calories: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.date) next.date = 'Date is required.';
    if (!form.exercise.trim())
      next.exercise = 'Please enter what you did.';
    const duration = Number(form.duration);
    if (!form.duration || Number.isNaN(duration) || duration <= 0) {
      next.duration = 'Enter a duration greater than 0.';
    }
    if (form.calories) {
      const cals = Number(form.calories);
      if (Number.isNaN(cals) || cals < 0) {
        next.calories = 'Calories must be a positive number.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(false);
    setSubmitError('');
    if (!validate()) return;

    const payload = {
      ...form,
      duration: Number(form.duration),
      calories: form.calories ? Number(form.calories) : null,
    };

    setSaving(true);
    try {
      await api.post('/workouts', payload);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setSubmitError(
        err.message || 'Failed to save workout. Is the backend running?'
      );
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const normalBorder = 'border-slate-300';
  const errorBorder = 'border-red-400';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Log a workout</h2>
        <p className="text-slate-600 mt-1">
          Record the details of your session.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className={`${inputBase} ${
                errors.date ? errorBorder : normalBorder
              }`}
            />
            {errors.date && (
              <p className="text-xs text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className={`${inputBase} ${normalBorder}`}
            >
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Exercise
          </label>
          <input
            type="text"
            value={form.exercise}
            onChange={(e) => update('exercise', e.target.value)}
            placeholder="e.g. Bench press, 5x5 @ 135 lb"
            className={`${inputBase} ${
              errors.exercise ? errorBorder : normalBorder
            }`}
          />
          {errors.exercise && (
            <p className="text-xs text-red-600 mt-1">{errors.exercise}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              value={form.duration}
              onChange={(e) => update('duration', e.target.value)}
              className={`${inputBase} ${
                errors.duration ? errorBorder : normalBorder
              }`}
            />
            {errors.duration && (
              <p className="text-xs text-red-600 mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Intensity
            </label>
            <select
              value={form.intensity}
              onChange={(e) => update('intensity', e.target.value)}
              className={`${inputBase} ${normalBorder}`}
            >
              {INTENSITIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Calories
            </label>
            <input
              type="number"
              min="0"
              value={form.calories}
              onChange={(e) => update('calories', e.target.value)}
              placeholder="optional"
              className={`${inputBase} ${
                errors.calories ? errorBorder : normalBorder
              }`}
            />
            {errors.calories && (
              <p className="text-xs text-red-600 mt-1">{errors.calories}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="How did it feel? Any PRs?"
            className={`${inputBase} ${normalBorder} resize-none`}
          />
        </div>

        {submitted && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            Workout saved. Redirecting…
          </div>
        )}
        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? 'Saving…' : 'Save workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
