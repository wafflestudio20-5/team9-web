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
    const eventLength =
        Number(eventData.end_at.split(' ')[0].split('-')[2]) -
        Number(eventData.start_at.split(' ')[0].split('-')[2]);
    const daysLeftThisWeek = 7 - day;
    const numberOfBlocks = Math.min(eventLength, daysLeftThisWeek);
    const totalLength = numberOfBlocks * (dayWidth + 12) - 3;
    const getPathString = () => {
        const totalLength = numberOfBlocks * (dayWidth + 12) - 3;
        const upper = Array(numberOfBlocks - 2)
            .fill(0)
            .map(v => {
                const startAt = v * (dayWidth + 12) + 6;
                return `L ${startAt + 3} 3 L ${startAt + 3 + dayWidth} 3 L ${
                    startAt + 6 + dayWidth
                } 0 L ${startAt + 18 + dayWidth} 0`;
            })
            .join(' ');
        const lower = Array(numberOfBlocks - 2)
            .fill(0)
            .map(v => {
                const startAt = totalLength - v * (dayWidth + 12) - 6;
                return `L ${startAt - 3} ${3 + eventHeight} L ${
                    startAt - 3 - dayWidth
                } ${3 + eventHeight} L ${
                    startAt - 6 - dayWidth
                } ${eventHeight} L ${startAt - 18 - dayWidth} ${eventHeight}`;
            })
            .join(' ');
        const pathString = `M 6 3 ${upper} L ${
            totalLength - dayWidth
        } 3 L ${totalLength} 3 L ${totalLength} ${3 + eventHeight} ${lower} L ${
            dayWidth + 6
        } ${eventHeight} L 6 ${eventHeight + 3} L 6 3 Z`;
        return pathString;
    };
    return (
        <div
            className={`${styles.across} ${colorLayer()}`}
            style={{ width: `${totalLength}px`, height: `${eventHeight}px` }}
        >
            <svg
                viewBox={`0 0 ${totalLength} ${eventHeight + 3}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={getPathString()} />
            </svg>
        </div>
        // <div
        //     className={`${styles.across} ${colorLayer()}`}
        //     style={{
        //         width: `${totalLength}px`,
        //         height: `${3 + eventHeight}px`,
        //         clipPath: `path(${getPathString()})`,
        //     }}
        // >
        //     <span className={styles.title}></span>
        // </div>
    );
}
