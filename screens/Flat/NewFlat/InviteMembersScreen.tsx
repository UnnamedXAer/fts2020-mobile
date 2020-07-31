import React, { MutableRefObject, useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput as TextInputType,
} from 'react-native';
import {
	withTheme,
	Paragraph,
	Divider,
	List,
	TextInput,
	HelperText,
	IconButton,
} from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import CustomButton from '../../../components/UI/CustomButton';
import {
	InviteMembersScreenNavigationProp,
	InviteMembersScreenRouteProps,
} from '../../../types/navigationTypes';
import { StateError } from '../../../store/ReactTypes/customReactTypes';
import RootState from '../../../store/storeTypes';
import User from '../../../models/user';
import { NewFlatMember } from '../../../types/types';
import { checkEmailAddress } from '../../../utils/validation';
import { UsersActionTypes } from '../../../store/actions/actionTypes';
import axios from '../../../axios/axios';
import { MembersStatus } from '../../../components/Flat/InvitationMembersEmailListItem';
import InviteMembersEmailList from '../../../components/Flat/InviteMembersEmailList';
import HttpErrorParser from '../../../utils/parseError';
import NotificationCard from '../../../components/UI/NotificationCard';
import { APIUser } from '../../../store/apiTypes';
import { mapApiUserDataToModel } from '../../../store/mapAPIToModel/mapUser';

interface Props {
	theme: Theme;
	navigation: InviteMembersScreenNavigationProp;
	route: InviteMembersScreenRouteProps;
}

const InviteMembersScreen: React.FC<Props> = ({ theme, navigation, route }) => {
	const dispatch = useDispatch();
	const inputRef: MutableRefObject<TextInputType | undefined> = useRef();
	const [expanded, setExpanded] = useState(true);
	const [collapseOnFocus, setCollapseOnFocus] = useState(true);
	const { isNewFlat, flatId } = route.params;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [inputValue, setInputValue] = useState('');
	const [inputError, setInputError] = useState(false);
	const loggedUser = useSelector((state: RootState) => state.auth.user)!;
	const flatMembers = useSelector(
		(state: RootState) => state.flats.flats.find((x) => x.id === flatId)?.members
	);
	const users = useSelector((state: RootState) => state.users.users);
	const [membersEmails, setMembersEmails] = React.useState<
		NewFlatMember['emailAddress'][]
	>([]);
	const [members, setMembers] = React.useState<Partial<User>[]>([]);
	const [membersStatus, setMembersStatus] = useState<{
		[key: string]: MembersStatus;
	}>({});

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const inputBlurHandler = () => {
		if (inputValue.length > 0) {
			const email = inputValue.trim().toLowerCase();
			const emailValid = checkEmailAddress(email);
			setInputError(!emailValid);
		}
	};

	const removeMemberHandler = (email: NewFlatMember['emailAddress']) => {
		setMembers((prevMembers) => {
			const updatedMembers = prevMembers.filter((x) => x.emailAddress !== email);
			return updatedMembers;
		});

		setMembersEmails((prevState) => prevState.filter((x) => x !== email));

		setMembersStatus((prevState) => {
			const updatedState = { ...prevState };
			delete updatedState[email];
			return updatedState;
		});
	};

	const getUserByEmail = useCallback(
		async (email: NewFlatMember['emailAddress']) => {
			let user = users.find((x) => x.emailAddress.toLowerCase() === email);

			if (!user) {
				const url = `/users?emailAddress=${email}`;
				try {
					const { data, status } = await axios.get<APIUser>(url);
					if (status === 200) {
						user = mapApiUserDataToModel(data);
						dispatch({
							type: UsersActionTypes.SetUser,
							payload: user,
						});
					}
				} catch (err) {
					throw err;
				}
			}
			return user;
		},
		[dispatch, users]
	);

	const verifyIfEmailRegistered = useCallback(
		async (email: NewFlatMember['emailAddress']) => {
			try {
				const user = await getUserByEmail(email);
				if (inputRef.current) {
					if (user) {
						addUserToMembers(user, MembersStatus.ok);
					} else {
						setMembersStatus((prevState) => ({
							...prevState,
							[email]: MembersStatus.not_found,
						}));
					}
				}
			} catch (err) {
				if (inputRef.current) {
					setMembersStatus((prevState) => ({
						...prevState,
						[email]: MembersStatus.error,
					}));
				}
			}
		},
		[getUserByEmail]
	);

	const addUserToMembers = (user: User, status: MembersStatus) => {
		user.emailAddress = user.emailAddress.toLowerCase();
		setMembersStatus((prevState) => {
			const updatedState = { ...prevState };
			updatedState[user.emailAddress] = MembersStatus.accepted;
			return updatedState;
		});

		setTimeout(
			() =>
				setMembersStatus((prevState) => ({
					...prevState,
					[user.emailAddress]: status,
				})),
			700
		);

		setMembers((prevSate) => {
			const idx = prevSate.findIndex((x) => x.emailAddress === user.emailAddress);
			const updatedState = [...prevSate];
			const updatedUser = new User(
				user.id,
				user.emailAddress,
				user.userName,
				user.provider,
				user.joinDate,
				user.avatarUrl,
				user.active
			);
			if (idx === -1) {
				updatedState.push(updatedUser);
			} else {
				updatedState[idx] = updatedUser;
			}
			return updatedState;
		});
	};

	const emailSubmitHandler = () => {
		const email = inputValue.trim().toLowerCase();
		const emailValid = checkEmailAddress(email);
		if (emailValid) {
			if (!membersEmails.includes(email)) {
				addEmailInvitationToList(email);
			}
			setInputValue('');
			setInputError(false);
			inputRef.current!.focus();
		} else {
			if (inputValue.length > 0) {
				setInputError(true);
			}
		}
	};

	const addEmailInvitationToList = (email: NewFlatMember['emailAddress']) => {
		setMembersEmails((prevSate) => [email].concat(prevSate));

		let member: User | undefined;
		if (flatMembers) {
			member = flatMembers.find((x) => x.emailAddress === email);
			if (member instanceof User) {
				addUserToMembers(member, MembersStatus.already_member);
			}
		}
		if (!member) {
			setMembersStatus((prevState) => ({
				...prevState,
				[email]: MembersStatus.loading,
			}));
			setMembers((prevSate) =>
				prevSate.concat({ emailAddress: email } as Partial<User>)
			);
			verifyIfEmailRegistered(email);
		}
	};

	const sendInvitationsHandler = async () => {
		const emails: User['emailAddress'][] = [];
		members.forEach(({ emailAddress }) => {
			const status = membersStatus[emailAddress!];
			if (
				status !== MembersStatus.invalid &&
				status !== MembersStatus.already_member &&
				emailAddress !== loggedUser.emailAddress
			) {
				emails.push(emailAddress!);
			}
		});

		if (emails.length === 0) {
			return setError('There is no one to invite.');
		}
		setError(null);
		setLoading(true);
		try {
			await axios.post(`/flats/${flatId}/members/invite`, {
				members: emails,
			});
			if (inputRef.current) {
				if (isNewFlat) {
					navigation.replace('FlatDetails', { id: flatId });
				} else {
					navigation.pop();
				}
			}
		} catch (err) {
			if (inputRef.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setError(msg);
				setLoading(false);
			}
		}
	};

	return (
		<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="height">
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<View style={styles.inputContainer}>
						<List.Accordion
							onPress={() => setExpanded((prevState) => !prevState)}
							expanded={expanded}
							titleStyle={[
								{
									textAlign: 'center',
									fontWeight: 'bold',
								},
							]}
							title="Members invitations"
						>
							<Paragraph style={styles.infoParagraph}>
								Add users by entering their email address. These users
								will receive an email asking them to accept the
								invitation. Invitation will be sent also to people not
								registered in FTS2020.
							</Paragraph>
						</List.Accordion>
						<Divider />
						<Paragraph style={styles.infoParagraphHelper}>
							New members can be invited later.
						</Paragraph>
						<Divider />
					</View>
					<View style={styles.inputContainer}>
						<View style={styles.inputWithAction}>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.colors.surface,
									},
								]}
								placeholder="Type person email to add."
								keyboardType="email-address"
								returnKeyType="search"
								returnKeyLabel="add-email"
								autoCompleteType="email"
								autoCorrect={false}
								autoCapitalize="none"
								disabled={loading}
								value={inputValue}
								error={inputError}
								ref={inputRef as MutableRefObject<TextInputType>}
								onSubmitEditing={emailSubmitHandler}
								onChangeText={setInputValue}
								onBlur={inputBlurHandler}
								onFocus={() => {
									if (collapseOnFocus && expanded) {
										setCollapseOnFocus(false);
										setExpanded(false);
									}
								}}
							/>
							<IconButton
								icon="plus"
								size={24}
								onPress={emailSubmitHandler}
							/>
						</View>
						<HelperText
							style={{
								color: theme.colors[inputError ? 'error' : 'placeholder'],
							}}
						>
							{inputError
								? 'Enter valid email address.'
								: 'Type email address of person that you want to add as a flat member.'}
						</HelperText>
					</View>
					<View style={styles.inputContainer}>
						<InviteMembersEmailList
							emails={membersEmails}
							loggedUser={loggedUser}
							members={members}
							formLoading={loading}
							membersStatus={membersStatus}
							onEmailRemove={removeMemberHandler}
							theme={theme}
						/>
					</View>
					{error && (
						<View style={{ width: '90%' }}>
							<NotificationCard severity="error">{error}</NotificationCard>
						</View>
					)}
					<View style={styles.actions}>
						<CustomButton
							disabled={loading}
							accent
							onPress={() => {
								if (isNewFlat) {
									navigation.replace('FlatDetails', { id: flatId });
								} else {
									navigation.pop();
								}
							}}
						>
							{isNewFlat ? 'LATER' : 'BACK'}
						</CustomButton>
						<CustomButton
							onPress={sendInvitationsHandler}
							loading={loading}
							disabled={loading}
						>
							SEND
						</CustomButton>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	screen: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	infoParagraph: {
		fontSize: 20,
		marginVertical: 8,
	},
	infoParagraphHelper: {
		fontSize: 14,
		color: '#64b5f6',
		marginVertical: 8,
		textAlign: 'center',
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	inputWithAction: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	input: {
		fontSize: 16,
		height: 50,
		flex: 1,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(InviteMembersScreen);
