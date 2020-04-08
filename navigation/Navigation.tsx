import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlatsScreen from '../screens/FlatsScreen';

const FlatsStack = createStackNavigator();
const FlatsStackNavigator = () => (
    <FlatsStack.Navigator>
        <FlatsStack.Screen name="Flats" component={FlatsScreen} />
    </FlatsStack.Navigator>
);

const AppNavitaionContainer = () => <NavigationContainer>
    <FlatsStackNavigator />
</NavigationContainer>;

export default AppNavitaionContainer;