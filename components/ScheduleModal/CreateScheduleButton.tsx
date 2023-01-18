import Image from 'next/image';
import React from 'react';

import styles from './CreateScheduleButton.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { ProtectionLevel, Schedule } from '@customTypes/ScheduleTypes';
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
    const { yearNow, monthNow, dateNow } = useDateContext();

    const initSchedule: Schedule = {
        title: '',
        start_at: `${yearNow}-${monthNow}-${dateNow}`,
        end_at: `${yearNow}-${monthNow}-${dateNow}`,
        protection_level: ProtectionLevel.pulbic,
        show_content: true,
        description: '',
        participants: [],
    };

    return (
        <div
            className={styles.createScheduleButton}
            onClick={() =>
                openModal(MODAL_NAMES.scheduleEditor, {
                    taskType: 'create',
                    initSchedule,
                })
            }
            style={style}
        >
            <Image src={add_icon} alt="create_schedule" width={40} />
            {text && <span>{text}</span>}
        </div>
    );
}