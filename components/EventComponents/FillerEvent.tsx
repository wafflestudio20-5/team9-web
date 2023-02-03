import React from 'react';

import styles from './FillerEvent.module.scss';

export default function FillerEvent({
    eventHeight,
    slopeHeight,
}: {
    eventHeight: number;
    slopeHeight?: number;
}) {
    const sh = slopeHeight ? slopeHeight : 3;
    return (
        <div
            className={styles.filler}
            style={{ height: `${eventHeight + sh}px` }}
        />
    );
}
