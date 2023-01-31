import React from 'react';

import styles from './AcrossEvent.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { useCalendarContext } from '@contexts/CalendarContext';
import { useBoxSizeContext } from '../../contexts/BoxSizeContext';
import { formatDatestringToDate } from '@utils/formatting';

export default function AcrossEvent({
    eventData,
    layer,
    dateString,
    eventHeight,
}: {
    eventData: FullSchedule;
    layer: number;
    dateString: string;
    eventHeight: number;
}) {
    const { openModal } = useModal();
    const { setNeedUpdate } = useCalendarContext();
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
        Number(eventData.end_at.split(' ')[0].split('-')[2]) -
        Number(dateString.split('-')[2]) +
        1;
    const daysLeftThisWeek = 7 - formatDatestringToDate(dateString).getDay();
    const numberOfBlocks = Math.min(eventLengthRemaining, daysLeftThisWeek);
    const eventWidth = numberOfBlocks * (boxWidth + 12) - 12;
    const getPathString = () => {
        const upper =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt: number = i * (boxWidth + 12);
                          return `L ${startAt + 3} 3 L ${
                              startAt + boxWidth - 3
                          } 3 L ${startAt + boxWidth} 0 L ${
                              startAt + 12 + boxWidth
                          } 0`;
                      })
                      .join(' ')
                : '';
        const lower =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt = eventWidth - i * (boxWidth + 12);
                          return `L ${startAt - 3} ${3 + eventHeight} L ${
                              startAt + 3 - boxWidth
                          } ${3 + eventHeight} L ${
                              startAt - boxWidth
                          } ${eventHeight} L ${
                              startAt - 12 - boxWidth
                          } ${eventHeight}`;
                      })
                      .join(' ')
                : '';
        const pathString = `M 0 3 ${upper} L ${
            eventWidth - boxWidth + 3
        } 3 L ${eventWidth} 3 L ${eventWidth} ${3 + eventHeight} ${lower} L ${
            boxWidth - 3
        } ${eventHeight + 3} L 0 ${eventHeight + 3} L 0 3 Z`;
        return pathString;
    };
    return (
        <div
            className={`${styles.across} ${colorLayer()}`}
            style={{
                width: `${eventWidth}px`,
                height: `${eventHeight + 3}px`,
                top: `${layer ? (eventHeight + 3) * layer : 0}px`,
            }}
            onClick={() => {
                openModal(MODAL_NAMES.scheduleView, {
                    schedule: eventData,
                });
            }}
        >
            {boxWidth && (
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
