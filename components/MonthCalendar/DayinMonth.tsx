import React from 'react';

import styles from './DayinMonth.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';

export default function DayinMonth({
    dateData,
    eventData,
}: {
    dateData: string;
    eventData?: { across: FullSchedule[]; within: FullSchedule[] };
}) {
    const today = new Date();
    const dateToday = today.getDate();
    const monthToday = today.getMonth() + 1;
    const { monthNow, dateNow } = useDateContext();
    const [year, month, date] = dateData.split('-').map(str => {
        return Number(str);
    });
    const dateString =
        date == 1 && (date != dateToday || month != monthToday)
            ? `${month}월 ${date}일`
            : `${date}`;
    const dateStringClass = () => {
        if (date == dateToday && month == monthToday) {
            return styles.today;
        }
        if (month == today.getMonth()) {
            return `${styles.currMonth} ${date === 1 && styles.textIncluded}`;
        }
        return `${styles.notCurrMonth} ${date === 1 && styles.textIncluded}`;
    };
    return (
        <div className={styles.wrapper}>
            <button className={dateStringClass()}>
                <span>{dateString}</span>
            </button>
        </div>
    );
}
