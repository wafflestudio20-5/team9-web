import React, { MutableRefObject } from 'react';

import styles from './DayinSchedule.module.scss';

import { DAYS } from '@utils/formatting';
import { NumberedEvent } from '@customTypes/ScheduleTypes';

interface DayinScheduleProps {
    dateString: string;
    eventData: NumberedEvent[];
}

export const DayinSchedule = React.forwardRef<
    HTMLDivElement,
    DayinScheduleProps
>(({ dateString, eventData }, ref): JSX.Element => {
    const dateObj = new Date(dateString);
    return (
        <div className={styles.wrapper} ref={ref}>
            <div className={styles.dateHolder}>
                <div className={styles.date}>
                    <div>{dateObj.getDate()}</div>
                </div>
                <div className={styles.monthDay}>{`${
                    dateObj.getMonth() + 1
                }월, ${DAYS[dateObj.getDay()]}`}</div>
            </div>

            <div>
                {eventData.map((event, index) => {
                    return (
                        <div
                            key={index}
                        >{`${event.num} ${event.event.title}`}</div>
                    );
                })}
            </div>
        </div>
    );
});
