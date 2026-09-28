import type {
  ActiveRoutine,
  RecordSetInput,
  TrainingService,
  WorkoutSession,
} from '@/types/training';

const routineFixture: ActiveRoutine = {
  routineId: 'routine-hipertrofia',
  routineName: 'Hipertrofia · 4 días',
  version: 2,
  startDate: '2026-09-01',
  todaySessionOrder: 1,
  todayWorkoutSessionId: 'session-today',
  trainerName: 'Carla Ríos',
  sessions: [
    {
      order: 1,
      label: 'Día A · Pecho y hombros',
      exercises: [
        {
          exerciseId: 'press-inclinado',
          exerciseName: 'Press inclinado con mancuernas',
          description: 'Banco inclinado a 30° · Pectoral superior',
          sets: 4,
          reps: 10,
          targetLoadKg: 32,
          restSeconds: 90,
        },
        {
          exerciseId: 'elevaciones-laterales',
          exerciseName: 'Elevaciones laterales',
          description: 'Mancuernas · Deltoides lateral',
          sets: 3,
          reps: 15,
          targetLoadKg: 12.5,
          restSeconds: 60,
        },
        {
          exerciseId: 'press-pecho-maquina',
          exerciseName: 'Press de pecho en máquina',
          description: 'Máquina guiada · Pectoral',
          sets: 3,
          reps: 12,
          targetLoadKg: 45,
          restSeconds: 75,
        },
      ],
    },
    {
      order: 2,
      label: 'Día B · Espalda y bíceps',
      exercises: [
        {
          exerciseId: 'jalon-pecho',
          exerciseName: 'Jalón al pecho',
          description: 'Polea alta · Espalda y bíceps',
          sets: 4,
          reps: 10,
          targetLoadKg: 45,
          restSeconds: 90,
        },
        {
          exerciseId: 'remo-sentado',
          exerciseName: 'Remo sentado',
          description: 'Polea baja · Espalda media',
          sets: 3,
          reps: 12,
          targetLoadKg: 40,
          restSeconds: 75,
        },
      ],
    },
    {
      order: 3,
      label: 'Día C · Piernas',
      exercises: [
        {
          exerciseId: 'sentadilla',
          exerciseName: 'Sentadilla',
          description: 'Barra libre · Cuádriceps y glúteos',
          sets: 4,
          reps: 8,
          targetLoadKg: 60,
          restSeconds: 120,
        },
        {
          exerciseId: 'peso-muerto-rumano',
          exerciseName: 'Peso muerto rumano',
          description: 'Barra libre · Isquiotibiales y glúteos',
          sets: 4,
          reps: 10,
          targetLoadKg: 50,
          restSeconds: 90,
        },
      ],
    },
    {
      order: 4,
      label: 'Día D · Brazos y abdomen',
      exercises: [
        {
          exerciseId: 'curl-biceps',
          exerciseName: 'Curl de bíceps',
          description: 'Mancuernas · Bíceps',
          sets: 3,
          reps: 12,
          targetLoadKg: 14,
          restSeconds: 60,
        },
        {
          exerciseId: 'extension-triceps',
          exerciseName: 'Extensión de tríceps',
          description: 'Polea alta · Tríceps',
          sets: 3,
          reps: 12,
          targetLoadKg: 20,
          restSeconds: 60,
        },
      ],
    },
  ],
};

const sessionFixture: WorkoutSession = {
  id: 'session-today',
  scheduledFor: '2026-09-28',
  dayLabel: 'Día A · Pecho y hombros',
  routineVersion: 2,
  status: 'IN_PROGRESS',
  totalVolumeKg: 1132.5,
  durationMinutes: 52,
  exercises: [
    {
      exerciseId: 'press-inclinado',
      exerciseName: 'Press inclinado con mancuernas',
      description: 'Banco inclinado a 30° · Pectoral superior',
      targetSets: 4,
      targetReps: 10,
      targetLoadKg: 32,
      restSeconds: 90,
      sets: [
        {
          setNumber: 1,
          loadKg: 30,
          reps: 10,
          recordedAt: '2026-09-28T14:05:00Z',
        },
        {
          setNumber: 2,
          loadKg: 32,
          reps: 10,
          recordedAt: '2026-09-28T14:08:00Z',
        },
      ],
    },
    {
      exerciseId: 'elevaciones-laterales',
      exerciseName: 'Elevaciones laterales',
      description: 'Mancuernas · Deltoides lateral',
      targetSets: 3,
      targetReps: 15,
      targetLoadKg: 12.5,
      restSeconds: 60,
      sets: [
        {
          setNumber: 1,
          loadKg: 12.5,
          reps: 15,
          recordedAt: '2026-09-28T14:16:00Z',
        },
        {
          setNumber: 2,
          loadKg: 12.5,
          reps: 14,
          recordedAt: '2026-09-28T14:19:00Z',
        },
        {
          setNumber: 3,
          loadKg: 12.5,
          reps: 12,
          recordedAt: '2026-09-28T14:22:00Z',
        },
      ],
    },
    {
      exerciseId: 'press-pecho-maquina',
      exerciseName: 'Press de pecho en máquina',
      description: 'Máquina guiada · Pectoral',
      targetSets: 3,
      targetReps: 12,
      targetLoadKg: 45,
      restSeconds: 75,
      sets: [],
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

let routine = clone(routineFixture);
let session = clone(sessionFixture);

function assertValidSet(input: RecordSetInput) {
  if (!Number.isFinite(input.loadKg) || input.loadKg < 0) {
    throw new Error('El peso debe ser un número mayor o igual a cero.');
  }
  if (!Number.isInteger(input.reps) || input.reps <= 0) {
    throw new Error(
      'Las repeticiones deben ser un número entero mayor a cero.',
    );
  }
}

function calculateVolume(current: WorkoutSession) {
  return current.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (exerciseTotal, set) => exerciseTotal + set.loadKg * set.reps,
        0,
      ),
    0,
  );
}

export function resetMockTrainingData() {
  routine = clone(routineFixture);
  session = clone(sessionFixture);
}

export const mockTrainingService: TrainingService = {
  async getActiveRoutine() {
    return clone(routine);
  },

  async getWorkoutSession(sessionId) {
    if (session.id !== sessionId) {
      throw new Error('No encontramos la sesión solicitada.');
    }
    return clone(session);
  },

  async recordSet(sessionId, input) {
    assertValidSet(input);
    if (session.id !== sessionId || session.status === 'COMPLETED') {
      throw new Error('La sesión no está disponible para registrar series.');
    }

    const exercise = session.exercises.find(
      item => item.exerciseId === input.exerciseId,
    );
    if (
      !exercise ||
      input.setNumber < 1 ||
      input.setNumber > exercise.targetSets
    ) {
      throw new Error('La serie indicada no pertenece a esta sesión.');
    }

    const nextSet = {
      setNumber: input.setNumber,
      loadKg: input.loadKg,
      reps: input.reps,
      recordedAt: new Date().toISOString(),
    };
    const existingIndex = exercise.sets.findIndex(
      item => item.setNumber === input.setNumber,
    );
    if (existingIndex >= 0) {
      exercise.sets[existingIndex] = nextSet;
    } else {
      exercise.sets.push(nextSet);
      exercise.sets.sort((left, right) => left.setNumber - right.setNumber);
    }
    session.status = 'IN_PROGRESS';
    session.totalVolumeKg = calculateVolume(session);
    return clone(session);
  },

  async finishSession(sessionId, confirmPartial) {
    if (session.id !== sessionId) {
      throw new Error('No encontramos la sesión solicitada.');
    }
    const completedSets = session.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0,
    );
    const targetSets = session.exercises.reduce(
      (total, exercise) => total + exercise.targetSets,
      0,
    );
    if (completedSets < targetSets && !confirmPartial) {
      throw new Error('Confirma si deseas finalizar la sesión incompleta.');
    }
    session.status = 'COMPLETED';
    session.finishedAt = new Date().toISOString();
    session.totalVolumeKg = calculateVolume(session);
    return clone(session);
  },
};
