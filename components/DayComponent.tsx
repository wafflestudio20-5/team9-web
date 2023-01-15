import React from 'react';

import styles from './DayComponent.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { DAYS_ARR } from '@utils/formatDay';

export default function DayComponent() {
    const { dateNow, dayNow } = useDateContext();

    const twentyFourHours: Array<number> = Array.from(
        { length: 24 },
        (v, i) => i + 1,
    );

    return (
        <div className={styles.dayContentHolder}>
            <div className={styles.headRowInDay}>
                <div className={styles.dayHolder}>
                    <div className={styles.dayText}>{DAYS_ARR[dayNow]}</div>
                    <div className={styles.dayNumber}>{dateNow}</div>
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
