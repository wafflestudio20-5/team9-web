import React from 'react';

import styles from './ScheduleContent.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';

interface ScheduleContentProps {
    schedule: FullSchedule;
}

export default function ScheduleContent({ schedule }: ScheduleContentProps) {
    return (
        <div className={styles.scheduleContent}>
            <div className={styles.title}>여기는 제목</div>
        </div>
    );
}
