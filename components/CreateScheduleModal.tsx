import Image from 'next/image';
import React from 'react';

import styles from './CreateScheduleModal.module.scss';

import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import TimeDropDown from '@components/TimeDropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import close_icon from '@images/close_icon.svg';

export default function CreateScheduleModal() {
    const { closeModal } = useModal();

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
                                    <TimeDropDown title="시작 시간" />
                                    <span>-</span>
                                    <MiniCalendarDropDown title="종료 날짜" />
                                    <TimeDropDown title="시작 시간" />
                                </div>
                            </div>
                            <div className={styles.participant}>
                                <label>icon</label>
                                <input type="text" placeholder="참석자" />
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
