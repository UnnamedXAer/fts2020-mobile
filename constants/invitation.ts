export enum InvitationAction {
    'ACCEPT' = 'ACCEPT',
    'REJECT' = 'REJECT',
    'CANCEL' = 'CANCEL',
    'RESEND' = 'RESEND',
}

export enum InvitationStatus {
    'CREATED' = 'CREATED',
    'SEND_ERROR' = 'SEND_ERROR',
    'PENDING' = 'PENDING',
    'ACCEPTED' = 'ACCEPTED',
    'REJECTED' = 'REJECTED',
    'EXPIRED' = 'EXPIRED',
    'CANCELED' = 'CANCELED',
}

export const InvitationStatusInfo = {
    [InvitationStatus.ACCEPTED]: 'Accepted.',
    [InvitationStatus.CANCELED]: 'Cancelled by sender.',
    [InvitationStatus.EXPIRED]: 'Expired.',
    [InvitationStatus.CREATED]: 'Not sent yet.',
    [InvitationStatus.PENDING]: 'Waiting for accept.',
    [InvitationStatus.REJECTED]: 'Rejected by person.',
    [InvitationStatus.SEND_ERROR]: 'Not sent - error.',
};

export const invitationInactiveStatuses = [
    InvitationStatus.ACCEPTED,
    InvitationStatus.CANCELED,
    InvitationStatus.EXPIRED,
    InvitationStatus.REJECTED,
];