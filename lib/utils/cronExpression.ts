import { DAYS } from '@utils/formattings';

const LAST = 'L';
const INTERVAL = '/';

export const parseCronExpression = (expr: string) => {
    const [date, month, days, year] = expr.split(' ').slice(2);
    let text = '';

    if (year.includes(INTERVAL)) {
        const interval = Number(year.split(INTERVAL)[1]);
        text += interval === 1 ? '매년' : `${interval}년마다`;
        if (!isNaN(Number(date))) {
            text += ` ${Number(month) + 1}월 ${date}일`;
        } else if (date === LAST) {
            text += ` ${Number(month) + 1}월 마지막날`;
        } else if (days.includes(LAST)) {
            text += ` ${Number(month) + 1}월 마지막 ${
                DAYS[Number(days[0])]
            }요일`;
        } else {
            text += ` ${Number(month) + 1}월 ${days[2]}번째 ${
                DAYS[Number(days[0])]
            }요일`;
        }
    } else if (month.includes(INTERVAL)) {
        const interval = Number(month.split(INTERVAL)[1]);
        text += interval === 1 ? '매월' : `${interval}개월마다`;
        if (!isNaN(Number(date))) {
            text += ` ${date}일`;
        } else if (date === LAST) {
            text += ' 마지막날';
        } else if (days.includes(LAST)) {
            text += ` 마지막 ${DAYS[Number(days[0])]}요일`;
        } else {
            text += ` ${days[2]}번째 ${DAYS[Number(days[0])]}요일`;
        }
    } else if (days.includes(INTERVAL)) {
        const [day, interval] = days.split(INTERVAL);
        text += Number(interval) === 1 ? '매주' : `${interval}주마다`;
        text += ` ${day
            .split(',')
            .map(d => `${DAYS[Number(d)]}요일`)
            .join(', ')}`;
    } else if (date.includes(INTERVAL)) {
        const interval = Number(date.split(INTERVAL)[1]);
        text += interval === 1 ? '매일' : `${interval}일마다`;
    } else {
        text = '반복 안 함';
    }

    return text;
};
