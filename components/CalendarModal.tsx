import React from 'react';

import styles from './CalendarModal.module.scss';
import { MODAL_NAMES } from './ModalContainer';
import ModalFrame from './ModalFrame';

export default function CalendarModal() {
    return (
        <>
            <ModalFrame modalName={MODAL_NAMES.calendar}>
                <div className={styles.calendarModal}>calendar component</div>
            </ModalFrame>
        </>
    );
}
