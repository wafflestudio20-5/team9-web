export enum DAYS {
    SUN = '일',
    MON = '월',
    TUE = '화',
    WED = '수',
    THU = '목',
    FRI = '금',
    SAT = '토',
}

export const DAYS_ARR = Object.values(DAYS);

export const formatDayToKr = (d: number) => DAYS_ARR[d];

export const formatDayToNum = (d: DAYS) => DAYS_ARR.indexOf(d);
