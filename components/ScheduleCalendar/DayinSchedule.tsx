import React, { MutableRefObject } from 'react';

import styles from './DayinSchedule.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { DAYS } from '@utils/formatting';
import { FullSchedule, NumberedEvent } from '@customTypes/ScheduleTypes';

interface DayinScheduleProps {
    dateString: string;
    eventData: NumberedEvent[];
    renderCount: number;
}

export const DayinSchedule = React.forwardRef<
    HTMLDivElement,
    DayinScheduleProps
>(({ dateString, eventData, renderCount }, ref): JSX.Element => {
    const dateObj = new Date(dateString);
    const isRefAttached =
        eventData[eventData.length - 1].num === renderCount - 1;
    return (
        <div className={styles.wrapper} ref={isRefAttached ? ref : undefined}>
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
                    return <div key={index}>event</div>;
                })}
            </div>
        </div>
    );
});
