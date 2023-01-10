import Image from 'next/image';
import React from 'react';

import styles from './CreateScheduleButton.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import add_icon from '@images/add_icon.svg';

export default function CreateScheduleButton() {
    const { openModal } = useModal();

    return (
        <div
            className={styles.createScheduleButton}
            onClick={() => openModal(MODAL_NAMES.createSchedule)}
        >
            <Image src={add_icon} alt="create_schedule" width={40} />
        </div>
    );
}
