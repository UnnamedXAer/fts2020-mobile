import { APIInvitation } from "../apiTypes";
import Invitation from "../../models/invitation";

export const mapAPIInvitationDataToModel = (data: APIInvitation) =>
    new Invitation({
        id: data.id,
        token: data.token,
        createAt: data.createAt,
        actionDate: data.actionDate,
        emailAddress: data.emailAddress,
        createBy: data.createBy,
        sendDate: data.sendDate,
        status: data.status,
    });