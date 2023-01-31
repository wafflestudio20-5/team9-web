import { useRouter } from 'next/router';
import React, { CSSProperties, useRef } from 'react';

import styles from './DayinMonth.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import AcrossEvent from '@components/AcrossEvent';

export default function DayinMonth({
    dateData,
    eventData,
    boxSize,
}: {
    dateData: { dateString: string; day: number };
    eventData?: { across: FullSchedule[]; within: FullSchedule[] };
    boxSize?: { width: string; height: string; padding?: string };
}) {
    const router = useRouter();
    const dayRef = useRef<HTMLDivElement>(null);
    const today = new Date();
    const dateToday = today.getDate();
    const monthToday = today.getMonth() + 1;
    const { dateString, day } = dateData;
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
        <div className={styles.wrapper} style={boxSize} ref={dayRef}>
            <div className={styles.buttonHolder}>
                <button
                    className={dateHeaderClass()}
                    onClick={() => {
                        router.push(`/day/${year}/${month}/${date}`);
                    }}
                >
                    <span>{dateHeader ? dateHeader : ''}</span>
                </button>
            </div>
            {eventData?.across.map((event, index) => {
                return (
                    <AcrossEvent
                        key={index}
                        eventData={event}
                        day={day}
                        dayWidth={Number(boxSize?.width.slice(0, -2))}
                        eventHeight={20}
                    />
                );
            })}
            <div className={styles.withinHolder}></div>
        </div>
    );
}
