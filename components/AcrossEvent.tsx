import React from 'react';

import styles from './AcrossEvent.module.scss';

import { FullSchedule } from '@customTypes/ScheduleTypes';

export default function AcrossEvent({
    eventData,
    day,
    dayWidth,
    eventHeight,
}: {
    eventData: FullSchedule;
    day: number;
    dayWidth: number;
    eventHeight: number;
}) {
    console.log(dayWidth);
    const colorLayer = () => {
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
    const eventLength =
        Number(eventData.end_at.split(' ')[0].split('-')[2]) -
        Number(eventData.start_at.split(' ')[0].split('-')[2]);
    const daysLeftThisWeek = 7 - day;
    const numberOfBlocks = Math.min(eventLength, daysLeftThisWeek);
    const totalLength = numberOfBlocks * (dayWidth + 12) - 12;
    const getPathString = () => {
        const upper =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt: number = i * (dayWidth + 12);
                          return `L ${startAt + 3} 3 L ${
                              startAt + dayWidth - 3
                          } 3 L ${startAt + dayWidth} 0 L ${
                              startAt + 12 + dayWidth
                          } 0`;
                      })
                      .join(' ')
                : '';
        const lower =
            numberOfBlocks > 1
                ? Array(numberOfBlocks - 1)
                      .fill(0)
                      .map((v, i) => {
                          const startAt = totalLength - i * (dayWidth + 12);
                          return `L ${startAt - 3} ${3 + eventHeight} L ${
                              startAt + 3 - dayWidth
                          } ${3 + eventHeight} L ${
                              startAt - dayWidth
                          } ${eventHeight} L ${
                              startAt - 12 - dayWidth
                          } ${eventHeight}`;
                      })
                      .join(' ')
                : '';
        const pathString = `M 0 3 ${upper} L ${
            totalLength - dayWidth + 3
        } 3 L ${totalLength} 3 L ${totalLength} ${3 + eventHeight} ${lower} L ${
            dayWidth - 3
        } ${eventHeight + 3} L 0 ${eventHeight + 3} L 0 3 Z`;
        return pathString;
    };
    return (
        // <div
        //     className={styles.button}
        //     style={{
        //         top: `${
        //             eventData.layer ? (eventHeight + 3) * eventData.layer : 0
        //         }px`,
        //     }}
        // >
        <div
            className={`${styles.across} ${colorLayer()}`}
            style={{
                width: `${totalLength}px`,
                height: `${eventHeight + 3}px`,
                top: `${
                    eventData.layer ? (eventHeight + 3) * eventData.layer : 0
                }px`,
            }}
        >
            {dayWidth && (
                <svg
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox={`0 0 ${totalLength} ${eventHeight + 3}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d={getPathString()} />
                </svg>
            )}
            <span className={styles.title}></span>
        </div>
        // <span className={styles.title}></span>
        // </div>

        // <div
        //     className={`${styles.across} ${colorLayer()}`}
        //     style={{
        //         width: `${totalLength}px`,
        //         height: `${3 + eventHeight}px`,
        //         clipPath: `path(${getPathString()})`,
        //     }}
        // >
        //
        // </div>
    );
}
