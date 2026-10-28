import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductFormScreen } from '../screens/ProductFormScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Lista de Compras',
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{
          title: 'Produto',
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.white,
        }}
      />
    </Stack.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.white,
        }}
      >
        <Tab.Screen
          name="Início"
          component={HomeStack}
          options={{ tabBarLabel: 'Início' }}
        />
        <Tab.Screen
          name="Lista"
          component={ProductListScreen}
          options={{ tabBarLabel: 'Minha Lista' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};