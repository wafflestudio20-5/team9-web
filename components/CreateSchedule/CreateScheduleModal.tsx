import React, { useState, useMemo } from 'react';

import styles from './CreateScheduleModal.module.scss';

import SharingScopeDropDown, {
    SharingScope,
} from '@components/CreateSchedule/SharingScopeDropDown';
import TimeDropDown from '@components/CreateSchedule/TimeDropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import CloseIcon from '@images/close_icon.svg';
import LockIcon from '@images/lock_icon.svg';
import PeopleIcon from '@images/people_icon.svg';
import TextIcon from '@images/text_icon.svg';
import TimeIcon from '@images/time_icon.svg';

function ErrorMessage({ message }: { message: string }) {
    return <span className={styles.errorMessage}>{message}</span>;
}

export default function CreateScheduleModal() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { closeModal } = useModal();
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(
        new Date(yearNow, monthNow - 1, dateNow),
    );
    const [endDate, setEndDate] = useState<Date>(
        new Date(yearNow, monthNow - 1, dateNow),
    );
    const [sharingScope, setSharingScope] = useState<string>('');
    const [hideDetails, setHideDetails] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [dateValidity, setDateValidity] = useState({
        isValid: true,
        message: '',
    });
    const isHideDisabled = useMemo(
        () => sharingScope === SharingScope.private,
        [sharingScope],
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

    const cancelCreateSchedule = () => {
        // TODO: alert (for double checking)
        closeModal(MODAL_NAMES.createSchedule);
    };

    const submitCreateScheduleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if all inputs are valid
        closeModal(MODAL_NAMES.createSchedule);
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.createSchedule}>
            <div className={styles.createScheduleModal}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={cancelCreateSchedule}
                    >
                        <CloseIcon className="icon" height="18px" />
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
                                        <TimeIcon
                                            className="icon"
                                            height="24px"
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
                                    <PeopleIcon className="icon" width="24px" />
                                </label>
                                <input type="text" placeholder="참석자" />
                            </div>
                            <div className={styles.sharingScope}>
                                <label>
                                    <LockIcon className="icon" width="24px" />
                                </label>
                                <SharingScopeDropDown
                                    scope={sharingScope}
                                    setScope={setSharingScope}
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
                                    <TextIcon className="icon" width="24px" />
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
