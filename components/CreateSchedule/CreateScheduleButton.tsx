import React from 'react';

import styles from './CreateScheduleButton.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import AddIcon from '@images/add_icon.svg';

export default function CreateScheduleButton() {
    const { openModal } = useModal();

    return (
        <div
            className={styles.createScheduleButton}
            onClick={() => openModal(MODAL_NAMES.createSchedule)}
        >
            <AddIcon className="icon" width="40px" />
        </div>
    );
}
