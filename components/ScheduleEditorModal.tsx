import axios from 'axios';
import Image from 'next/image';
import React, { useState, useMemo } from 'react';

import styles from './ScheduleEditorModal.module.scss';

import {
    CalendarURLParams,
    CalendarURLParamsEmail,
    createScheduleAPI,
    deleteScheduleAPI,
    editScheduleAPI,
    editScheduleAPIEmail,
    getEntireScheduleAPI,
    getEntireScheduleAPIEmail,
    getParticularScheduleAPI,
} from '@apis/calendar';
import ProtectionLevelDropDown from '@components/CreateSchedule/ProtectionLevelDropDown';
import TimeDropDown from '@components/CreateSchedule/TimeDropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import {
    ProtectionLevel,
    Schedule,
    FullSchedule,
} from '@customTypes/CalendarTypes';
import { UserDataForSearch } from '@customTypes/UserTypes';
import close_icon from '@images/close_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import time_icon from '@images/time_icon.svg';
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
    const [title, setTitle] = useState<string>(initSchedule.title);
    const [startDate, setStartDate] = useState<Date>(
        new Date(initSchedule.start_at),
    );
    const [endDate, setEndDate] = useState<Date>(new Date(initSchedule.end_at));
    const [protectionLevel, setProtectionLevel] = useState<ProtectionLevel>(
        initSchedule.protection_level || 1,
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
            setTimeout(() => {
                setDateValidity({ isValid: true, message: '' });
            }, 2000);
            return false;
        }
    };

    const changeStartDate = (newDate: Date) => {
        const msg = '시작 일시는 종료 일시 이전이어야 합니다.';
        const isValid = validateDate(newDate <= endDate, msg);
        if (isValid) setStartDate(newDate);
    };

    const changeEndDate = (newDate: Date) => {
        const msg = '종료 일시는 시작 일시 이후여야 합니다.';
        const isValid = validateDate(newDate >= startDate, msg);
        if (isValid) setEndDate(newDate);
    };

    const updateParticipants = (
        participant: UserDataForSearch,
        state: 'add' | 'remove',
    ) => {
        if (state === 'add') {
            const isDuplicate = participants.some(p => p.pk === participant.pk);
            if (!isDuplicate) participants.push({ pk: participant.pk });
        } else if (state === 'remove') {
            const filteredList = participants.filter(
                p => p.pk !== participant.pk,
            );
            setParticipants(filteredList);
        }
    };

    const detectChange = () => {
        if (
            title === initSchedule.title &&
            startDate === new Date(initSchedule.start_at) &&
            endDate === new Date(initSchedule.end_at) &&
            description === initSchedule.description &&
            protectionLevel === initSchedule.protection_level &&
            hideDetails === !initSchedule.show_content &&
            JSON.stringify(participants) ===
                JSON.stringify(initSchedule.participants)
        ) {
            return false;
        }
        return true;
    };

    const cancelScheduleUpdate = () => {
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

    const createSchedule = async (
        newSchedule: Schedule,
        urlParams: CalendarURLParams,
        accessToken: string | null,
    ) => {
        try {
            const res = await createScheduleAPI(
                newSchedule,
                urlParams,
                accessToken,
            );
            successToast('일정이 추가되었습니다.');
            console.log(res.data);
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
        urlParams: CalendarURLParams,
        accessToken: string | null,
    ) => {
        try {
            await editScheduleAPI(
                scheduleId,
                newSchedule,
                urlParams,
                accessToken,
            );
            successToast('일정이 수정되었습니다.');
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

    const submitScheduleUpdate = async () => {
        if (!user) {
            errorToast('로그인을 먼저 해주세요.');
            return;
        }
        if (!title) {
            errorToast('제목을 적어주세요.');
            return;
        }

        const urlParams = {
            pk: user.pk,
            from: formatFullDate(startDate),
            to: formatFullDate(endDate),
        };

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
                isSuccessful = await createSchedule(
                    newSchedule,
                    urlParams,
                    accessToken,
                );
                break;
            case 'edit':
                isSuccessful = initSchedule?.id
                    ? await editSchdule(
                          initSchedule.id,
                          newSchedule,
                          urlParams,
                          accessToken,
                      )
                    : false;
                break;
        }

        if (isSuccessful) closeModal(MODAL_NAMES.scheduleEditor);
    };

    const getSchedules = async () => {
        // if (!user) return;
        const urlParams: CalendarURLParamsEmail = {
            email: 'chansol1024@naver.com',
            from: '2023-01-18',
            to: '2023-01-18',
        };
        try {
            const res = await getEntireScheduleAPIEmail(urlParams, accessToken);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const particular = async () => {
        const urlParams: CalendarURLParams = {
            pk: 7,
            from: '2023-01-18',
            to: '2023-01-18',
        };
        try {
            const res = await getParticularScheduleAPI(
                34,
                urlParams,
                accessToken,
            );
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const edit = async () => {
        const urlParams: CalendarURLParamsEmail = {
            email: 'chansol1024@naver.com',
            from: '2023-01-18',
            to: '2023-01-18',
        };
        const newSchedule = {
            title: 'Test Schedule 2',
            start_at: '2023-01-18 00:00:00',
            end_at: '2023-01-18 00:00:00',
            description: 'Test description 2',
            participants: [],
            protection_level: 1,
            show_content: true,
        };
        try {
            const res = await editScheduleAPIEmail(
                34,
                newSchedule,
                urlParams,
                accessToken,
            );
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const delScheul = async () => {
        const urlParams: CalendarURLParams = {
            pk: 7,
            from: '2023-01-18',
            to: '2023-01-18',
        };

        try {
            const res = await deleteScheduleAPI(33, urlParams, accessToken);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ModalFrame
            modalName={MODAL_NAMES.scheduleEditor}
            onClickBackDrop={cancelScheduleUpdate}
        >
            <div className={styles.scheduleEditorModal}>
                <div className={styles.header}>
                    <button onClick={getSchedules}>가져오기</button>
                    <button onClick={particular}>특정</button>
                    <button onClick={delScheul}>삭제</button>
                    <button onClick={edit}>수정</button>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={cancelScheduleUpdate}
                    >
                        <Image
                            src={close_icon}
                            height={18}
                            alt="clear_search_input"
                        />
                    </button>
                </div>
                <div className={styles.scheduleForm}>
                    <div className={styles.body}>
                        <div className={styles.title}>
                            <input
                                type="text"
                                value={title}
                                id="title"
                                onChange={e => setTitle(e.target.value)}
                                placeholder="제목 추가"
                            />
                            <span className={styles.underline} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.time}>
                                <div>
                                    <label>
                                        <Image
                                            src={time_icon}
                                            alt="date_time"
                                            width={24}
                                        />
                                    </label>
                                    <div className={styles.timeInputContainer}>
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
                                        <span className={styles.dash}>-</span>
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
                                </div>
                                {!dateValidity.isValid && (
                                    <ErrorMessage
                                        message={dateValidity.message}
                                    />
                                )}
                            </div>
                            <div className={styles.participant}>
                                <label>
                                    <Image
                                        src={people_icon}
                                        alt="participant"
                                        width={24}
                                    />
                                </label>
                                <UserSearchDropDown
                                    toExecute={item => null}
                                    interceptItem={updateParticipants}
                                    buttonText="추가"
                                    width="400px"
                                    submitButtonNotRequired={true}
                                />
                            </div>
                            <div className={styles.protectionLevel}>
                                <label>
                                    <Image
                                        src={lock_icon}
                                        alt="protection_level"
                                        width={24}
                                    />
                                </label>
                                <ProtectionLevelDropDown
                                    protectionLevel={protectionLevel}
                                    setProtectionLevel={setProtectionLevel}
                                />
                            </div>
                            <div className={styles.hideDetails}>
                                <input
                                    type="checkbox"
                                    id="hideDetails"
                                    checked={hideDetails || isHideDisabled}
                                    onChange={() =>
                                        setHideDetails(!hideDetails)
                                    }
                                    disabled={isHideDisabled}
                                />
                                <label htmlFor="hideDetails">
                                    세부 일정 비공개
                                </label>
                            </div>
                            <div className={styles.description}>
                                <label>
                                    <Image
                                        src={text_icon}
                                        alt="description"
                                        width={24}
                                    />
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
                            onClick={submitScheduleUpdate}
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
