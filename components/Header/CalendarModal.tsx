import React from 'react';

import { MODAL_NAMES } from '../../contexts/ModalContext';
import ModalFrame from '../ModalFrame';

import styles from './CalendarModal.module.scss';

export default function CalendarModal() {
    return (
        <ModalFrame modalName={MODAL_NAMES.calendar}>
            <div className={styles.calendarModal}>calendar component</div>
        </ModalFrame>
    );
}
