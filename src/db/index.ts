import Dexie, { Table } from 'dexie';
import type { WorkoutPlan, WorkoutSession } from '../types';

export class GymGuideDB extends Dexie {
  plans!: Table<WorkoutPlan>;
  sessions!: Table<WorkoutSession>;

  constructor() {
    super('GymGuideDB');
    this.version(1).stores({
      plans: 'id, createdAt',
      sessions: 'id, dayId, date, completed',
    });
  }
}

export const db = new GymGuideDB();

export async function getActivePlan(): Promise<WorkoutPlan | undefined> {
  const plans = await db.plans.toArray();
  return plans[0];
}

export async function savePlan(plan: WorkoutPlan): Promise<void> {
  await db.plans.put(plan);
}

export async function getSessionsForDay(dayId: string): Promise<WorkoutSession[]> {
  return db.sessions.where('dayId').equals(dayId).sortBy('date');
}

export async function saveSession(session: WorkoutSession): Promise<void> {
  await db.sessions.put(session);
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  return db.sessions.orderBy('date').reverse().toArray();
}
