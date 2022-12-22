import React from 'react';

import styles from './CalendarModal.module.scss';
import ModalFrame from './ModalFrame';

export default function CalendarModal() {
    return (
        <>
            <ModalFrame>
                <div className={styles.calendarModal}>calendar component</div>
            </ModalFrame>
        </>
    );
}
