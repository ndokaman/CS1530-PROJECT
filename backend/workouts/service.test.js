jest.mock('../db/pool', () => ({
  query: jest.fn(),
}));

const pool = require('../db/pool');
const WorkoutService = require('./service');

describe('WorkoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('inserts a workout and returns the saved row', async () => {
      const fakeRow = {
        id: 1,
        user_id: 'pitt-user-12345',
        date: '2026-04-24',
        type: 'Strength',
        exercise: 'Bench press, 5x5 @ 135 lb',
        duration: 45,
        intensity: 'Moderate',
        calories: 300,
        notes: 'felt great',
      };
      pool.query.mockResolvedValueOnce({ rows: [fakeRow] });

      const result = await WorkoutService.create('pitt-user-12345', {
        date: '2026-04-24',
        type: 'Strength',
        exercise: 'Bench press, 5x5 @ 135 lb',
        duration: 45,
        intensity: 'Moderate',
        calories: 300,
        notes: 'felt great',
      });

      expect(result).toEqual(fakeRow);
      expect(pool.query).toHaveBeenCalledTimes(1);

      const [sql, params] = pool.query.mock.calls[0];
      expect(sql).toMatch(/INSERT INTO workouts/i);
      expect(params).toEqual([
        'pitt-user-12345',
        '2026-04-24',
        'Strength',
        'Bench press, 5x5 @ 135 lb',
        45,
        'Moderate',
        300,
        'felt great',
      ]);
    });

    it('passes null for calories and notes when not provided', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });

      await WorkoutService.create('user-1', {
        date: '2026-04-24',
        type: 'Cardio',
        exercise: 'Run',
        duration: 30,
        intensity: 'High',
      });

      const [, params] = pool.query.mock.calls[0];
      expect(params[6]).toBeNull(); // calories
      expect(params[7]).toBeNull(); // notes
    });

    it('propagates database errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('connection refused'));

      await expect(
        WorkoutService.create('user-1', {
          date: '2026-04-24',
          type: 'Strength',
          exercise: 'X',
          duration: 1,
          intensity: 'Low',
        })
      ).rejects.toThrow('connection refused');
    });
  });
});