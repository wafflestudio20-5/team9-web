import React from 'react';

import styles from './WithinEvent.module.scss';

import { useModal, MODAL_NAMES } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import getEventColorClass from './getEventColorClass';

export default function WithinEvent({
    eventData,
    eventHeight,
    layer,
    slopeHeight,
    type,
}: {
    eventData: FullSchedule;
    eventHeight: number;
    layer: number;
    slopeHeight?: number;
    type: string;
}) {
    const sh = slopeHeight ? slopeHeight : 3;
    const { openModal } = useModal();

    return (
        <div
            className={`${styles.event} ${getEventColorClass(
                eventData.created_by,
            )}`}
            style={{
                height: `${eventHeight}px`,
                marginTop: `${sh}px`,
                marginLeft: `${type === 'leftEnd' ? '' : '3.5%'}`,
                marginRight: `${type === 'rightEnd' ? '' : '3.5%'}`,
                width: `${type === 'middle' ? '93%' : '96.5%'}`,
            }}
            onClick={() => {
                openModal(MODAL_NAMES.scheduleView, {
                    schedule: eventData,
                });
            }}
        >
            <span>{eventData.title}</span>
        </div>
    );
}
