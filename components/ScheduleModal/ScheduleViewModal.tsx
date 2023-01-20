import axios from 'axios';
import React, { useMemo } from 'react';

import styles from './ScheduleViewModal.module.scss';

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
import AccountDefaultIcon from '@images/account_default_icon.svg';
import CloseIcon from '@images/close_icon.svg';
import DeleteIcon from '@images/delete_icon.svg';
import EditIcon from '@images/edit_icon.svg';
import LockIcon from '@images/lock_icon.svg';
import PeopleIcon from '@images/people_icon.svg';
import TextIcon from '@images/text_icon.svg';
import { errorToast, successToast, warningModal } from '@utils/customAlert';
import { formatDayToKr } from '@utils/formatDay';
import { formatTime } from '@utils/formatTime';

function ParticipantItem({ participant }: { participant: Participant }) {
    return (
        <li className={styles.participant}>
            <AccountDefaultIcon className="icon" height="24px" />
            <div>
                <span>{participant.username}</span>
                <span className={styles.email}>{participant.email}</span>
            </div>
        </li>
    );
}

interface ScheduleModalProps {
    schedule: FullSchedule;
}

// when you open this modal using `openModal`, you have to pass `schedule` property
// e.g. openModal(MODAL_NAMES.scheduleView, {schedule})
// for detailed example, see line 140 of `ScheduleEditorModal.tsx`
export default function ScheduleViewModal({ schedule }: ScheduleModalProps) {
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

    const onClickEdit = () => {
        openModal(MODAL_NAMES.scheduleEditor, {
            initSchedule,
            taskType: 'edit',
        });
    };

    const onClickDelete = async () => {
        const { isConfirmed } = await warningModal({
            title: '일정을 삭제하시겠습니까?',
            text: '삭제된 일정은 복원할 수 없습니다.',
            confirmButtonText: '삭제',
        });

        if (!isConfirmed) return;

        const isDeleted = await deleteSchedule(schedule.id, accessToken);
        if (isDeleted) closeModal(MODAL_NAMES.scheduleView);
    };

    const mergeScheduleEndDateTime = (startDate: Date, endDate: Date) => {
        if (startDate.toString() === endDate.toString()) return '';

        let result = '';
        let different = false;

        if (startDate.getFullYear() !== endDate.getFullYear()) {
            result += `${endDate.getFullYear()}년`;
            different = true;
        }
        if (different || startDate.getMonth() + 1 !== endDate.getMonth() + 1) {
            result += `${different ? ' ' : ''}${endDate.getMonth() + 1}월`;
            different = true;
        }
        if (different || startDate.getDate() !== endDate.getDate()) {
            result += `${
                different ? ' ' : ''
            }${endDate.getDate()}일(${formatDayToKr(endDate.getDay())})`;
            different = true;
        }

        result += (different ? ' ' : '') + formatTime(endDate);

        return result;
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.scheduleView}>
            <div className={styles.scheduleViewModal}>
                <div className={styles.header}>
                    {user?.pk === schedule.created_by && (
                        <>
                            <button
                                className={styles.edit}
                                onClick={onClickEdit}
                            >
                                <EditIcon className="icon" height="18px" />
                            </button>
                            <button
                                className={styles.delete}
                                onClick={onClickDelete}
                            >
                                <DeleteIcon className="icon" height="18px" />
                            </button>
                        </>
                    )}
                    <button
                        className={styles.close}
                        onClick={() => closeModal(MODAL_NAMES.scheduleView)}
                    >
                        <CloseIcon className="icon" height="18px" />
                    </button>
                </div>
                <div className={styles.body}>
                    <h2 className={styles.title}>
                        <div
                            className={styles.color}
                            style={{ backgroundColor: 'burlywood' }}
                        />
                        {user?.pk !== schedule.created_by &&
                        !schedule.show_content
                            ? '바쁨'
                            : schedule.title}
                    </h2>
                    <div className={styles.date}>
                        <span>
                            {startDate.getFullYear()}년{' '}
                            {startDate.getMonth() + 1}월 {startDate.getDate()}
                            일({formatDayToKr(startDate.getDay())}){' '}
                            {formatTime(startDate)}
                        </span>
                        {startDate.toString() !== endDate.toString() && (
                            <span className={styles.dash}>-</span>
                        )}
                        <span>
                            {mergeScheduleEndDateTime(startDate, endDate)}
                        </span>
                    </div>
                    {user?.pk !== schedule.created_by &&
                    !schedule.show_content ? (
                        <></>
                    ) : (
                        <>
                            {schedule.participants?.length ? (
                                <div className={styles.participants}>
                                    <div className={styles.icon}>
                                        <PeopleIcon
                                            className="icon"
                                            height="24px"
                                        />
                                    </div>
                                    <ul>
                                        {schedule.participants.map((p, i) => (
                                            <ParticipantItem
                                                participant={p}
                                                key={i}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                            {schedule.description && (
                                <div className={styles.description}>
                                    <div className={styles.icon}>
                                        <TextIcon
                                            className="icon"
                                            height="24px"
                                        />
                                    </div>
                                    <p>{schedule.description}</p>
                                </div>
                            )}
                            {user?.pk === schedule.created_by && (
                                <div className={styles.protectionLevel}>
                                    <div className={styles.icon}>
                                        <LockIcon
                                            className="icon"
                                            height="24px"
                                        />
                                    </div>
                                    <div>
                                        {
                                            ProtectionLevelText[
                                                schedule.protection_level
                                            ]
                                        }
                                        {schedule.show_content || (
                                            <span
                                                className={styles.hideDetails}
                                            >
                                                (세부사항 비공개)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ModalFrame>
    );
}
