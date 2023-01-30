import React, { Dispatch, SetStateAction } from 'react';

import styles from './CreateScheduleButton.module.scss';

import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { ProtectionLevel, Schedule } from '@customTypes/ScheduleTypes';
import AddScheduleIcon from '@images/add_schedule_icon.svg';

interface CreateScheduleButtonProps {
    text?: string;
    style?: React.CSSProperties;
    setNeedUpdate?: Dispatch<SetStateAction<boolean>>;
}

export default function CreateScheduleButton({
    text,
    style,
    setNeedUpdate,
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
        is_recurring: false,
        cron_expr: null,
        recurring_end_at: null,
    };

    return (
        <div
            className={`${styles.createScheduleButton} ${
                text && styles.withText
            }`}
            onClick={() =>
                openModal(MODAL_NAMES.scheduleEditor, {
                    taskType: 'create',
                    initSchedule,
                })
            }
            style={style}
        >
            <div className={styles.iconWrapper}>
                <AddScheduleIcon
                    className="icon"
                    height={text ? '40px' : '50px'}
                    viewBox="46 46 469 469"
                />
            </div>
            {text && <span>{text}</span>}
        </div>
    );
}
