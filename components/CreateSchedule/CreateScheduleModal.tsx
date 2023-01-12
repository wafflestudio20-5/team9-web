import Image from 'next/image';
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
import close_icon from '@images/close_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import time_icon from '@images/time_icon.svg';

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
    const [sharingcScope, setSharingScope] = useState<string>('');
    const [hideDetails, setHideDetails] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');

    const changeStartDate = (newDate: Date) => {
        if (newDate > endDate) {
            // TODO: alert
            return;
        }
        setStartDate(newDate);
    };

    const changeEndDate = (newDate: Date) => {
        if (newDate < startDate) {
            // TODO: alert
            return;
        }
        setEndDate(newDate);
    };

    const disableHideOption = () =>
        useMemo(() => {
            if (sharingcScope === SharingScope.private) {
                setHideDetails(true);
                return true;
            }
            return false;
        }, [sharingcScope]);

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
                                onChange={e => setTitle(e.target.value)}
                                placeholder="제목 추가"
                            />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.time}>
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
                                <SharingScopeDropDown
                                    scope={sharingcScope}
                                    setScope={setSharingScope}
                                />
                            </div>
                            <div className={styles.hideDetails}>
                                <input
                                    type="checkbox"
                                    id="hideDetails"
                                    checked={hideDetails}
                                    onChange={() =>
                                        setHideDetails(!hideDetails)
                                    }
                                    disabled={disableHideOption()}
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
