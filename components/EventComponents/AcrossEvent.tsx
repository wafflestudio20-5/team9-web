import React from 'react';

import styles from './AcrossEvent.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import getEventColorClass from './getEventColorClass';

export default function AcrossEvent({
    type,
    eventData,
    layer,
    dateString,
    eventHeight,
    borderWidthPercentage,
    slopeWidthPercentage,
    slopeHeight,
}: {
    type: 'left' | 'leftEnd' | 'middle' | 'right' | 'rightEnd' | 'closed';
    eventData: FullSchedule;
    layer: number;
    dateString: string;
    eventHeight: number;
    borderWidthPercentage?: number;
    slopeWidthPercentage?: number;
    slopeHeight?: number;
}) {
    const bw = borderWidthPercentage ? borderWidthPercentage : 8;
    const sw = slopeWidthPercentage ? slopeWidthPercentage : 4;
    const sh = slopeHeight ? slopeHeight : 3;
    const { openModal } = useModal();

    const getPathString = (type: string) => {
        switch (type) {
            case 'left':
                return `M ${bw * 0.5} ${sh} L ${100 - sw - bw * 0.5} ${sh} L ${
                    100 - bw * 0.5
                } 0 L 100 0 L 100 ${eventHeight} L ${
                    100 - bw * 0.5
                } ${eventHeight} L ${100 - bw * 0.5 - sw} ${
                    eventHeight + sh
                } L ${bw * 0.5} ${eventHeight + sh} L ${bw * 0.5} ${sh} Z`;
            case 'middle':
                return `M 0 0 L ${bw * 0.5} 0 L ${bw * 0.5 + sw} ${sh} L ${
                    100 - sw - bw * 0.5
                } ${sh} L ${100 - bw * 0.5} 0 L 100 0 L 100 ${eventHeight} L ${
                    100 - bw * 0.5
                } ${eventHeight} L ${100 - sw - bw * 0.5} ${
                    eventHeight + sh
                } L ${bw * 0.5 + sw} ${eventHeight + sh} L ${
                    bw * 0.5
                } ${eventHeight} L 0 ${eventHeight} L 0 0 Z`;
            case 'right':
                return `M 0 0 L ${bw * 0.5} 0 L ${bw * 0.5 + sw} ${sh} L ${
                    100 - bw * 0.5
                } ${sh} L${100 - bw * 0.5} ${eventHeight + sh} L ${
                    bw * 0.5 + sw
                } ${eventHeight + sh} L ${
                    bw * 0.5
                } ${eventHeight}  L 0 ${eventHeight} L 0 0 Z`;
            case 'leftEnd':
                return `M 0 ${sh} L ${100 - sw - bw * 0.5} ${sh} L ${
                    100 - bw * 0.5
                } 0 L 100 0 L 100 ${eventHeight} L ${
                    100 - bw * 0.5
                } ${eventHeight} L ${100 - bw * 0.5 - sw} ${
                    eventHeight + sh
                } L 0 ${eventHeight + sh} L 0 ${sh} Z`;
            case 'rightEnd':
                return `M 0 0 L ${bw * 0.5} 0 L ${
                    bw * 0.5 + sw
                } ${sh} L 100 ${sh} L 100 ${eventHeight + sh} L ${
                    bw * 0.5 + sw
                } ${eventHeight + sh} L ${
                    bw * 0.5
                } ${eventHeight}  L 0 ${eventHeight} L 0 0 Z`;

            case 'closed':
                return `M ${bw * 0.5} ${sh} L ${100 - bw * 0.5} ${sh} L ${
                    100 - bw * 0.5
                } ${eventHeight + sh} L ${bw * 0.5} ${eventHeight + sh} L ${
                    bw * 0.5
                } ${sh} Z`;
        }
    };
    return (
        <div
            className={`${styles.across} ${getEventColorClass(
                eventData.created_by,
            )} ${type} ${layer}`}
            onClick={() => {
                openModal(MODAL_NAMES.scheduleView, {
                    schedule: eventData,
                });
            }}
            style={{ width: '100%', height: `${eventHeight + sh}px` }}
        >
            {eventHeight && (
                <svg
                    fill="currentColor"
                    stroke="currentColor"
                    width="100%"
                    height={`${eventHeight + sh}px`}
                    viewBox={`0 0 100 ${eventHeight + sh}`}
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d={getPathString(type)} />
                </svg>
            )}
            {(type === 'left' || type === 'leftEnd') && (
                <span className={styles.title}>{eventData.title}</span>
            )}
        </div>
    );
}
