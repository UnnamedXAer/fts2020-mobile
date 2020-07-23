import React from 'react';
import moment from 'moment';
import { Period } from '../../models/period';
import User from '../../models/user';
import { useTheme, Paragraph, Divider, Title, Colors } from 'react-native-paper';
import NotificationCard from '../UI/NotificationCard';
import { View } from 'react-native';

interface Props {
	loggedUserEmailAddress: User['emailAddress'];
	period: Period;
}

const PeriodCompleteText: React.FC<Props> = ({ loggedUserEmailAddress, period }) => {
	const theme = useTheme();

	const isPeriodDelayed = moment(period.endDate)
		.startOf('day')
		.isBefore(moment().startOf('day'));

	const startDate = moment(period.startDate).format('dddd, Do MMMM');
	const endDate = moment(period.endDate).format('dddd, Do MMMM');
	let dateText: string;
	if (startDate === endDate) {
		dateText = startDate;
	} else {
		dateText = `${startDate} - ${endDate}`;
	}

	return (
		<View>
			<Paragraph style={{textAlign: 'right', fontStyle: 'italic'}}>Today is {moment().format('dddd, Do MMMM')}</Paragraph>
			{period.assignedTo.emailAddress !== loggedUserEmailAddress && (
				<NotificationCard severity="warning" fontSize={14}>
					You are about to complete period assigned to:{'\n'}
					<Paragraph style={{ color:'rgb(102, 60, 0)', fontWeight: 'bold' }}>
						{period.assignedTo.emailAddress} ({period.assignedTo.userName})
					</Paragraph>
					{'\n'}
					Make sure you selected the right one before confirm.
				</NotificationCard>
			)}
			<Paragraph style={{ marginTop: 8, fontWeight: 'bold' }}>Time period:</Paragraph>
			<Paragraph
				style={{
					color: isPeriodDelayed
						? theme.colors['accent']
						: theme.colors['primary'],
				}}
			>
				{dateText}
			</Paragraph>
		</View>
	);
};

export default PeriodCompleteText;
