import { db } from './db';
import { nanoid } from 'nanoid';

export const auth = {
  async login(username: string, password: string) {
    const user = await db.users.where('username').equals(username).first();
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    return { id: user.id!, username: user.username };
  },

  async register(username: string, password: string) {
    const exists = await db.users.where('username').equals(username).first();
    if (exists) {
      throw new Error('Username already taken');
    }
    const id = nanoid();
    await db.users.add({ id, username, password });
    return { id, username };
  }
};