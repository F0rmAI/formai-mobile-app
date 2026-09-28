import {
  mockTrainingService,
  resetMockTrainingData,
} from '@/services/mock-training.service';

beforeEach(() => {
  resetMockTrainingData();
});

test('registra una serie una sola vez y recalcula el volumen', async () => {
  const routine = await mockTrainingService.getActiveRoutine();
  expect(routine).not.toBeNull();

  const sessionId = routine!.todayWorkoutSessionId;
  const before = await mockTrainingService.getWorkoutSession(sessionId);
  const updated = await mockTrainingService.recordSet(sessionId, {
    exerciseId: 'press-inclinado',
    setNumber: 3,
    loadKg: 32,
    reps: 10,
  });

  expect(updated.exercises[0].sets).toHaveLength(3);
  expect(updated.totalVolumeKg).toBeGreaterThan(before.totalVolumeKg);

  const replaced = await mockTrainingService.recordSet(sessionId, {
    exerciseId: 'press-inclinado',
    setNumber: 3,
    loadKg: 34,
    reps: 9,
  });
  expect(replaced.exercises[0].sets).toHaveLength(3);
  expect(replaced.exercises[0].sets[2]).toMatchObject({ loadKg: 34, reps: 9 });
});

test('valida valores y exige confirmación para finalizar una sesión parcial', async () => {
  const routine = await mockTrainingService.getActiveRoutine();
  const sessionId = routine!.todayWorkoutSessionId;

  await expect(
    mockTrainingService.recordSet(sessionId, {
      exerciseId: 'press-inclinado',
      setNumber: 3,
      loadKg: -1,
      reps: 10,
    }),
  ).rejects.toThrow('peso');

  await expect(
    mockTrainingService.finishSession(sessionId, false),
  ).rejects.toThrow('Confirma');

  const finished = await mockTrainingService.finishSession(sessionId, true);
  expect(finished.status).toBe('COMPLETED');
  expect(finished.finishedAt).toBeDefined();
});

test('finaliza sin confirmación adicional cuando todas las series están registradas', async () => {
  const routine = await mockTrainingService.getActiveRoutine();
  const sessionId = routine!.todayWorkoutSessionId;
  const initial = await mockTrainingService.getWorkoutSession(sessionId);

  for (const exercise of initial.exercises) {
    for (let setNumber = 1; setNumber <= exercise.targetSets; setNumber += 1) {
      if (exercise.sets.some(set => set.setNumber === setNumber)) {
        continue;
      }
      await mockTrainingService.recordSet(sessionId, {
        exerciseId: exercise.exerciseId,
        setNumber,
        loadKg: exercise.targetLoadKg,
        reps: exercise.targetReps,
      });
    }
  }

  const finished = await mockTrainingService.finishSession(sessionId, false);
  expect(finished.status).toBe('COMPLETED');
  expect(
    finished.exercises.every(
      exercise => exercise.sets.length === exercise.targetSets,
    ),
  ).toBe(true);
});
