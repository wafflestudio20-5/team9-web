import axios from 'axios';
import Image from 'next/image';
import React, { useMemo } from 'react';

import styles from './ScheduleModal.module.scss';

import { deleteScheduleAPI } from '@apis/calendar';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import {
    FullSchedule,
    Participant,
    ProtectionLevelText,
    Schedule,
} from '@customTypes/ScheduleTypes';
import close_icon from '@images/close_icon.svg';
import delete_icon from '@images/delete_icon.svg';
import edit_icon from '@images/edit_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import { errorToast, successToast, warningModal } from '@utils/customAlert';
import { formatTime } from '@utils/formatTime';

interface ScheduleModalProps {
    schedule: FullSchedule;
}

export default function ScheduleModal({ schedule }: ScheduleModalProps) {
    const { openModal, closeModal } = useModal();
    const { user, accessToken } = useSessionContext();
    const startDate = useMemo(() => new Date(schedule.start_at), [schedule]);
    const endDate = useMemo(() => new Date(schedule.end_at), [schedule]);

    const getParticipantPks = (participants?: Participant[]) => {
        if (!participants) return [];
        const pkList: { pk: number }[] = [];
        participants.forEach(p => pkList.push({ pk: p.pk }));
        return pkList;
    };

    const initSchedule: Schedule = {
        id: schedule.id,
        title: schedule.title,
        start_at: schedule.start_at,
        end_at: schedule.end_at,
        protection_level: schedule.protection_level,
        show_content: schedule.show_content,
        description: schedule.description,
        participants: getParticipantPks(schedule.participants),
    };

    const deleteSchedule = async (
        scheduleId: number,
        accessToken: string | null,
    ) => {
        try {
            await deleteScheduleAPI(scheduleId, accessToken);
            successToast('일정을 삭제했습니다.');
            return true;
        } catch (error) {
            const message = '일정을 삭제하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message ?? message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const onClickDelete = async () => {
        const { isConfirmed } = await warningModal({
            title: '일정을 삭제하시겠습니까?',
            text: '삭제된 일정은 복원할 수 없습니다.',
            confirmButtonText: '삭제',
        });

        if (!isConfirmed) return;

        const isDeleted = await deleteSchedule(schedule.id, accessToken);
        if (isDeleted) closeModal(MODAL_NAMES.schedule);
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.schedule}>
            <div className={styles.scheduleModal}>
                <div className={styles.header}>
                    {user?.pk === schedule.created_by && (
                        <>
                            <button
                                className={styles.edit}
                                onClick={() =>
                                    openModal(MODAL_NAMES.scheduleEditor, {
                                        initSchedule,
                                        taskType: 'edit',
                                    })
                                }
                            >
                                <Image
                                    src={edit_icon}
                                    width={18}
                                    alt="edit_schedule"
                                />
                            </button>
                            <button
                                className={styles.delete}
                                onClick={onClickDelete}
                            >
                                <Image
                                    src={delete_icon}
                                    width={18}
                                    alt="delete_schedule"
                                />
                            </button>
                        </>
                    )}
                    <button
                        className={styles.close}
                        onClick={() => closeModal(MODAL_NAMES.schedule)}
                    >
                        <Image
                            src={close_icon}
                            width={18}
                            alt="close_schedule_modal"
                        />
                    </button>
                </div>
                <div className={styles.body}>
                    <h2 className={styles.title}>
                        <div
                            className={styles.color}
                            style={{ backgroundColor: 'burlywood' }}
                        />
                        {schedule.title}
                    </h2>
                    <div className={styles.date}>
                        <span>
                            {startDate.getFullYear()}년{' '}
                            {startDate.getMonth() + 1}월 {startDate.getDate()}일
                        </span>
                        <span>{formatTime(startDate)}</span>
                        <span className={styles.dash}>-</span>
                        <span>
                            {endDate.getFullYear()}년 {endDate.getMonth() + 1}월{' '}
                            {endDate.getDate()}일
                        </span>
                        <span>{formatTime(endDate)}</span>
                    </div>
                    {schedule.participants?.length ? (
                        <div className={styles.participants}>
                            <div className={styles.icon}>
                                <Image
                                    src={people_icon}
                                    width={24}
                                    alt="participants"
                                />
                            </div>
                            <div>asdf</div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {schedule.description && (
                        <div className={styles.description}>
                            <div className={styles.icon}>
                                <Image
                                    src={text_icon}
                                    width={24}
                                    alt="description"
                                />
                            </div>
                            <p>{schedule.description}</p>
                        </div>
                    )}
                    <div className={styles.protectionLevel}>
                        <div className={styles.icon}>
                            <Image
                                src={lock_icon}
                                width={24}
                                alt="protection_level"
                            />
                        </div>
                        <div>
                            {ProtectionLevelText[schedule.protection_level]}
                            {schedule.show_content || (
                                <span className={styles.hideDetails}>
                                    (세부사항 비공개)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
