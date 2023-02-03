import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

import styles from './CreateScheduleButton.module.scss';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useScheduleContext } from '@contexts/ScheduleContext';
import { ProtectionLevel, Schedule } from '@customTypes/ScheduleTypes';
import AddScheduleIcon from '@images/add_schedule_icon.svg';
import { errorToast } from '@utils/customAlert';

interface CreateScheduleButtonProps {
    text?: string;
    style?: React.CSSProperties;
}

export default function CreateScheduleButton({
    text,
    style,
}: CreateScheduleButtonProps) {
    const { openModal } = useModal();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { schedules, setIsSelectMode } = useScheduleContext(); // need to be changed
    const router = useRouter();

    const initSchedule: Schedule = {
        title: '',
        start_at: `${yearNow}-${monthNow}-${dateNow}`,
        end_at: `${yearNow}-${monthNow}-${dateNow}`,
        protection_level: ProtectionLevel.public,
        show_content: true,
        description: '',
        participants: [],
        is_recurring: false,
        cron_expr: null,
        recurring_end_at: null,
    };

    const onClickOption = (option: 'add' | 'select' | 'write') => {
        switch (option) {
            case 'add':
                openModal(MODAL_NAMES.scheduleEditor, {
                    taskType: 'create',
                    initSchedule,
                });
                break;
            case 'select':
                setIsSelectMode(true);
                break;
            case 'write':
                if (schedules.length > 1) router.push('/blog/post/create');
                else errorToast('포스팅할 일정을 선택해주세요.'); // if there's no schedules selected
                break;
        }
        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button
                    className={`${styles.createScheduleButton} ${
                        text && styles.withText
                    }`}
                    style={style}
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <div className={styles.iconWrapper}>
                        <AddScheduleIcon
                            className="icon"
                            height={text ? '35px' : '50px'}
                            viewBox="46 46 469 469"
                        />
                    </div>
                    {text && <span>{text}</span>}
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ top: '75px', left: '32px' }}>
                <ul>
                    <li onClick={() => onClickOption('add')}>새 일정 추가</li>
                    <li onClick={() => onClickOption('select')}>일정 선택</li>
                    <li onClick={() => onClickOption('write')}>포스트 작성</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
