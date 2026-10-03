/**
 * Progress chart API resource for the signed-in client.
 *
 * @author Christian
 * @packageDocumentation
 */

import { apiClient } from './api-client';
import type { ProgressChart, ProgressWeeks } from '@/types/training';

/** Calls the client progress-chart endpoint. */
export const progressChartService = {
  /**
   * Loads heaviest load and volume per date for one exercise.
   *
   * @param exerciseId - Exercise to chart.
   * @param weeks - Window of 4, 8 or 12 weeks.
   * @returns The series and whether there is enough data to plot.
   * @throws {@link ApiError} when the chart cannot be loaded.
   */
  getMine: (exerciseId: string, weeks: ProgressWeeks) =>
    apiClient.get<ProgressChart>(
      `/v1/progress-charts/me?exerciseId=${encodeURIComponent(
        exerciseId,
      )}&weeks=${weeks}`,
    ),
};
