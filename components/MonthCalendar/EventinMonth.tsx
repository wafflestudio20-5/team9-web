import React from 'react';

import styles from './EventinMonth.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';

export const AcrossEvent = ({ eventData }: { eventData: FullSchedule }) => {
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
        <div className={`${styles.event} ${colorLayer()}`}>
            <span>{eventData.title}</span>
        </div>
    );
};
