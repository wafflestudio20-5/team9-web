import React from 'react';

import styles from './EventinMonth.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';

export const AcrossEvent = ({
    eventData,
    dateString,
}: {
    eventData: FullSchedule;
    dateString: string;
}) => {
    const isAfterStart = eventData.start_at.split(' ')[0] !== dateString;
    const isBeforeEnd = eventData.end_at.split(' ')[0] !== dateString;
    const colorLayer = () => {
        // console.log(eventData.layer);
        if (eventData.layer) {
            switch (eventData.layer % 3) {
                case 0:
                    return `${styles.chocolate}`;
                case 1:
                    return `${styles.honey}`;
                case 2:
                    return `${styles.strawberry}`;
            }
        }
        return `${styles.chocolate}`;
    };
    return (
        <div className={`${styles.across} ${colorLayer()}`}>
            <div className={isAfterStart ? styles.left : styles.filler} />
            <div className={styles.main}>
                <span>{eventData.title}</span>
            </div>
            <div className={isBeforeEnd ? styles.right : styles.filler} />
        </div>
    );
};
