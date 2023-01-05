import React from 'react';

import styles from './CalendarModal.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES } from '@contexts/ModalContext';


export default function CalendarModal() {
    return (
        <ModalFrame modalName={MODAL_NAMES.calendar}>
            <div className={styles.calendarModal}>
                <MiniCalendar />
            </div>
        </ModalFrame>
    );
}
