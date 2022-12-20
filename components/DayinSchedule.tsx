import React from 'react';

import { useDateContext } from '../contexts/DateContext';
import { formatDayToKr } from '../lib/utils/formatDay';

import styles from './DayinSchedule.module.scss';

// interface name overlaps & is different
// Need to properly decide data structure for further development
interface DayData {
    dt: number;
    dy: number;
    events: object[]; // to be specified
}

export default function DayinSchedule({ dayData }: { dayData: DayData }) {
    const { month, date } = useDateContext();
    const { dt, dy, events } = dayData;
    return (
        <div className={styles.wrapper}>
            <div className={styles.dateHolder}>
                <div className={styles.date}>
                    <div>{dt}</div>
                </div>
                <div className={styles.monthDay}>{`${month}월, ${formatDayToKr(
                    dy,
                )}`}</div>
            </div>

            <div>
                {events.map((event, index) => {
                    return <div key={index}>event</div>;
                })}
            </div>
        </div>
    );
}
