import React from 'react';

import styles from './AcrossEvent.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { useBoxSizeContext } from '../../contexts/BoxSizeContext';

export default function AcrossEvent({
    eventData,
    layer,
    dateString,
    eventHeight,
    borderWidth,
    slopeWidth,
    slopeHeight,
}: {
    eventData: FullSchedule;
    layer: number;
    dateString: string;
    eventHeight: number;
    borderWidth?: number;
    slopeWidth?: number;
    slopeHeight?: number;
}) {
    const dateObj = new Date(dateString);
    const endDateObj = new Date(eventData.end_at.split(' ')[0]);
    const bw = borderWidth ? borderWidth : 12;
    const sw = slopeWidth ? slopeWidth : 6;
    const sh = slopeHeight ? slopeHeight : 3;
    const { openModal } = useModal();
    const { boxWidth } = useBoxSizeContext();
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
    const eventLengthRemaining =
        Math.floor(
            Math.abs(endDateObj.getTime() - dateObj.getTime()) /
                (1000 * 60 * 60 * 24),
        ) + 1;
    const daysLeftThisWeek = 7 - dateObj.getDay();
    const numberOfBlocks = Math.min(eventLengthRemaining, daysLeftThisWeek);
    const eventWidth = numberOfBlocks * (boxWidth + 12) - 12;
    const getPathString = () => {
        const upper =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt: number = i * (boxWidth + bw);
                          return `L ${startAt + sw} ${sh} L ${
                              startAt + boxWidth - sw
                          } ${sh} L ${startAt + boxWidth} 0 L ${
                              startAt + bw + boxWidth
                          } 0`;
                      })
                      .join(' ')
                : '';
        const lower =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt = eventWidth - i * (boxWidth + bw);
                          return `L ${startAt - sw} ${sh + eventHeight} L ${
                              startAt + sw - boxWidth
                          } ${sh + eventHeight} L ${
                              startAt - boxWidth
                          } ${eventHeight} L ${
                              startAt - bw - boxWidth
                          } ${eventHeight}`;
                      })
                      .join(' ')
                : '';
        const pathString = `M 0 ${sh} ${upper} L ${
            eventWidth - boxWidth + sw
        } ${sh} L ${eventWidth} ${sh} L ${eventWidth} ${
            sh + eventHeight
        } ${lower} L ${boxWidth - sw} ${eventHeight + sh} L 0 ${
            eventHeight + sh
        } L 0 ${sh} Z`;
        return pathString;
    };
    return (
        <div
            className={`${styles.across} ${colorLayer()}`}
            style={{
                width: `${eventWidth}px`,
                height: `${eventHeight + 3}px`,
            }}
            onClick={() => {
                openModal(MODAL_NAMES.scheduleView, {
                    schedule: eventData,
                });
            }}
        >
            {eventWidth && (
                <svg
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox={`0 0 ${eventWidth} ${eventHeight + 3}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d={getPathString()} />
                </svg>
            )}
            <span className={styles.title}>{eventData.title}</span>
        </div>
    );
}
