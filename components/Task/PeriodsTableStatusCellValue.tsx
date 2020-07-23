import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Period } from '../../models/period';
import moment, { Moment } from 'moment';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import SimpleToast from 'react-native-simple-toast';

interface Props {
	period: Period;
	periodDates: { start: Moment; end: Moment };
	loading: boolean;
	disabled: boolean;
	onComplete: (id: number) => void;
	theme: Theme;
}
const date = moment().startOf('day').toDate();

const PeriodsTableStatusCellValue: React.FC<Props> = ({
	period,
	periodDates,
	loading,
	disabled,
	onComplete,
	theme,
}) => {
	let element: JSX.Element;
	if (period.completedBy) {
		element = (
			<TouchableHighlight
				style={{
					flex: 1,
					borderRadius: theme.roundness,
					justifyContent: 'center',
				}}
				onPress={() => {
					SimpleToast.show(
						`Compleated by:\n${period.completedBy!.emailAddress}`
					);
				}}
				underlayColor={'rgba(0, 150, 136, 0.25)'} //{theme.colors.primary}
				activeOpacity={0.55}
			>
				<>
					<Text style={{ textAlign: 'right' }}>
						{moment(period.completedAt).format('ll')}
					</Text>
					<Text
						style={{ textAlign: 'right', fontSize: 12 }}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{period.completedBy.emailAddress}
					</Text>
				</>
			</TouchableHighlight>
		);
	} else {
		const startDateMidnight = periodDates.start.toDate();
		const periodStarted = date >= startDateMidnight;
		let color = disabled
			? theme.colors.disabled
			: periodDates.end.toDate() < date
			? theme.colors.error
			: startDateMidnight > date
			? theme.colors.disabled
			: theme.colors.placeholder;

		element = loading ? (
			<ActivityIndicator color={theme.colors.primary} size={24} />
		) : (
			<IconButton
				icon={disabled ? 'cancel' : 'check'}
				disabled={disabled || !periodStarted}
				onPress={() => onComplete(period.id)}
				color={color}
			/>
		);
	}
	return element;
};

export default PeriodsTableStatusCellValue;
