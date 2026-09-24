import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { RoundsProvider } from './src/context/RoundsContext';
import { CoursesProvider } from './src/context/CoursesContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { GolfersProvider } from './src/context/GolfersContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

import HomeScreen from './src/pages/HomeScreen';
import AddRoundScreen from './src/pages/AddRoundScreen';
import StatsScreen from './src/pages/StatsScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import RoundDetailScreen from './src/pages/RoundDetailScreen';
import CoursesScreen from './src/pages/CoursesScreen';
import SettingsScreen from './src/pages/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BLUE = '#4f46e5';

const TAB_ICONS = {
  Home:     { active: 'golf',      inactive: 'golf-outline' },
  Stats:    { active: 'bar-chart', inactive: 'bar-chart-outline' },
  Profile:  { active: 'person',    inactive: 'person-outline' },
  Settings: { active: 'settings',  inactive: 'settings-outline' },
};

const tabStyles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 30 : 18,
    height: 66,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderRadius: 28,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  item: { justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2, marginTop: 2 },
  iconWrap: { width: 52, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: '#e0e7ff' },
});

function HomeTabs() {
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      sceneContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 112 : 100 }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const icon = TAB_ICONS[route.name];
          return (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Ionicons
                name={focused ? icon.active : icon.inactive}
                size={24}
                color={color}
              />
            </View>
          );
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: tabStyles.label,
        tabBarItemStyle: tabStyles.item,
        tabBarStyle: tabStyles.bar,
        headerStyle: { backgroundColor: BLUE },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabHome') }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: t('tabStats') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tabProfile') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('tabSettings') }} />
    </Tab.Navigator>
  );
}

const HEADER = { headerStyle: { backgroundColor: BLUE }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' } };

function RootNavigator() {
  const { t } = useLanguage();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddRound" component={AddRoundScreen} options={{ title: t('navAddRound'), ...HEADER }} />
        <Stack.Screen name="RoundDetail" component={RoundDetailScreen} options={{ title: t('navRoundDetail'), ...HEADER }} />
        <Stack.Screen name="Courses" component={CoursesScreen} options={{ title: t('navSavedCourses'), ...HEADER }} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <CoursesProvider>
          <GolfersProvider>
            <RoundsProvider>
              <RootNavigator />
            </RoundsProvider>
          </GolfersProvider>
        </CoursesProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}
