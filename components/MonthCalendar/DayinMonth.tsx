import { useRouter } from 'next/router';
import React, { useRef, useState, useMemo } from 'react';

import styles from './DayinMonth.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import AcrossEvent from '@components/AcrossEvent';
import WithinEvent from '@components/WithinEvent';
import { useBoxSizeContext } from '../../contexts/BoxSizeContext';

export default function DayinMonth({
    dateData,
    eventData,
}: {
    dateData: { dateString: string; day: number };
    eventData?: { across: FullSchedule[]; within: FullSchedule[] };
}) {
    const router = useRouter();
    const dayRef = useRef<HTMLDivElement>(null);
    const { boxHeight, boxWidth } = useBoxSizeContext();
    const layers = useMemo(() => {
        return eventData?.across.length! + eventData?.within.length!;
    }, [eventData]);

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
        <div
            className={styles.wrapper}
            style={{ height: `${boxHeight}px`, width: `${boxWidth}px` }}
        >
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
            <div className={styles.eventsHolder}>
                {eventData?.across.map((event, index) => {
                    if (event.layer && event.layer <= 3) {
                        return (
                            <AcrossEvent
                                key={index}
                                eventData={event}
                                dateString={dateString}
                                day={day}
                                eventHeight={20}
                            />
                        );
                    } else if (event.layer == 4 && layers > 4) {
                        return (
                            <div className={styles.seeMore}>{`${
                                layers - event.layer
                            }개 더보기`}</div>
                        );
                    } else return null;
                })}
                {eventData?.within.map((event, index) => {
                    if (
                        event.layer &&
                        event.layer + eventData?.across.length <= 3
                    ) {
                        return (
                            <WithinEvent
                                key={index}
                                eventData={event}
                                eventHeight={20}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}
