export enum DAYS {
    SUN = '일',
    MON = '월',
    TUS = '화',
    WED = '수',
    THU = '목',
    FRI = '금',
    SAT = '토',
}

const DAYS_ARR = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDayToKr = (d: number) => DAYS_ARR[d];

export const formatDayToNum = (d: DAYS) => DAYS_ARR.indexOf(d);
