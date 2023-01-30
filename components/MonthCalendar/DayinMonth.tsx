import React from 'react';

import styles from './DayinMonth.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import { AcrossEvent } from './EventinMonth';

export default function DayinMonth({
    dateString,
    eventData,
}: {
    dateString: string;
    eventData?: { across: FullSchedule[]; within: FullSchedule[] };
}) {
    const today = new Date();
    const dateToday = today.getDate();
    const monthToday = today.getMonth() + 1;
    const [year, month, date] = dateString.split('-').map(str => {
        return Number(str);
    });
    const dateHeader =
        date == 1 && (date != dateToday || month != monthToday)
            ? `${month}월 ${date}일`
            : `${date}`;
    const dateHeaderClass = () => {
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
            <button className={dateHeaderClass()}>
                <span>{dateHeader ? dateHeader : ''}</span>
            </button>
            <div className={styles.acrossHolder}>
                {eventData?.across.map((event, index) => {
                    return (
                        <AcrossEvent
                            key={index}
                            eventData={event}
                            dateString={dateString}
                        />
                    );
                })}
            </div>
            <div className={styles.withinHolder}></div>
        </div>
    );
}
