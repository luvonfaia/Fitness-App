import { db, type Workout } from './db';

export const workoutService = {
  async getWorkouts(userId: string) {
    return await db.workouts
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('date');
  },

  async addWorkout(workout: Workout) {
    const id = await db.workouts.add(workout);
    return { ...workout, id };
  },

  async updateWorkout(workout: Workout) {
    await db.workouts.update(workout.id!, workout);
    return workout;
  },

  async deleteWorkout(id: number, userId: string) {
    await db.workouts.where({ id, userId }).delete();
  },

  async getWorkoutHistory(userId: string, exercise: string) {
    return await db.workouts
      .where({ userId, exercise })
      .reverse()
      .sortBy('date');
  }
};