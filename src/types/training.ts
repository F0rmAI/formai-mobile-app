/**
 * Backend training resources.
 *
 * @author Melina
 * @packageDocumentation
 */

/** Session outcome assigned by the backend. */
export type WorkoutStatus = 'PENDING' | 'COMPLETED' | 'PARTIAL' | 'SKIPPED';
/** Weekly training day. */
export type TrainingDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
/** Prescribed exercise in an active routine. */
export interface ExercisePrescription {
  /** Exercise identifier. */ exerciseId: string;
  /** Exercise name. */ exerciseName: string;
  /** Prescribed set count. */ sets: number;
  /** Prescribed repetitions. */ reps: number;
  /** Prescribed load in kilograms. */ targetLoadKg: number;
  /** Rest between sets in seconds. */ restSeconds: number;
}
/** Ordered routine session. */
export interface RoutineDay {
  /** One-based order. */ order: number;
  /** Day label. */ label: string;
  /** Prescribed exercises. */ exercises: ExercisePrescription[];
}
/** Currently assigned routine. */
export interface ActiveRoutine {
  /** Routine identifier. */ routineId: string;
  /** Display name. */ routineName: string;
  /** Routine version. */ version: number;
  /** Assignment date. */ startDate: string;
  /** Weekly schedule. */ trainingDays: TrainingDay[];
  /** Today's routine order, null on a rest day. */ todaySessionOrder:
    | number
    | null;
  /** Today's workout identifier, null on a rest day. */ todayWorkoutSessionId:
    | string
    | null;
  /** Ordered sessions. */ sessions: RoutineDay[];
}
/** Recorded set. */
export interface WorkoutSet {
  /** One-based set number. */ setNumber: number;
  /** Actual load. */ loadKg: number;
  /** Actual repetitions. */ reps: number;
  /** Recording instant. */ recordedAt: string;
}
/** Exercise included in a workout. */
export interface WorkoutExercise {
  /** Exercise identifier. */ exerciseId: string;
  /** Exercise name. */ exerciseName: string;
  /** Prescribed set count. */ targetSets: number;
  /** Prescribed repetitions. */ targetReps: number;
  /** Prescribed load. */ targetLoadKg: number;
  /** Recorded sets. */ sets: WorkoutSet[];
}
/** Workout session resource. */
export interface WorkoutSession {
  /** Session identifier. */ id: string;
  /** Scheduled local date. */ scheduledFor: string;
  /** Routine day label. */ dayLabel: string;
  /** Routine version. */ routineVersion: number;
  /** Session outcome. */ status: WorkoutStatus;
  /** Total lifted volume in kilograms. */ totalVolumeKg: number;
  /** Completion instant, null while pending. */ finishedAt: string | null;
  /** Session exercises. */ exercises: WorkoutExercise[];
}
/** Body used to record or correct a set. */
export interface RecordSetInput {
  /** Exercise identifier. */ exerciseId: string;
  /** One-based set number. */ setNumber: number;
  /** Actual load. */ loadKg: number;
  /** Actual repetitions. */ reps: number;
}
/** Paginated workout response. */
export interface WorkoutPage {
  /** Sessions in descending order. */ content: WorkoutSession[];
  /** Zero-based page. */ page: number;
  /** Requested page size. */ size: number;
  /** Count across all pages. */ totalElements: number;
  /** Number of pages. */ totalPages: number;
}
/** UI summary calculated from a workout. */
export interface TrainingSummary {
  /** Backend workout. */ session: WorkoutSession;
  /** Count of recorded sets. */ completedSets: number;
  /** Count of prescribed sets. */ targetSets: number;
  /** Whether some prescribed sets are missing. */ isPartial: boolean;
}
