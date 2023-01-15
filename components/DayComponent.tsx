import React from 'react';

import styles from './DayComponent.module.scss';

import { useCalendarContext } from '@contexts/CalendarContext';
import { DAYS_ARR } from '@utils/formatDay';

export default function DayComponent({
    isToday,
    date,
    day,
}: {
    isToday: boolean;
    date: number;
    day: number;
}) {
    const { calendarType } = useCalendarContext();
    const twentyFourHours: Array<number> = Array.from(
        { length: 24 },
        (v, i) => i + 1,
    );

    const getHeadType = () => {
        if (calendarType === 'month') {
            return styles.headRowInWeek;
        } else if (calendarType === 'day') {
            return styles.headRowInDay;
        }
    };

    // get type of date
    // draw blue circle when date is 'today'
    const getDateType = () => {
        if (isToday) {
            return styles.dayTodayNumber;
        } else {
            return styles.dayNotTodayNumber;
        }
    };

    return (
        <div className={styles.dayContentHolder}>
            <div className={getHeadType()}>
                <div className={styles.dayHolder}>
                    <div className={styles.dayText}>{DAYS_ARR[day]}</div>
                    <div className={getDateType()}>{date}</div>
                </div>
            </div>
            <div className={styles.mainSchedules}>
                {twentyFourHours.map((key, index) => {
                    return (
                        <div className={styles.oneHourInDay} key={key}></div>
                    );
                })}
            </div>
        </div>
    );
}
