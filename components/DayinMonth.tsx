import React from 'react';

import { useDateContext } from '../contexts/DateContext';

import styles from './DayinMonth.module.scss';

export interface DayData {
    month: number;
    date: number;
    events: object[]; // to be specified
}

export default function DayinMonth({ dayData }: { dayData: DayData }) {
    const { monthNow, dateNow } = useDateContext();
    const { month, date, events } = dayData;
    // names overlap!
    // month & date vs m & d
    // OR
    // month_now & date_now vs month & date
    const dateString =
        date == 1 && date != dateNow ? `${month}월 ${date}일` : `${date}`;
    const dateStringClass = () => {
        if (date == dateNow) {
            return styles.today;
        }
        if (month == monthNow) {
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
