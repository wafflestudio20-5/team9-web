import React from 'react';

import styles from './FillerEvent.module.scss';

export default function FillerEvent({ eventHeight }: { eventHeight: number }) {
    return <div className={styles.filler} style={{ height: eventHeight }} />;
}
