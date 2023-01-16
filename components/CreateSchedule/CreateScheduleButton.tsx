import Image from 'next/image';
import React from 'react';

import styles from './CreateScheduleButton.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import add_icon from '@images/add_icon.svg';

interface CreateScheduleButtonProps {
    text?: string;
    style?: React.CSSProperties;
}

export default function CreateScheduleButton({
    text,
    style,
}: CreateScheduleButtonProps) {
    const { openModal } = useModal();

    return (
        <div
            className={styles.createScheduleButton}
            onClick={() =>
                openModal(MODAL_NAMES.schedule, {
                    taskType: 'create',
                })
            }
            style={style}
        >
            <Image src={add_icon} alt="create_schedule" width={40} />
            {text && <span>{text}</span>}
        </div>
    );
}
