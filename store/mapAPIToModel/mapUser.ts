import { APIUser } from "../apiTypes";
import User from "../../models/user";


export const mapApiUserDataToModel = (data: APIUser) =>
new User(
    data.id,
    data.emailAddress,
    data.userName,
    data.provider,
    data.joinDate,
    data.avatarUrl,
    data.active
);