import { View } from 'react-native';
import { Avatar, BrandLogo, Text } from '@/components/ui';
import { cn } from '@/utils/cn';

export interface AppHeaderProps {
  /** Texto bajo la marca (p. ej. "Entrenamiento de hoy"). */
  subtitle?: string;
  user?: { name: string; avatarUrl?: string };
  className?: string;
}

/** Header principal con marca y avatar (64 px). */
export function AppHeader({ subtitle, user, className }: AppHeaderProps) {
  return (
    <View
      className={cn(
        'h-16 w-full flex-row items-center justify-between bg-surface-background px-xl',
        className,
      )}
    >
      <View className="flex-row items-center gap-md">
        <BrandLogo />
        <View>
          <Text variant="label-l">FormAI</Text>
          {subtitle && (
            <Text variant="caption" tone="secondary">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {user && <Avatar name={user.name} src={user.avatarUrl} />}
    </View>
  );
}
