/**
 * Workout summary totals card.
 *
 * @author Melina
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Card, Icon, Text } from '@/components/ui';
import type { TrainingSummary } from '@/types/training';

/** Props accepted by {@link WorkoutSummaryCard}. */
interface WorkoutSummaryCardProps {
  /** Backend totals and derived set counts for the session. */
  summary: TrainingSummary;
}

/** Displays volume and completed set totals. */
export function WorkoutSummaryCard({ summary }: WorkoutSummaryCardProps) {
  const stats = [
    {
      icon: 'open_in_full',
      value: `${summary.session.totalVolumeKg} kg`,
    },
    {
      icon: 'checklist',
      value: `${summary.completedSets} de ${summary.targetSets} series`,
    },
  ];

  return (
    <Card className="px-lg py-xl">
      <View className="flex-row items-center justify-between gap-sm">
        {stats.map(stat => (
          <View
            key={stat.icon}
            className="min-w-0 flex-row items-center gap-xs"
          >
            <Icon name={stat.icon} size={16} className="text-primary-bright" />
            <Text variant="body-m" numberOfLines={1}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
