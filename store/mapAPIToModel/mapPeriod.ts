import { Period } from "../../models/period";
import { APITaskPeriod } from "../apiTypes";

export const mapApiPeriodDataToModel = (period: APITaskPeriod) =>
    new Period({
        id: period.id,
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate),
        assignedTo: period.assignedTo,
        completedAt: period.completedAt ? new Date(period.completedAt) : null,
        completedBy: period.completedBy,
    });