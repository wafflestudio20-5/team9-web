import React from 'react';

import styles from './DayinSchedule.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { formatDayToKr } from '@utils/formatDay';

// interface name overlaps & is different
// Need to properly decide data structure for further development
interface DayData {
    date: number;
    day: number;
    events: object[]; // to be specified
}

export default function DayinSchedule({ dayData }: { dayData: DayData }) {
    const { monthNow, dateNow } = useDateContext();
    const { date, day, events } = dayData;
    return (
        <div className={styles.wrapper}>
            <div className={styles.dateHolder}>
                <div className={styles.date}>
                    <div>{date}</div>
                </div>
                <div
                    className={styles.monthDay}
                >{`${monthNow}월, ${formatDayToKr(day)}`}</div>
            </div>

            <div>
                {events.map((event, index) => {
                    return <div key={index}>event</div>;
                })}
            </div>
        </div>
    );
}
