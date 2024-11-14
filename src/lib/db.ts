import Dexie, { type Table } from 'dexie';

export interface User {
  id?: string;
  username: string;
  password: string;
}

export interface Workout {
  id?: number;
  userId: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export class FitnessDB extends Dexie {
  users!: Table<User>;
  workouts!: Table<Workout>;

  constructor() {
    super('fitnessDB');
    this.version(1).stores({
      users: 'id, username',
      workouts: '++id, userId, exercise, date'
    });
  }
}

export const db = new FitnessDB();