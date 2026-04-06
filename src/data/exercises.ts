import exercisesData from './exercises.json';
import type { Exercise } from '../types';

export const exercises: Exercise[] = exercisesData as Exercise[];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

export function getExercisesByMuscle(muscle: string): Exercise[] {
  return exercises.filter(e => e.primaryMuscle === muscle);
}
