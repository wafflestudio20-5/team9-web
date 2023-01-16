import Image from 'next/image';
import React, { useState, useMemo } from 'react';

import styles from './ScheduleModal.module.scss';

import { CalendarURLParams } from '@apis/calendar';
import ProtectionLevelDropDown from '@components/CreateSchedule/ProtectionLevelDropDown';
import TimeDropDown from '@components/CreateSchedule/TimeDropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { ProtectionLevel, Schedule } from '@customTypes/ScheduleTypes';
import { UserDataForSearch } from '@customTypes/UserTypes';
import close_icon from '@images/close_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import time_icon from '@images/time_icon.svg';
import { errorToast, warningModal } from '@utils/customAlert';
import { formatFullDate } from '@utils/formatDate';

function ErrorMessage({ message }: { message: string }) {
    return <span className={styles.errorMessage}>{message}</span>;
}

export interface InitSchedule {
    title: string;
    startDate: Date;
    endDate: Date;
    protectionLevel: ProtectionLevel;
    hideDetails: boolean;
    description: string;
    participants: { pk: number }[];
}

interface ScheduleModalProps {
    userPk: number;
    initSchedule: InitSchedule;
    requestScheduleUpdate(
        urlParams: CalendarURLParams,
        newSchedule: Schedule,
    ): Promise<boolean>;
}

export default function ScheduleModal({
    userPk,
    initSchedule,
    requestScheduleUpdate,
}: ScheduleModalProps) {
    const { closeModal } = useModal();
    const [title, setTitle] = useState(initSchedule.title);
    const [startDate, setStartDate] = useState(initSchedule.startDate);
    const [endDate, setEndDate] = useState(initSchedule.endDate);
    const [protectionLevel, setProtectionLevel] = useState(
        initSchedule.protectionLevel,
    );
    const [hideDetails, setHideDetails] = useState(initSchedule.hideDetails);
    const [description, setDescription] = useState(initSchedule.description);
    const [participants, setParticipants] = useState(initSchedule.participants);
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

    const cancelScheduleUpdate = () => {
        if (title) {
            const warningContent = {
                title: '작성 중인 일정을 삭제하시겠습니까?',
                text: '변경사항이 저장되지 않았습니다.',
                confirmButtonText: '삭제',
            };
            warningModal(warningContent).then(result => {
                if (result.isConfirmed) {
                    closeModal(MODAL_NAMES.schedule);
                }
            });
        } else {
            closeModal(MODAL_NAMES.schedule);
        }
    };

    const submitScheduleUpdate = async () => {
        if (!title) {
            errorToast('제목을 적어주세요.');
            return;
        }

        const urlParams = {
            pk: userPk,
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

        const isSuccessful = await requestScheduleUpdate(
            urlParams,
            newSchedule,
        );
        if (isSuccessful) closeModal(MODAL_NAMES.schedule);
    };

    return (
        <ModalFrame
            modalName={MODAL_NAMES.schedule}
            onClickBackDrop={cancelScheduleUpdate}
        >
            <div className={styles.scheduleModal}>
                <div className={styles.header}>
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
