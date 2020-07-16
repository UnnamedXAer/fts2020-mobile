import { APITask, APIUserTask } from "../apiTypes";
import Task, { UserTask } from "../../models/task";

export const mapApiTaskDataToModel = (data: APITask) =>
    new Task({
        id: data.id,
        flatId: data.flatId,
        name: data.title,
        description: data.description,
        startDate: new Date(data.startDate!),
        endDate: new Date(data.endDate!),
        timePeriodUnit: data.timePeriodUnit,
        timePeriodValue: data.timePeriodValue,
        active: data.active,
        createAt: new Date(data.createAt!),
        createBy: data.createBy,
    });

export const mapApiUserTaskDataToModel = (data: APIUserTask) =>
    new UserTask({
        id: data.id,
        flatId: data.flatId,
        name: data.title,
        flatName: data.flatName,
        timePeriodUnit: data.timePeriodUnit,
        timePeriodValue: data.timePeriodValue,
        active: data.active,
    });