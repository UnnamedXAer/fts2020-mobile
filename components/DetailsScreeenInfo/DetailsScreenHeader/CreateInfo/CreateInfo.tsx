import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Placeholder } from 'rn-placeholder';
import moment from 'moment';
import User from '../../../../models/user';
import { PlaceholderLine, Shine } from '../../../UI/Placeholder/Placeholder';
import Link from '../../../UI/Link';

const dimensions = Dimensions.get('screen');

interface Props {
	owner: User | undefined;
	createAt: Date;
	onPersonTouch: (id: User['id']) => void;
}

const CreateInfo: React.FC<Props> = ({ owner, createAt, onPersonTouch }) => {
	return (
		<View
			style={{
				minWidth: (() => {
					const x = dimensions.width - 32 - 16 - 64;
					return x;
				})(),

				marginStart: 8,
				justifyContent: 'center',
			}}
		>
			{owner ? (
				<>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
						}}
					>
						<Text>Created by </Text>
						<Link onPress={() => onPersonTouch(owner!.id)}>
							{owner.emailAddress}
						</Link>
					</View>
					<Text>Created at {moment(createAt).format('ll')}</Text>
				</>
			) : (
				<Placeholder Animation={Shine}>
					<PlaceholderLine height={16} />
					<PlaceholderLine height={16} />
				</Placeholder>
			)}
		</View>
	);
};

export default CreateInfo;
