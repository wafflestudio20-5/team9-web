import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

import styles from './ScheduleViewModal.module.scss';

import { deleteRecurringScheduleAPI, deleteScheduleAPI } from '@apis/calendar';
import ModalFrame from '@components/ModalFrame';
import ScheduleContent from '@components/ScheduleContent';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import {
    FullSchedule,
    Participant,
    Schedule,
} from '@customTypes/ScheduleTypes';
import CloseIcon from '@images/close_icon.svg';
import DeleteIcon from '@images/delete_icon.svg';
import EditIcon from '@images/edit_icon.svg';
import PostIcon from '@images/post_icon.svg';
import {
    errorToast,
    radioRecurringModal,
    successToast,
    warningModal,
} from '@utils/customAlert';

interface ScheduleModalProps {
    schedule: FullSchedule;
}

// when you open this modal using `openModal`, you have to pass `schedule` property
// e.g. openModal(MODAL_NAMES.scheduleView, {schedule})
// for detailed example, see line 140 of `ScheduleEditorModal.tsx`
export default function ScheduleViewModal({ schedule }: ScheduleModalProps) {
    const { openModal, closeModal } = useModal();
    const { user, accessToken } = useSessionContext();
    const router = useRouter();

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
        is_recurring: schedule.is_recurring,
        cron_expr: schedule.cron_expr,
        recurring_end_at: schedule.recurring_end_at,
        recurring_schedule_group: schedule.recurring_schedule_group,
    };

    const onClickEdit = () => {
        openModal(MODAL_NAMES.scheduleEditor, {
            initSchedule,
            taskType: 'edit',
        });
    };

    const deleteSchedule = async (
        id: number, // scheduleId or groupId
        accessToken: string | null,
        deleteRecurring: boolean,
    ) => {
        try {
            if (deleteRecurring) {
                await deleteRecurringScheduleAPI(id, accessToken);
            } else {
                await deleteScheduleAPI(id, accessToken);
            }
            successToast('일정을 삭제했습니다.');
            return true;
        } catch (error) {
            const message = '일정을 삭제하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const onClickDelete = async () => {
        if (schedule.is_recurring) {
            const { value, isConfirmed } = await radioRecurringModal('삭제');

            if (!isConfirmed) return;

            let isDeleted = false;
            if (value === 'only') {
                isDeleted = await deleteSchedule(
                    schedule.id,
                    accessToken,
                    false,
                );
            } else {
                isDeleted = await deleteSchedule(
                    schedule.recurring_schedule_group,
                    accessToken,
                    true,
                );
            }

            if (isDeleted) closeModal(MODAL_NAMES.scheduleView);
        } else {
            const { isConfirmed } = await warningModal({
                title: '일정을 삭제하시겠습니까?',
                text: '삭제된 일정은 복원할 수 없습니다.',
                confirmButtonText: '삭제',
            });

            if (!isConfirmed) return;

            const isDeleted = await deleteSchedule(
                schedule.id,
                accessToken,
                false,
            );
            if (isDeleted) closeModal(MODAL_NAMES.scheduleView);
        }
    };

    const closeScheduleView = () => {
        closeModal(MODAL_NAMES.scheduleView);
    };

    const goToBlog = () => {
        closeScheduleView();
        router.push(`/blog/schedule/${schedule.id}`);
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.scheduleView}>
            <div className={styles.scheduleViewModal}>
                <div className={styles.header}>
                    <button className={styles.blog} onClick={goToBlog}>
                        <PostIcon className="icon" heiehg="18px" />
                    </button>
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
                        onClick={closeScheduleView}
                    >
                        <CloseIcon className="icon" height="18px" />
                    </button>
                </div>
                <div className={styles.body}>
                    <ScheduleContent schedule={schedule} />
                </div>
            </div>
        </ModalFrame>
    );
}
