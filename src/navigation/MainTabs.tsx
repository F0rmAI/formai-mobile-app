import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { BottomNav, type BottomNavItem } from '@/components/layout';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { TodayScreen } from '@/screens/TodayScreen';
import type { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabItems: BottomNavItem<keyof MainTabParamList>[] = [
  { key: 'Today', label: 'Hoy', icon: 'fitness_center' },
  { key: 'Progress', label: 'Progreso', icon: 'monitoring' },
  { key: 'Profile', label: 'Perfil', icon: 'person' },
];

/** Conecta el estado del navegador con el `BottomNav` del design system. */
function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  const handleChange = (key: keyof MainTabParamList) => {
    const route = state.routes.find(item => item.name === key);
    if (!route) {
      return;
    }
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (route.key !== activeRoute.key && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // Absoluta: el contenido de la pantalla pasa por detrás de las esquinas redondeadas.
  return (
    <BottomNav
      items={tabItems}
      activeKey={activeRoute.name as keyof MainTabParamList}
      onChange={handleChange}
      className="absolute inset-x-0 bottom-0"
    />
  );
}

const renderTabBar = (props: BottomTabBarProps) => <MainTabBar {...props} />;

/** Navegación principal del cliente: Hoy, Progreso y Perfil. */
export function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
