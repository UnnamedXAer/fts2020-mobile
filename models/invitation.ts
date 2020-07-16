import User from './user';
import Flat from './flat';
import { APIInvitationPresentation } from '../store/apiTypes';
import { InvitationStatus } from '../constants/invitation';
import { mapAPIFlatDataToModel } from '../store/mapAPIToModel/mapFlat';
import { mapApiUserDataToModel } from '../store/mapAPIToModel/mapUser';

interface InvitationParams {
	id: number;
	createBy: number;
	createAt: Date | string;
	emailAddress: string;
	actionDate: Date | string | null;
	sendDate: Date | string | null;
	status: InvitationStatus;
	token: string;
}

class Invitation {
	id: number;
	createBy: number;
	createAt: Date;
	emailAddress: string;
	actionDate: Date | null;
	sendDate: Date | null;
	status: InvitationStatus;
	token: string;

	constructor(params: InvitationParams = {} as InvitationParams) {
		const {
			id,
			createBy,
			createAt,
			emailAddress,
			actionDate,
			sendDate,
			status,
			token,
		} = params;

		this.id = id;
		this.createBy = createBy;
		this.createAt =
			typeof createAt === 'string' ? new Date(createAt) : createAt;
		this.emailAddress = emailAddress;
		this.actionDate =
			typeof actionDate === 'string' ? new Date(actionDate) : actionDate;
		this.sendDate =
			typeof sendDate === 'string' ? new Date(sendDate) : sendDate;
		this.status = status;
		this.token = token;
	}
}


export class InvitationPresentation {
	public id: number;
	token: string;
	public invitedPerson: string | User;
	public sendDate: Date | null;
	public status: InvitationStatus;
	public actionDate: Date | null;
	public createAt: Date;
	public sender: User;
	public flat: Flat;
	public actionBy: User | null;
	constructor(data: APIInvitationPresentation) {
		this.id = data.id;
		this.token = data.token;
		this.invitedPerson =
			typeof data.invitedPerson === 'string'
				? data.invitedPerson
				: User.fromData(data.invitedPerson);
		this.status = data.status;
		this.sendDate =
			typeof data.sendDate === 'string'
				? new Date(data.sendDate)
				: data.sendDate;
		this.actionDate = data.actionDate
			? typeof data.actionDate === 'string'
				? new Date(data.actionDate)
				: data.actionDate
			: null;
		this.createAt =
			typeof data.createAt === 'string'
				? new Date(data.createAt)
				: data.createAt;
		this.sender = User.fromData({
			...data.sender,
		});
		this.flat = mapAPIFlatDataToModel(data.flat);
		this.flat.owner = mapApiUserDataToModel(data.flatOwner);
		this.actionBy = data.actionBy
			? mapApiUserDataToModel(data.actionBy)
			: null;
	}
}

export default Invitation;
