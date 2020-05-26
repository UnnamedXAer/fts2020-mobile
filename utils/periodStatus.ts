import { Period } from "../models/period";

export type PeriodStatusIconOptions = {
    icon: 'check' | '';
    color:
    | 'primary'
    | 'background'
    | 'surface'
    | 'accent'
    | 'error'
    | 'text'
    | 'onSurface'
    | 'onBackground'
    | 'disabled'
    | 'placeholder'
    | 'backdrop'
    | 'notification';
    disabled: boolean;
}

const getPeriodStatusOptions = (period: Period): PeriodStatusIconOptions => {



    const options: PeriodStatusIconOptions = {
        icon: 'check',
        color: 'accent',
        disabled: true
    }

    return options
}

export default getPeriodStatusOptions;