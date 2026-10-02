import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, BottomNav, type AppHeaderProps } from '@/components/layout';
import { trainingUiFallbacks } from '@/config/training-ui';

const navItems = [
  { key: 'today', label: 'Hoy', icon: 'fitness_center' },
  { key: 'progress', label: 'Progreso', icon: 'monitoring' },
  { key: 'profile', label: 'Perfil', icon: 'person' },
] as const;

export interface TrainingShellProps {
  children: ReactNode;
  subtitle?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  user?: AppHeaderProps['user'];
  onTodayPress: () => void;
}

export function TrainingShell({
  children,
  subtitle,
  showHeader = true,
  showBottomNav = true,
  user = trainingUiFallbacks.user,
  onTodayPress,
}: TrainingShellProps) {
  return (
    <View className="flex-1 bg-surface-background">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {showHeader && <AppHeader subtitle={subtitle} user={user} />}
        <View className="flex-1">{children}</View>
        {showBottomNav && (
          <BottomNav
            items={[...navItems]}
            activeKey="today"
            onChange={key => key === 'today' && onTodayPress()}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});
