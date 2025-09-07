import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import BetaScreen from './screens/BetaScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Beta: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Beta" component={BetaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
