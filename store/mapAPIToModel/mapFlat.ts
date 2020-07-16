import { APIFlat } from "../apiTypes";
import Flat from "../../models/flat";

export const mapAPIFlatDataToModel = (data: APIFlat) =>
    new Flat({
        id: data.id,
        description: data.description,
        name: data.name,
        ownerId: data.createBy,
        createAt:
            typeof data.createAt === 'string'
                ? new Date(data.createAt)
                : data.createAt,
        active: data.active,
    });