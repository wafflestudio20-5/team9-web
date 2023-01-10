import Image from 'next/image';
import React, { useState } from 'react';

import styles from './CreateScheduleModal.module.scss';

import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import PublicScopeDropDown from '@components/PublicScopeDropDown';
import TimeDropDown from '@components/TimeDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import close_icon from '@images/close_icon.svg';

type PublicScope = '전체공개' | '일부공개' | '비공개';

export default function CreateScheduleModal() {
    const { closeModal } = useModal();
    const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
    const [endtTime, setEndTime] = useState({ hour: 0, minute: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [publicScope, setPublicScope] = useState<string>('');
    const [hideDetails, setHideDetails] = useState(false);

    return (
        <ModalFrame modalName={MODAL_NAMES.createSchedule}>
            <div className={styles.createScheduleModal}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={() => closeModal(MODAL_NAMES.createSchedule)}
                    >
                        <Image
                            src={close_icon}
                            height={18}
                            alt="clear_search_input"
                        />
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.schedule}>
                        <div className={styles.title}>
                            <input type="text" placeholder="제목 추가" />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.time}>
                                <label>icon</label>
                                <div className={styles.inputContainer}>
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
                                <label>icon</label>
                                <input type="text" placeholder="참석자" />
                            </div>
                            <div className={styles.publicScope}>
                                <label>icon</label>
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
                                    onClick={() => setHideDetails(!hideDetails)}
                                />
                                <label htmlFor="hideDetails">
                                    세부 일정 비공개
                                </label>
                            </div>
                            <div className={styles.description}>
                                <label>icon</label>
                                <textarea
                                    cols={50}
                                    rows={5}
                                    placeholder="일정에 대한 설명을 간략히 적어주세요."
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={styles.save}>저장</button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
