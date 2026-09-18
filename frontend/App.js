import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { RoundsProvider } from './src/context/RoundsContext';
import HomeScreen from './src/pages/HomeScreen';
import AddRoundScreen from './src/pages/AddRoundScreen';
import HistoryScreen from './src/pages/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GREEN = '#1a6b2e';

function TabIcon({ label, focused }) {
  const icons = { Home: '🏌️', History: '📋' };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[label]}</Text>;
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
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Round History' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <RoundsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddRound"
            component={AddRoundScreen}
            options={{
              title: 'Add Round',
              headerStyle: { backgroundColor: GREEN },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </RoundsProvider>
  );
}
