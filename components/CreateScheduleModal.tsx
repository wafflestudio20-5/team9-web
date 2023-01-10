import Image from 'next/image';
import React, { useState } from 'react';

import styles from './CreateScheduleModal.module.scss';

import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import PublicScopeDropDown from '@components/PublicScopeDropDown';
import TimeDropDown from '@components/TimeDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import close_icon from '@images/close_icon.svg';
import lock_icon from '@images/lock_icon.svg';
import people_icon from '@images/people_icon.svg';
import text_icon from '@images/text_icon.svg';
import time_icon from '@images/time_icon.svg';

export default function CreateScheduleModal() {
    const { closeModal } = useModal();
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
    const [endtTime, setEndTime] = useState({ hour: 0, minute: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [publicScope, setPublicScope] = useState<string>('');
    const [hideDetails, setHideDetails] = useState(false);
    const [description, setDescription] = useState('');

    const cancelCreateSchedule = () => {
        closeModal(MODAL_NAMES.createSchedule);
        // alert (double check cancel)
    };

    const submitCreateScheduleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                <form onSubmit={submitCreateScheduleForm}>
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
                                    <MiniCalendarDropDown title="시작 날짜" />
                                    <TimeDropDown
                                        title="시작 시간"
                                        time={startTime}
                                        setTime={setStartTime}
                                    />
                                    <span>-</span>
                                    <MiniCalendarDropDown title="종료 날짜" />
                                    <TimeDropDown
                                        title="시작 시간"
                                        time={endtTime}
                                        setTime={setEndTime}
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
                            <div className={styles.publicScope}>
                                <label>
                                    <Image
                                        src={lock_icon}
                                        alt="public_scope"
                                        width={24}
                                    />
                                </label>
                                <PublicScopeDropDown
                                    scope={publicScope}
                                    setScope={setPublicScope}
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
