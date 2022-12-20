import React from 'react';

import { useDateContext } from '../contexts/DateContext';

import styles from './DayinMonth.module.scss';

export interface DayData {
    m: number;
    d: number;
    events: object[]; // to be specified
}

export default function DayinMonth({ dayData }: { dayData: DayData }) {
    const { month, date } = useDateContext();
    const { m, d, events } = dayData;
    // names overlap!
    // month & date vs m & d
    // OR
    // month_now & date_now vs month & date
    const dateString = d == 1 && d != date ? `${m}월 ${d}일` : `${d}`;
    const dateStringClass = () => {
        if (d == date) {
            return styles.today;
        }
        if (m == month) {
            return styles.currMonth;
        }
        return styles.notCurrMonth;
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.dateHolder}>
                <div className={dateStringClass()}>{dateString}</div>
            </div>
            <div className={styles.eventsHolder}>
                {events.map((event, index) => {
                    return <div key={index}>event</div>;
                })}
            </div>
        </div>
    );
}
