import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, withTheme, Paragraph } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import moment from 'moment';
import { Period } from '../../models/period';
import PeriodsTableStatusCellValue from './PeriodsTableStatusCellValue';
import DataTableHeaderCellText, {
	DataTablePlaceholderCellVal,
} from '../UI/DataTable/DataTableElements';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../UI/NotificationCard';

interface Props {
	periods: Period[] | undefined;
	disabled: boolean;
	error: StateError;
	periodsLoading: { [id: number]: boolean };
	onCompletePeriod: (id: number) => void;
	loggedUserEmailAddress: string;
	theme: Theme;
}

const PeriodsTable: React.FC<Props> = ({
	periods,
	disabled,
	periodsLoading,
	error,
	onCompletePeriod,
	loggedUserEmailAddress,
	theme,
}) => {
	const [page, setPage] = useState(0);
	const rows: JSX.Element[] = [];
	let periodLen = 0;
	const fromIdx = page * 10;
	let toIdx = fromIdx + 10;

	if (!periods) {
		for (let i = 0; i < 2; i++) {
			rows.push(
				<DataTable.Row key={i}>
					<View
						style={{
							...styles.cellAlignStartCenter,
							flex: 1,
						}}
					>
						<DataTablePlaceholderCellVal />
					</View>
					<View
						style={{
							...styles.cellAlignStartCenter,
							width: 110,
							paddingHorizontal: 4,
						}}
					>
						<DataTablePlaceholderCellVal />
					</View>
					<View
						style={{
							...styles.cellAlignStartCenter,
							width: 90,
						}}
					>
						<DataTablePlaceholderCellVal />
					</View>
				</DataTable.Row>
			);
		}
	} else if (periods) {
		periodLen = periods.length;
		if (toIdx > periodLen) {
			toIdx = periodLen;
		}

		for (let i = fromIdx; i < toIdx; i++) {
			const period = periods[i];
			const startDateMidnight = moment(period.startDate).startOf('day');
			const endDateMidnight = moment(period.endDate).startOf('day');
			rows.push(
				<DataTable.Row
					key={period.id}
					style={{ backgroundColor: i % 2 === 0 ? '#eee' : void 0 }}
				>
					<View
						style={{
							...styles.cellAlignStartCenter,
							flex: 1,
						}}
					>
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
						<Paragraph
							numberOfLines={1}
							ellipsizeMode="tail"
							style={{ color: theme.colors.placeholder }}
						>
							{period.assignedTo.userName}
						</Paragraph>
					</View>
					<View
						style={{
							...styles.cellAlignEndCenter,
							width: 110,
						}}
					>
						<Paragraph>
							{moment(period.startDate).format('ll')}
						</Paragraph>
						<Paragraph>
							{moment(period.endDate).format('ll')}
						</Paragraph>
					</View>
					<View
						style={{
							...styles.cellAlignEndCenter,
							width: 90,
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
						...styles.cellAlignStartCenter,
						flex: 1,
					}}
				>
					<DataTableHeaderCellText>
						AssignedTo
					</DataTableHeaderCellText>
				</View>
				<View
					style={{
						...styles.cellAlignEndCenter,
						width: 110,
					}}
				>
					<DataTableHeaderCellText>
						Start - End Date
					</DataTableHeaderCellText>
				</View>
				<View
					style={{
						...styles.cellAlignEndCenter,
						width: 90,
					}}
				>
					<DataTableHeaderCellText>
						Complete(d)
					</DataTableHeaderCellText>
				</View>
			</DataTable.Header>

			{error ? (
				<NotificationCard severity="error">{error}</NotificationCard>
			) : (
				rows
			)}
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

const styles = StyleSheet.create({
	cellAlignStartCenter: {
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	cellAlignEndCenter: {
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
});

export default withTheme(PeriodsTable);
