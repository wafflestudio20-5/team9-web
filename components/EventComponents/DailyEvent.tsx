import React from 'react';

import styles from './DailyEvent.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';
import { getTimeInMinutes } from '@utils/calculateDate';

export default function DailyEvent({
    textTop,
    event,
    layer,
}: {
    textTop: number;
    event: FullSchedule;
    layer: number;
}) {
    const heightPerMinute = 1320 / (24 * 60);
    const startTimeInMinutes = getTimeInMinutes(new Date(event.start_at));
    const endTimeInMinutes = getTimeInMinutes(new Date(event.end_at));
    const topPosition = startTimeInMinutes * heightPerMinute;
    const height = (endTimeInMinutes - startTimeInMinutes) * heightPerMinute;
    return (
        <div
            className={styles.event}
            style={{
                top: `${topPosition}px`,
                width: `calc(100% - ${layer * 16}px)`,
                height: `${height}px`,
            }}
        >
            <div
                className={styles.textHolder}
                style={{ marginTop: `${textTop}px` }}
            ></div>
        </div>
    );
}
