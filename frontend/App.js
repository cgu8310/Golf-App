import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { RoundsProvider } from './src/context/RoundsContext';
import { CoursesProvider } from './src/context/CoursesContext';
import { ProfileProvider } from './src/context/ProfileContext';

import HomeScreen from './src/pages/HomeScreen';
import AddRoundScreen from './src/pages/AddRoundScreen';
import HistoryScreen from './src/pages/HistoryScreen';
import StatsScreen from './src/pages/StatsScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import RoundDetailScreen from './src/pages/RoundDetailScreen';
import CoursesScreen from './src/pages/CoursesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GREEN = '#1a6b2e';

const TAB_ICONS = { Home: '🏌️', Stats: '📊', History: '📋', Profile: '👤' };

function TabIcon({ label, focused }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{TAB_ICONS[label]}</Text>;
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: '#888',
        headerStyle: { backgroundColor: GREEN },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Golf Handicap' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistics' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Round History' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

const HEADER = { headerStyle: { backgroundColor: GREEN }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' } };

export default function App() {
  return (
    <ProfileProvider>
      <CoursesProvider>
        <RoundsProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
              <Stack.Screen name="AddRound" component={AddRoundScreen} options={{ title: 'Add Round', ...HEADER }} />
              <Stack.Screen name="RoundDetail" component={RoundDetailScreen} options={{ title: 'Round Details', ...HEADER }} />
              <Stack.Screen name="Courses" component={CoursesScreen} options={{ title: 'Saved Courses', ...HEADER }} />
            </Stack.Navigator>
            <StatusBar style="light" />
          </NavigationContainer>
        </RoundsProvider>
      </CoursesProvider>
    </ProfileProvider>
  );
}
