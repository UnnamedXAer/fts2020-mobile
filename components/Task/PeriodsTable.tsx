import React, { useState } from 'react';
import { DataTable,  withTheme, Paragraph } from 'react-native-paper';
import { Period } from '../../models/period';
import moment from 'moment';
import { View } from 'react-native';
import PeriodsTableStatusCellValue from './PeriodsTableStatusCellValue';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	periods: Period[] | undefined;
	disabled: boolean;
	periodsLoading: { [id: number]: boolean };
	onCompletePeriod: (id: number) => void;
	loggedUserEmailAddress: string;
	theme: Theme;
}

const PeriodsTable: React.FC<Props> = ({
	periods,
	disabled,
	periodsLoading,
	onCompletePeriod,
	loggedUserEmailAddress,
	theme,
}) => {
	const [page, setPage] = useState(0);
	const rows: JSX.Element[] = [];
	let periodLen = 0;
	const fromIdx = page * 10;
	let toIdx = fromIdx + 10;

	if (periods) {
		periodLen = periods.length;
		if (toIdx > periodLen) {
			toIdx = periodLen;
		}

		for (let i = fromIdx; i < toIdx; i++) {
			const period = periods[i];
			const startDateMidnight = moment(period.startDate).startOf('day');
			const endDateMidnight = moment(period.endDate).startOf('day');
			rows.push(
				<DataTable.Row key={period.id} style={{backgroundColor: i%2 === 0 ? '#eee' : void 0}}>
					<View style={{ flex: 1 }}>
						<Paragraph
							numberOfLines={1}
							style={{
								color:
									loggedUserEmailAddress ===
									period.assignedTo.emailAddress
										? theme.colors.accent
										: void 0,
							}}
						>
							{period.assignedTo.emailAddress}
						</Paragraph>
						<Paragraph numberOfLines={1} ellipsizeMode="tail" style={{color: theme.colors.placeholder}}>
							{period.assignedTo.userName}
						</Paragraph>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							width: 110,
						}}
					>
						<Paragraph>{moment(period.startDate).format('ll')}</Paragraph>
						<Paragraph>{moment(period.endDate).format('ll')}</Paragraph>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							width: 90,
							marginRight: 0,
						}}
					>
						<PeriodsTableStatusCellValue
							onComplete={onCompletePeriod}
							disabled={disabled}
							period={period}
							loading={periodsLoading[period.id]}
							periodDates={{
								start: startDateMidnight,
								end: endDateMidnight,
							}}
							theme={theme}
						/>
					</View>
				</DataTable.Row>
			);
		}
	}

	return (
		<DataTable style={{ marginBottom: 100 }}>
			<DataTable.Header>
				<View
					style={{
						flex: 1,
						alignItems: 'flex-start',
						justifyContent: 'center',
					}}
				>
					<Paragraph style={{ color: theme.colors.placeholder, fontSize: 12 }}>
						AssignedTo
					</Paragraph>
				</View>
				<View
					style={{
						width: 110,
						alignItems: 'flex-end',
						justifyContent: 'center',
					}}
				>
					<Paragraph style={{ color: theme.colors.placeholder, fontSize: 12 }}>
						Start - End Date
					</Paragraph>
				</View>
				<View
					style={{
						width: 90,
						alignItems: 'flex-end',
						justifyContent: 'center',
					}}
				>
					<Paragraph style={{ color: theme.colors.placeholder, fontSize: 12 }}>
						Complete(d)
					</Paragraph>
				</View>
			</DataTable.Header>
			{rows}
			{periods && periodLen > 10 && (
				<DataTable.Pagination
					page={page}
					numberOfPages={Math.ceil(periodLen / 10)}
					onPageChange={(newPage) => {
						setPage(newPage);
					}}
					label={`${fromIdx + 1}-${toIdx} of ${periodLen}`}
				/>
			)}
		</DataTable>
	);
};

export default withTheme(PeriodsTable);
