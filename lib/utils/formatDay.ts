export const DAYS_ARR = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDayToKr = (d: number) => DAYS_ARR[d];

export const formatDayToNum = (d: string) => DAYS_ARR.indexOf(d);
