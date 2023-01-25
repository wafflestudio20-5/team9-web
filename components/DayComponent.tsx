import React from 'react';

import styles from './DayComponent.module.scss';

import { useCalendarContext } from '@contexts/CalendarContext';
import { DAYS } from '@utils/formattings';

export default function DayComponent({
    isToday,
    date,
}: {
    isToday: boolean;
    date: Date;
}) {
    const { calendarType } = useCalendarContext();

    const twentyFourHours: Array<number> = Array.from(
        { length: 24 },
        (v, i) => i + 1,
    );

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
            <div className={styles.headRow}>
                <div className={styles.dayHolder}>
                    <div className={styles.dayText}>{DAYS[date.getDay()]}</div>
                    <div className={getDateType()}>{date.getDate()}</div>
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
