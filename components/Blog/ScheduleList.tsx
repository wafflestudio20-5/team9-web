import React from 'react';

import styles from './ScheduleList.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';

// can be changed depending on the response data type of `getRelatedSchedulesAPI`
interface ScheduleListProps {
    schedules: FullSchedule[];
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
    return (
        <div className={styles.schedules}>
            {schedules.map(s => (
                <Schedule schedule={s} key={s.id} />
            ))}
        </div>
    );
}

function Schedule({ schedule }: { schedule: FullSchedule }) {
    return (
        <div className={styles.schedule}>
            <div className={styles.title}>{schedule.title}</div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
