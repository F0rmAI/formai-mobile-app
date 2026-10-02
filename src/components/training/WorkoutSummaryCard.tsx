import { View } from 'react-native';
import { Card, Icon, Text } from '@/components/ui';
import type { TrainingSummary } from '@/types/training';

export function WorkoutSummaryCard({ summary }: { summary: TrainingSummary }) {
  const stats = [
    {
      icon: 'open_in_full',
      value: `${Math.round(summary.session.totalVolumeKg)} kg`,
    },
    {
      icon: 'timer',
      value: summary.session.durationMinutes
        ? `${summary.session.durationMinutes} min`
        : '—',
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
