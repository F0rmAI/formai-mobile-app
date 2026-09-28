export type WorkoutStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ExercisePrescription {
  exerciseId: string;
  exerciseName: string;
  description?: string;
  imageUrl?: string;
  sets: number;
  reps: number;
  targetLoadKg: number;
  restSeconds?: number;
}

export interface RoutineDay {
  order: number;
  label: string;
  exercises: ExercisePrescription[];
}

export interface ActiveRoutine {
  routineId: string;
  routineName: string;
  version: number;
  startDate: string;
  todaySessionOrder: number;
  todayWorkoutSessionId: string;
  trainerName?: string;
  sessions: RoutineDay[];
}

export interface WorkoutSet {
  setNumber: number;
  loadKg: number;
  reps: number;
  recordedAt: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  description?: string;
  imageUrl?: string;
  targetSets: number;
  targetReps: number;
  targetLoadKg: number;
  restSeconds?: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  scheduledFor: string;
  dayLabel: string;
  routineVersion: number;
  status: WorkoutStatus;
  totalVolumeKg: number;
  finishedAt?: string;
  durationMinutes?: number;
  exercises: WorkoutExercise[];
}

export interface RecordSetInput {
  exerciseId: string;
  setNumber: number;
  loadKg: number;
  reps: number;
}

export interface TrainingSummary {
  session: WorkoutSession;
  completedSets: number;
  targetSets: number;
  isPartial: boolean;
}

export interface TrainingService {
  getActiveRoutine(): Promise<ActiveRoutine | null>;
  getWorkoutSession(sessionId: string): Promise<WorkoutSession>;
  recordSet(sessionId: string, input: RecordSetInput): Promise<WorkoutSession>;
  finishSession(
    sessionId: string,
    confirmPartial: boolean,
  ): Promise<WorkoutSession>;
}
