import React from 'react';

import getEventColorClass from './getEventColorClass';
import styles from './WithinEvent.module.scss';

import { useModal, MODAL_NAMES } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { useScheduleContext } from '@contexts/ScheduleContext';

export default function WithinEvent({
    eventData,
    eventHeight,
    slopeHeight,
    type,
    expandSides,
}: {
    eventData: FullSchedule;
    eventHeight: number;
    slopeHeight?: number;
    type: string;
    expandSides: boolean | undefined;
}) {
    const { getOnClickFunction, getEventItemFilterProp } = useScheduleContext();

    const sh = slopeHeight ? slopeHeight : 3;
    const getWidth = () => {
        if (expandSides) {
            return '100%';
        } else if (type === 'middle') {
            return '93%';
        } else {
            return '96.5%';
        }
    };

    return (
        <div
            className={`${styles.event} ${getEventColorClass(
                eventData.created_by,
            )}`}
            style={{
                height: `${eventHeight}px`,
                marginTop: `${sh}px`,
                marginLeft: `${
                    type === 'leftEnd' || expandSides ? '' : '3.5%'
                }`,
                marginRight: `${
                    type === 'rightEnd' || expandSides ? '' : '3.5%'
                }`,
                width: `${getWidth()}`,
                filter: `${getEventItemFilterProp(eventData)}`,
            }}
            onClick={getOnClickFunction(eventData)}
        >
            <span>{eventData.title}</span>
        </div>
    );
}
