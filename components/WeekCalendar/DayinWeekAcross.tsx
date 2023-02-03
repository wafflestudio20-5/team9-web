import React from 'react';

import styles from './DayinWeekAcross.module.scss';

import { LayerData } from '@customTypes/ScheduleTypes';
import getEventComponent from '@utils/getEventComponent';

export default function DayinWeekAcross({
    eventData,
    dateData,
}: {
    eventData: LayerData;
    dateData: string;
}) {
    const eventDataEntries = Object.entries(eventData);
    return (
        <div className={styles.day}>
            {eventDataEntries.map(([layer, event]) => {
                return getEventComponent({
                    data: event,
                    layer: Number(layer),
                });
            })}
        </div>
    );
}
