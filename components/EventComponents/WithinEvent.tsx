import React from 'react';

import styles from './WithinEvent.module.scss';

import { useModal, MODAL_NAMES } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';

export default function WithinEvent({
    eventData,
    eventHeight,
    layer,
}: {
    eventData: FullSchedule;
    eventHeight: number;
    layer: number;
}) {
    const { openModal } = useModal();
    const colorLayer = () => {
        if (layer) {
            switch (layer % 3) {
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
        <div
            className={`${styles.event} ${colorLayer()}`}
            style={{
                height: `${eventHeight}px`,
                top: `${layer ? layer * (eventHeight + 6) : 0}px`,
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
