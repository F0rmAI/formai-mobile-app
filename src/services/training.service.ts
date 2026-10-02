import { mockTrainingService } from './mock-training.service';
import { trainingApiService } from './training-api.service';

/**
 * Se mantiene en mock mientras se integra autenticación mobile con el backend.
 * Cambiar a `false` conecta el mismo hook y las mismas pantallas a la API real.
 */
export const USE_MOCK_TRAINING = true;

export const trainingService = USE_MOCK_TRAINING
  ? mockTrainingService
  : trainingApiService;
