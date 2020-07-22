import React from 'react';
import moment from 'moment';
import { Period } from '../../models/period';
import User from '../../models/user';
import { useTheme, Paragraph } from 'react-native-paper';
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
			<Paragraph>Today is {moment().format('dddd, Do MMMM')}</Paragraph>
			{period.assignedTo.emailAddress !== loggedUserEmailAddress && (
				<NotificationCard severity="warning">
					You are about to complete period assigned to:{' '}
					<Paragraph>
						{period.assignedTo.emailAddress} ({period.assignedTo.userName})
					</Paragraph>
					Make sure you selected the right one before confirm.
				</NotificationCard>
			)}
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
