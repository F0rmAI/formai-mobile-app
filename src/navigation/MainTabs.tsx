/**
 * MainTabs module.
 *
 * @author Carlos
 * @packageDocumentation
 */

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

/** Connects tab navigation state to the design-system bottom bar. */
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

  // The absolute bar overlays content at the rounded corners.
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

/** Client tabs: Today, Progress and Profile. */
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
