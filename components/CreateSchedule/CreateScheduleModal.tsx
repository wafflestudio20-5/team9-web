import axios from 'axios';
import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

import styles from './CreateScheduleModal.module.scss';

import { createScheduleAPI } from '@apis/calendar';
import ProtectionLevelDropDown, {
    ProtectionLevel,
} from '@components/CreateSchedule/ProtectionLevelDropDown';
import TimeDropDown from '@components/CreateSchedule/TimeDropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { Schedule } from '@customTypes/ScheduleTypes';
import close_icon from '@images/close_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import time_icon from '@images/time_icon.svg';
import { formatFullDate } from '@utils/formatDate';

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2500,
});

function ErrorMessage({ message }: { message: string }) {
    return <span className={styles.errorMessage}>{message}</span>;
}

export default function CreateScheduleModal() {
    const { user, accessToken } = useSessionContext();
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { closeModal } = useModal();
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(
        new Date(yearNow, monthNow - 1, dateNow),
    );
    const [endDate, setEndDate] = useState<Date>(
        new Date(yearNow, monthNow - 1, dateNow),
    );
    const [protectionLevel, setProtectionLevel] = useState<string>('');
    const [hideDetails, setHideDetails] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [dateValidity, setDateValidity] = useState({
        isValid: true,
        message: '',
    });
    const isHideDisabled = useMemo(
        () => protectionLevel === ProtectionLevel.private,
        [protectionLevel],
    );

    if (!user) return;

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

    const warningAlert = () =>
        Swal.fire({
            title: '작성 중인 일정을 삭제하시겠습니까?',
            text: '변경사항이 저장되지 않았습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            confirmButtonColor: '#1a73e8',
            cancelButtonText: '취소',
            cancelButtonColor: '#000000',
            reverseButtons: true,
        });

    const cancelCreateSchedule = () => {
        if (title || protectionLevel || description) {
            warningAlert().then(result => {
                if (result.isConfirmed) {
                    closeModal(MODAL_NAMES.createSchedule);
                }
            });
        } else {
            closeModal(MODAL_NAMES.createSchedule);
        }
    };

    const successAlert = () => {
        Toast.fire({
            icon: 'success',
            title: '일정이 추가되었습니다.',
        });
    };

    const errorAlert = (message: string) => {
        Toast.fire({
            icon: 'error',
            title: message,
        });
    };

    const validateScheduleData = () => {
        if (!title) {
            return { isValid: false, message: '제목을 적어주세요.' };
        } else if (!protectionLevel) {
            return { isValid: false, message: '공개 범위를 설정해주세요.' };
        } else if (!description) {
            return { isValid: false, message: '설명을 적어주세요.' };
        } else {
            return { isValid: true, message: '' };
        }
    };

    const submitCreateScheduleForm = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (!user) {
            errorAlert('로그인을 먼저 해주세요.');
            return;
        }

        const { isValid, message } = validateScheduleData();
        if (!isValid) {
            errorAlert(message);
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
        };

        try {
            await createScheduleAPI(urlParams, newSchedule, accessToken);
            successAlert();
            closeModal(MODAL_NAMES.createSchedule);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message);
            } else {
                errorAlert('일정 생성을 생성하지 못했습니다.');
            }
        }
    };

    return (
        <ModalFrame
            modalName={MODAL_NAMES.createSchedule}
            onClickBackDrop={cancelCreateSchedule}
        >
            <div className={styles.createScheduleModal}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={cancelCreateSchedule}
                    >
                        <Image
                            src={close_icon}
                            height={18}
                            alt="clear_search_input"
                        />
                    </button>
                </div>
                <form
                    className={styles.createScheduleForm}
                    onSubmit={submitCreateScheduleForm}
                >
                    <div className={styles.body}>
                        <div className={styles.title}>
                            <input
                                type="text"
                                value={title}
                                id="title"
                                onChange={e => setTitle(e.target.value)}
                                placeholder="제목 추가"
                            />
                            <label htmlFor="title"></label>
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
                                        <span>-</span>
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
                                <input type="text" placeholder="참석자" />
                            </div>
                            <div className={styles.sharingScope}>
                                <label>
                                    <Image
                                        src={lock_icon}
                                        alt="public_scope"
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
                        <button className={styles.save}>저장</button>
                    </div>
                </form>
            </div>
        </ModalFrame>
    );
}
