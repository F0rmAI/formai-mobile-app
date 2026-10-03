/**
 * Dual-series line chart for exercise load and volume.
 *
 * @author Christian
 * @packageDocumentation
 */

import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { Text } from '@/components/ui';
import type { ProgressPoint } from '@/types/training';
import { cn } from '@/utils/cn';

const CHART_HEIGHT = 160;
const PAD = 12;

// The plot height and measured point coordinates require pixel styles; classes cover visual tokens.
const chartStyles = StyleSheet.create({ canvas: { height: CHART_HEIGHT } });

/**
 * Props accepted by {@link ProgressLineChart}.
 */
export interface ProgressLineChartProps {
  /** Oldest-to-newest points from the backend. */
  points: ProgressPoint[];
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

type PlotPoint = { x: number; yLoad: number; yVolume: number };

function project(points: ProgressPoint[], width: number): PlotPoint[] {
  if (points.length === 0 || width <= 0) {
    return [];
  }
  const loads = points.map(point => Number(point.maxLoadKg));
  const volumes = points.map(point => Number(point.volumeKg));
  const maxLoad = Math.max(...loads, 1);
  const maxVolume = Math.max(...volumes, 1);
  const span = Math.max(points.length - 1, 1);
  const innerWidth = width - PAD * 2;
  const innerHeight = CHART_HEIGHT - PAD * 2;
  return points.map((point, index) => ({
    x: PAD + (index / span) * innerWidth,
    yLoad: PAD + (1 - Number(point.maxLoadKg) / maxLoad) * innerHeight,
    yVolume: PAD + (1 - Number(point.volumeKg) / maxVolume) * innerHeight,
  }));
}

function Segment({
  from,
  to,
  tone,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  tone: 'primary' | 'secondary';
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const position: ViewStyle = {
    left: from.x,
    top: from.y,
    width: length,
    transform: [{ rotate: `${angle}deg` }],
  };
  return (
    <View
      className={cn(
        'absolute h-0.5 origin-left',
        tone === 'primary' ? 'bg-primary' : 'bg-secondary',
      )}
      style={position}
    />
  );
}

/**
 * Renders load and volume series without a third-party chart library.
 *
 * @example
 * ```tsx
 * <ProgressLineChart points={chart.points} />
 * ```
 */
export function ProgressLineChart({
  points,
  className,
}: ProgressLineChartProps) {
  const [width, setWidth] = useState(0);
  const plot = project(points, width);
  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View className={cn('gap-md', className)}>
      <View className="flex-row gap-xl">
        <View className="flex-row items-center gap-sm">
          <View className="size-2 rounded-full bg-primary" />
          <Text variant="body-m" tone="secondary">
            Carga máx. (kg)
          </Text>
        </View>
        <View className="flex-row items-center gap-sm">
          <View className="size-2 rounded-full bg-secondary" />
          <Text variant="body-m" tone="secondary">
            Volumen (kg)
          </Text>
        </View>
      </View>
      <View
        accessibilityLabel="Evolución de carga y volumen"
        className="w-full overflow-hidden rounded-md bg-surface-container-low"
        style={chartStyles.canvas}
        onLayout={onLayout}
      >
        {plot.map((point, index) => {
          const next = plot[index + 1];
          const loadPosition: ViewStyle = {
            left: point.x - 4,
            top: point.yLoad - 4,
          };
          const volumePosition: ViewStyle = {
            left: point.x - 4,
            top: point.yVolume - 4,
          };
          return (
            <View key={`${points[index].date}-${index}`}>
              {next && (
                <>
                  <Segment
                    from={{ x: point.x, y: point.yLoad }}
                    to={{ x: next.x, y: next.yLoad }}
                    tone="primary"
                  />
                  <Segment
                    from={{ x: point.x, y: point.yVolume }}
                    to={{ x: next.x, y: next.yVolume }}
                    tone="secondary"
                  />
                </>
              )}
              <View
                className="absolute size-2 rounded-full bg-primary"
                style={loadPosition}
              />
              <View
                className="absolute size-2 rounded-full bg-secondary"
                style={volumePosition}
              />
            </View>
          );
        })}
      </View>
      {points.length > 0 && (
        <View className="flex-row justify-between">
          <Text variant="body-m" tone="muted">
            {points[0].date.slice(5).replace('-', '/')}
          </Text>
          <Text variant="body-m" tone="muted">
            {points[points.length - 1].date.slice(5).replace('-', '/')}
          </Text>
        </View>
      )}
    </View>
  );
}
