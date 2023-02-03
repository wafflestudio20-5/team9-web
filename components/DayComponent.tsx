import React from 'react';

import styles from './DayComponent.module.scss';

import { DAYS } from '@utils/formatting';

export default function DayComponent({
    isToday,
    date,
}: {
    isToday: boolean;
    date: Date;
}) {
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
                {twentyFourHours.map(key => {
                    return (
                        <div className={styles.oneHourInDay} key={key}></div>
                    );
                })}
            </div>
        </div>
    );
}
