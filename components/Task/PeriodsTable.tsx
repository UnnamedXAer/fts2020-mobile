import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import RootState from '../../store/storeTypes';
import { Period } from '../../models/period';
import moment from 'moment';

interface Props {
	periods: Period[] | undefined;
}

const PeriodsTable: React.FC<Props> = ({ periods }) => {
	console.log(periods);

	return (
		<DataTable>
			<DataTable.Header>
				<DataTable.Title>AssignedTo</DataTable.Title>
				<DataTable.Title numeric>End Date</DataTable.Title>
				<DataTable.Title numeric>Complete(d)</DataTable.Title>
			</DataTable.Header>

			{periods?.map((period) => {
				return (
					<DataTable.Row>
						<DataTable.Cell>{period.assignedTo.emailAddress}</DataTable.Cell>
						<DataTable.Cell>
							{moment(period.endDate).format('ll')}
						</DataTable.Cell>
						<DataTable.Cell numeric>
							{
								<MaterialIcons
									name={period.completedBy ? 'done-all' : 'done'}
									size={24}
									color="pink"
								/>
							}
						</DataTable.Cell>
					</DataTable.Row>
				);
			})}
			{periods && periods.length > 10 && (
				<DataTable.Pagination
					page={1}
					numberOfPages={3}
					onPageChange={(page) => {
						console.log(page);
					}}
					label={`${1}-${periods.length < 10 ? periods.length : 10} of ${
						periods?.length
					}`}
				/>
			)}
		</DataTable>
	);
};

const styles = StyleSheet.create({});

export default PeriodsTable;
