import { AppReducer, FlatsState, SimpleReducer } from '../storeTypes';
import { FlatsActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';
import User from '../../models/user';
import {
	AddFlatActionPayload,
	SetShowInactiveFlatsActionPayload,
	SetFlatInvitationsActionPayload,
	RemoveFlatMemberActionPayload,
	SetFlatActionPayload
} from '../actions/flats';

const initialState: FlatsState = {
	flats: [],
	flatsLoadTime: 0,
	createdFlatsTmpIds: {},
	showInactive: false
};

const setFlats: SimpleReducer<FlatsState, Flat[]> = (state, action) => {
	return {
		...state,
		flats: action.payload,
		flatsLoadTime: Date.now(),
	};
};

const setFlat: SimpleReducer<FlatsState, SetFlatActionPayload> = (state, action) => {
	const { flat } = action.payload;
	const updatedFlats = [...state.flats];
	const flatIdx = updatedFlats.findIndex((x) => x.id === flat.id);

	if (flatIdx === -1) {
		updatedFlats.push(flat);
	} else {
		const updatedFlat = flat;

		if (updatedFlats[flatIdx].owner) {
			updatedFlat.owner = updatedFlats[flatIdx].owner;
		}
		if (updatedFlats[flatIdx].members) {
			updatedFlat.members = updatedFlats[flatIdx].members;
		}
		if (updatedFlats[flatIdx].invitations) {
			updatedFlat.invitations = updatedFlats[flatIdx].invitations;
		}
		updatedFlats[flatIdx] = updatedFlat;
	}

	return {
		...state,
		flats: updatedFlats,
	};
};

const addFlat: SimpleReducer<FlatsState, AddFlatActionPayload> = (
	state,
	action
) => {
	const { flat, tmpId } = action.payload;

	return {
		...state,
		flats: state.flats.concat(flat),
		createdFlatsTmpIds: { ...state.createdFlatsTmpIds, [tmpId]: flat.id },
	};
};

const setOwner: SimpleReducer<FlatsState, { user: User; flatId: number }> = (
	state,
	action
) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		owner: action.payload.user,
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const setMembers: SimpleReducer<
	FlatsState,
	{ flatId: number; members: User[] }
> = (state, action) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		members: action.payload.members,
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const removeMember: SimpleReducer<FlatsState, RemoveFlatMemberActionPayload> = (
	state,
	action
) => {
	const { flatId, userId } = action.payload;
	const updatedFlats = [...state.flats];
	const flatIdx = updatedFlats.findIndex((x) => x.id === flatId);

	if (flatIdx !== -1) {
		const updatedMembers = updatedFlats[flatIdx].members?.filter(
			(x) => x.id !== userId
		);
		if (updatedMembers) {
			updatedFlats[flatIdx].members = updatedMembers;
		}
	}

	return {
		...state,
		flats: updatedFlats,
	};
};

const setInvitations: SimpleReducer<
	FlatsState,
	SetFlatInvitationsActionPayload
> = (state, action) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = new Flat({
		...updatedFlats[flatIndex],
		invitations: action.payload.invitations,
	});
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const setShowInactive: SimpleReducer<FlatsState, SetShowInactiveFlatsActionPayload> = (state, action) => {
	return {
		...state,
		showInactive: action.payload.show
	};
};

const clearFlat: SimpleReducer<FlatsState, { id: number }> = (state, action) => {
	const { id } = action.payload
	return {
		...state,
		flats: state.flats.filter(x => x.id !== id)
	}
}

const clearState: SimpleReducer<FlatsState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<FlatsState, FlatsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatsActionTypes.Set:
			return setFlats(state, action);
		case FlatsActionTypes.SetFlat:
			return setFlat(state, action);
		case FlatsActionTypes.Add:
			return addFlat(state, action);
		case FlatsActionTypes.SetOwner:
			return setOwner(state, action);
		case FlatsActionTypes.SetMembers:
			return setMembers(state, action);
		case FlatsActionTypes.RemoveMember:
			return removeMember(state, action);
		case FlatsActionTypes.SetInvitations:
			return setInvitations(state, action);
		case FlatsActionTypes.SetShowInactive:
			return setShowInactive(state, action);
		case FlatsActionTypes.ClearFlat:
			return clearFlat(state, action);
		case FlatsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
