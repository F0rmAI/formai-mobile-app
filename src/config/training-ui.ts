import type { ImageSourcePropType } from 'react-native';

/**
 * Recursos temporales de presentación usados mientras autenticación y catálogo
 * no entregan avatar, descripción o imagen. Los componentes aceptan datos
 * remotos y solo recurren a estos valores como respaldo.
 */
export const trainingUiFallbacks: {
  user: { name: string; avatarSource: ImageSourcePropType };
  exercise: { description: string; imageSource: ImageSourcePropType };
} = {
  user: {
    name: 'Diego',
    avatarSource: require('@/assets/avatar-diego.jpeg'),
  },
  exercise: {
    description: 'Ejercicio programado · Técnica controlada',
    imageSource: require('@/assets/exercise-press-incline.jpeg'),
  },
};

export function exerciseImageSource(imageUrl?: string): ImageSourcePropType {
  return imageUrl
    ? { uri: imageUrl }
    : trainingUiFallbacks.exercise.imageSource;
}
