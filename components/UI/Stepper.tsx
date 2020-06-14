import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { paperTheme } from '../../config/theme';

export type NewTaskStep = {
	title?: string;
};

export const newTaskSteps: NewTaskStep[] = [
	{ title: 'Task name' },
	{ title: 'Task time' },
	{ title: 'Task members' },
];

interface Props {
	currentStep: number;
	steps: NewTaskStep[] | number;
	showTitle?: boolean;
}

const width = Dimensions.get('screen').width;

const Stepper: React.FC<Props> = ({ steps, currentStep, showTitle }) => {
	const stepsLen = typeof steps === 'number' ? steps : steps.length;
	const dividerWidth = (width - (24 + 2 * 8) * stepsLen - 2 * 16) / (stepsLen - 1);
	let stepsElements: JSX.Element[] = [];

	for (let i = 0; i < steps; i++) {
		const stepStyleName =
			i + 1 === currentStep
				? 'currentStep'
				: i + 1 < currentStep
				? 'prevSteps'
				: 'nextSteps';
		stepsElements.push(
			<React.Fragment key={i}>
				<View style={[styles.step, styles[stepStyleName]]}>
					<Text style={[styles.stepNumber, styles[stepStyleName + 'Number']]}>
						{i + 1}
					</Text>
				</View>
				{i < stepsLen - 1 && (
					<Divider
						style={{
							backgroundColor: i + 1 < currentStep ? 'green' : '#666',
							width: dividerWidth,
						}}
					/>
				)}
			</React.Fragment>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.stepper}>{stepsElements}</View>
			{typeof steps === 'object' && (
				<View>
					<Text style={styles.title}>{steps[currentStep - 1].title}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
	},
	stepper: {
		flexDirection: 'row',
		width,
		paddingHorizontal: 16,
		paddingVertical: 8,
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	step: {
		height: 32,
		width: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	prevSteps: {
		backgroundColor: paperTheme.colors.primary,
	},
	currentStep: {
		backgroundColor: paperTheme.colors.accent,
	},
	nextSteps: {
		backgroundColor: '#888',
	},
	stepNumber: {
		fontSize: 16,
	},
	prevStepsNumber: {
		color: 'white',
	},
	currentStepNumber: {
		color: 'white',
	},
	nextStepsNumber: {
		color: 'white',
	},
	title: {
		textAlign: 'center',
	},
});

export default Stepper;
