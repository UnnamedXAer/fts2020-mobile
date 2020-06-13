import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewTaskTimeScreen from '../screens/NewTask/NewTaskTimeScreen';
import NewTaskMembersScreen from '../screens/NewTask/NewTaskMembersScreen';
import NewTaskNameScreen from '../screens/NewTask/NewTaskNameScreen';

const NewTaskStack = createStackNavigator();

const NewTaskStackNavigator = () => {
	return (
		<NewTaskStack.Navigator
			headerMode="none"
		>
			<NewTaskStack.Screen
				name="NewTaskName"
				options={{ title: 'New Task' }}
				component={NewTaskNameScreen}
			/>
			<NewTaskStack.Screen
				name="NewTaskTime"
				options={{ title: 'New Task' }}
				component={NewTaskTimeScreen}
			/>
			<NewTaskStack.Screen
				name="NewTaskMembers"
				options={{ title: 'New Task' }}
				component={NewTaskMembersScreen}
			/>
		</NewTaskStack.Navigator>
	);
};

export default NewTaskStackNavigator;
