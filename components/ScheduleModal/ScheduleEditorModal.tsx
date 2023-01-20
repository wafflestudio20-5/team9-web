import axios from 'axios';
import React, { useState, useMemo, useEffect, useRef } from 'react';

import styles from './ScheduleEditorModal.module.scss';

import {
    CalendarURLParams,
    createScheduleAPI,
    editScheduleAPI,
} from '@apis/calendar';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import ProtectionLevelDropDown from '@components/ScheduleModal/ProtectionLevelDropDown';
import RecurrenceDropDown from '@components/ScheduleModal/RecurrenceDropDown';
import TimeDropDown from '@components/ScheduleModal/TimeDropDown';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import {
    ProtectionLevel,
    Schedule,
    Participant,
    RecurType,
    Recurrence,
} from '@customTypes/ScheduleTypes';
import CloseIcon from '@images/close_icon.svg';
import LockIcon from '@images/lock_icon.svg';
import PeopleIcon from '@images/people_icon.svg';
import TextIcon from '@images/text_icon.svg';
import TimeIcon from '@images/time_icon.svg';
import { errorToast, successToast, warningModal } from '@utils/customAlert';
import { formatFullDate } from '@utils/formatDate';

function ErrorMessage({ message }: { message: string }) {
    return <span className={styles.errorMessage}>{message}</span>;
}

interface ScheduleEditorModalProps {
    initSchedule: Schedule;
    taskType: 'create' | 'edit';
}

export default function ScheduleEditorModal({
    initSchedule,
    taskType,
}: ScheduleEditorModalProps) {
    const { openModal, closeModal } = useModal();
    const { user, accessToken } = useSessionContext();
    const titleRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(initSchedule.title);
    const [startDate, setStartDate] = useState<Date>(
        new Date(initSchedule.start_at),
    );
    const [endDate, setEndDate] = useState<Date>(new Date(initSchedule.end_at));
    const [recurrence, setRecurrence] = useState<Recurrence>({
        isRecurrent: false,
        cronjob: '',
        endDate: '',
        type: RecurType.none,
        content: '반복 안 함',
    });
    const [protectionLevel, setProtectionLevel] = useState<ProtectionLevel>(
        initSchedule.protection_level,
    );
    const [hideDetails, setHideDetails] = useState<boolean>(
        !initSchedule.show_content,
    );
    const [description, setDescription] = useState<string>(
        initSchedule.description ?? '',
    );
    const [participants, setParticipants] = useState<{ pk: number }[]>(
        initSchedule.participants ?? [],
    );
    const [dateValidity, setDateValidity] = useState({
        isValid: true,
        message: '',
    });
    const isHideDisabled = useMemo(
        () => protectionLevel === ProtectionLevel.private,
        [protectionLevel],
    );

    const validateDate = (isValid: boolean, msg: string) => {
        if (isValid) {
            setDateValidity({ isValid: true, message: '' });
            return true;
        } else {
            setDateValidity({ isValid: false, message: msg });
            return false;
        }
    };

    const changeStartDate = (newDate: Date) => {
        const msg = '시작 일시는 종료 일시 이전이어야 합니다.';
        validateDate(newDate <= endDate, msg);
        setStartDate(newDate);
    };

    const changeEndDate = (newDate: Date) => {
        const msg = '종료 일시는 시작 일시 이후여야 합니다.';
        validateDate(newDate >= startDate, msg);
        setEndDate(newDate);
    };

    const updateParticipants = (participants: Participant[]) => {
        const pkList: { pk: number }[] = [];
        participants.forEach(p => pkList.push({ pk: p.pk }));
        setParticipants(pkList);
    };

    const createSchedule = async (
        newSchedule: Schedule,
        accessToken: string | null,
    ) => {
        if (!user) return false;

        const urlParams: CalendarURLParams = {
            pk: user.pk,
            from: formatFullDate(startDate),
            to: formatFullDate(endDate),
        };

        try {
            await createScheduleAPI(newSchedule, urlParams, accessToken);
            successToast('일정이 추가되었습니다.');
            return true;
        } catch (error) {
            const message = '일정을 생성하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message ?? message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const editSchdule = async (
        scheduleId: number,
        newSchedule: Schedule,
        accessToken: string | null,
    ) => {
        try {
            const res = await editScheduleAPI(
                scheduleId,
                newSchedule,
                accessToken,
            );
            successToast('일정이 수정되었습니다.');
            openModal(MODAL_NAMES.scheduleView, { schedule: res.data });
            return true;
        } catch (error) {
            const message = '일정을 수정하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message ?? message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const validateScheduleForm = () => {
        if (!title) {
            errorToast('제목을 적어주세요.');
            titleRef.current?.focus();
            return false;
        } else if (!dateValidity.isValid) {
            errorToast(dateValidity.message);
            return false;
        }
        return true;
    };

    const submitScheduleForm = async () => {
        const isValid = validateScheduleForm();
        if (!isValid) return;

        const newSchedule: Schedule = {
            title: title,
            start_at: formatFullDate(startDate, true),
            end_at: formatFullDate(endDate, true),
            description: description,
            protection_level: protectionLevel,
            show_content: !hideDetails,
            participants: participants,
        };

        let isSuccessful = false;
        switch (taskType) {
            case 'create':
                isSuccessful = await createSchedule(newSchedule, accessToken);
                break;
            case 'edit':
                isSuccessful = initSchedule?.id
                    ? await editSchdule(
                          initSchedule.id,
                          newSchedule,
                          accessToken,
                      )
                    : false;
                break;
        }

        if (isSuccessful) closeModal(MODAL_NAMES.scheduleEditor);
    };

    const detectChange = () => {
        return (
            title !== initSchedule.title ||
            startDate.toString() !==
                new Date(initSchedule.start_at).toString() ||
            endDate.toString() !== new Date(initSchedule.end_at).toString() ||
            description !== initSchedule.description ||
            protectionLevel !== initSchedule.protection_level ||
            hideDetails !== !initSchedule.show_content ||
            JSON.stringify(participants) !==
                JSON.stringify(initSchedule.participants)
        );
    };

    const cancelScheduleForm = () => {
        const isChanged = detectChange();
        if (isChanged) {
            const warningContent = {
                title: '작성 중인 일정을 삭제하시겠습니까?',
                text: '변경사항이 저장되지 않았습니다.',
                confirmButtonText: '삭제',
            };
            warningModal(warningContent).then(result => {
                if (result.isConfirmed) {
                    closeModal(MODAL_NAMES.scheduleEditor);
                }
            });
        } else {
            closeModal(MODAL_NAMES.scheduleEditor);
        }
    };

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    return (
        <ModalFrame
            modalName={MODAL_NAMES.scheduleEditor}
            onClickBackDrop={cancelScheduleForm}
        >
            <div className={styles.scheduleEditorModal}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={cancelScheduleForm}
                    >
                        <CloseIcon height="18px" />
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.scheduleForm}>
                        <div className={styles.title}>
                            <input
                                type="text"
                                value={title}
                                id="title"
                                onChange={e => setTitle(e.target.value)}
                                placeholder="제목 추가"
                                ref={titleRef}
                            />
                            <span className={styles.underline} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.dateTime}>
                                <label>
                                    <TimeIcon className="icon" height="24px" />
                                </label>
                                <div>
                                    <div className={styles.dateTimeContent}>
                                        <div
                                            className={
                                                styles.timeInputContainer
                                            }
                                        >
                                            <MiniCalendarDropDown
                                                title="시작 날짜"
                                                date={startDate}
                                                changeDate={changeStartDate}
                                            />
                                            <TimeDropDown
                                                title="시작 시간"
                                                time={startDate}
                                                changeTime={changeStartDate}
                                            />
                                            <span className={styles.dash}>
                                                -
                                            </span>
                                            <MiniCalendarDropDown
                                                title="종료 날짜"
                                                date={endDate}
                                                changeDate={changeEndDate}
                                            />
                                            <TimeDropDown
                                                title="시작 시간"
                                                time={endDate}
                                                changeTime={changeEndDate}
                                            />
                                        </div>
                                        {!dateValidity.isValid && (
                                            <ErrorMessage
                                                message={dateValidity.message}
                                            />
                                        )}
                                    </div>
                                    <RecurrenceDropDown
                                        date={startDate}
                                        recurrence={recurrence}
                                        setRecurrence={setRecurrence}
                                    />
                                </div>
                            </div>
                            <div className={styles.participants}>
                                <label>
                                    <PeopleIcon
                                        className="icon"
                                        height="24px"
                                    />
                                </label>
                                <UserSearchDropDown
                                    toExecute={item => null}
                                    interceptResult={updateParticipants}
                                    buttonText="추가"
                                    width="400px"
                                    submitButtonNotRequired={true}
                                    placeholder="참가자 추가"
                                />
                            </div>
                            <div className={styles.public}>
                                <label>
                                    <LockIcon className="icon" height="24px" />
                                </label>
                                <div>
                                    <ProtectionLevelDropDown
                                        protectionLevel={protectionLevel}
                                        setProtectionLevel={setProtectionLevel}
                                    />
                                    <div className={styles.hideDetails}>
                                        <input
                                            type="checkbox"
                                            id="hideDetails"
                                            checked={
                                                hideDetails || isHideDisabled
                                            }
                                            onChange={() =>
                                                setHideDetails(!hideDetails)
                                            }
                                            disabled={isHideDisabled}
                                        />
                                        <label htmlFor="hideDetails">
                                            세부 일정 비공개
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.description}>
                                <label>
                                    <TextIcon className="icon" height="24px" />
                                </label>
                                <textarea
                                    cols={57}
                                    rows={5}
                                    value={description}
                                    onChange={e =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="일정에 대한 설명을 간략히 적어주세요."
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button
                            className={styles.save}
                            onClick={submitScheduleForm}
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
