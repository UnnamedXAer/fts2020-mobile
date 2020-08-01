import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from './navigationTypes';

export type ProfileScreenRouteProps = RouteProp<
	ProfileStackParamList,
	'Profile'
>;

export type ChangePasswordScreenRouteProps = RouteProp<
	ProfileStackParamList,
	'ChangePassword'
>;
