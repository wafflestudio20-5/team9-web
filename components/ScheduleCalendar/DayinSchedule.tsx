import { useRouter } from 'next/router';
import React, { MutableRefObject } from 'react';

import styles from './DayinSchedule.module.scss';

import getEventColorClass from '@components/EventComponents/getEventColorClass';
import { useScheduleContext } from '@contexts/ScheduleContext';
import { FullSchedule, NumberedEvent } from '@customTypes/ScheduleTypes';
import { getDatesInEvent } from '@utils/calcEventDates';
import { DAYS, formatEventTime } from '@utils/formatting';

interface DayinScheduleProps {
    dateString: string;
    eventData: NumberedEvent[];
}

export default function DayinSchedule({
    dateString,
    eventData,
}: DayinScheduleProps) {
    const [year, month, date] = dateString.split(' ');
    const dateObj = new Date(dateString);
    const today = new Date();
    const router = useRouter();
    const { getOnClickFunction, getScheduleEventItemStyleProp } =
        useScheduleContext();

    const MSPERDAY = 24 * 60 * 60 * 1000;
    const eventDurationMilliseconds = (event: FullSchedule) => {
        const endDate = new Date(event.end_at);
        const startDate = new Date(event.start_at);
        return endDate.getTime() - startDate.getTime();
    };

    const getPartSuffix = (event: FullSchedule) => {
        const eventDuration = eventDurationMilliseconds(event);
        if (eventDuration <= MSPERDAY) {
            return '';
        }
        const dateStrings = getDatesInEvent(event);
        return `(${dateStrings.indexOf(dateString)}/${dateStrings.length}일)`;
    };
    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.dateHolder} ${
                    dateObj.toDateString() === today.toDateString()
                        ? styles.today
                        : ''
                }`}
            >
                <div
                    className={styles.date}
                    onClick={() => {
                        router.push(`/day/${year}/${month}/${date}`);
                    }}
                >
                    <div>{dateObj.getDate()}</div>
                </div>
                <div className={styles.monthDay}>{`${
                    dateObj.getMonth() + 1
                }월, ${DAYS[dateObj.getDay()]}`}</div>
            </div>

            <div className={styles.eventsHolder}>
                {eventData.map((event, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.eventItem}
                            onClick={getOnClickFunction(event.event)}
                            style={getScheduleEventItemStyleProp(event.event)}
                        >
                            <div
                                className={`${
                                    styles.dotHolder
                                }  ${getEventColorClass(
                                    event.event.created_by,
                                )}`}
                            >
                                <div className={styles.colorDot} />
                            </div>

                            <div
                                className={styles.duration}
                            >{`${formatEventTime(
                                new Date(event.event.start_at),
                                new Date(event.event.end_at),
                            )}`}</div>
                            <div className={styles.title}>
                                {`${event.event.title} ${getPartSuffix(
                                    event.event,
                                )}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
