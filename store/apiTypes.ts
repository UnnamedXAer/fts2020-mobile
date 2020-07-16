import User from "../models/user";
import { TaskPeriodUnit } from "../models/task";
import { PeriodUser } from "../models/period";
import { InvitationStatus } from "../constants/invitation";

export type Provider = 'local' | 'google';

export type APIFlat = {
    id: number;
    name: string;
    description: string;
    members?: number[];
    createBy: number;
    createAt: Date;
    active: boolean;
};

export type APIInvitation = {
    id: number;
    token: string;
    flatId: number;
    createBy: number;
    createAt: string;
    emailAddress: User['emailAddress'];
    actionDate: string | null;
    sendDate: string | null;
    status: InvitationStatus;
    actionBy: number | null;
};

export type APIInvitationPresentation = {
    id: APIInvitation['id'];
    token: APIInvitation['token'];
    status: APIInvitation['status'];
    sendDate: APIInvitation['sendDate'];
    actionDate: APIInvitation['actionDate'];
    createAt: APIInvitation['createAt'];
    sender: APIUser;
    invitedPerson: APIUser | string;
    flat: APIFlat;
    flatOwner: APIUser;
    actionBy: APIUser | null;
};

export type APITask = {
    id?: number;
    title: string;
    description?: string;
    members?: number[];
    createBy?: number;
    createAt?: string;
    flatId: number;
    startDate?: string;
    endDate?: string;
    timePeriodUnit?: TaskPeriodUnit;
    timePeriodValue?: number;
    active?: boolean;
};

export type APIUserTask = {
    id?: number;
    title: string;
    flatName?: string;
    flatId: number;
    timePeriodUnit?: TaskPeriodUnit;
    timePeriodValue?: number;
    active?: boolean;
};

export type APITaskPeriod = {
    id: number;
    taskId: number;
    startDate: string;
    endDate: string;
    assignedTo: PeriodUser;
    completedBy: PeriodUser | null;
    completedAt: string | null;
};


export type APIUser = {
    id: number;
    emailAddress: string;
    userName: string;
    provider: Provider;
    joinDate: Date;
    avatarUrl: string | undefined;
    active: boolean;
};