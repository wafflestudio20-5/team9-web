import React, { useState } from 'react';

import styles from './CustomRecurrenceModal.module.scss';
import { DAYS } from './RecurrenceDropDown';

import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { RecurrenceRule, Repeat } from '@customTypes/ScheduleTypes';

interface CustomRecurrenceModalProps {
    date: Date;
    ordinal: { number: number; text: string };
    changeRecurrenceRule(newRule: RecurrenceRule, content: string): void;
}

type EndCondition = 'never' | 'until' | 'count';

export default function CustomRecurrenceModal({
    date,
    ordinal,
    changeRecurrenceRule,
}: CustomRecurrenceModalProps) {
    console.log(date);
    const { closeModal } = useModal();
    const [interval, setInterval] = useState<number>(1);
    const [period, setPeriod] = useState<Repeat>(Repeat.weekly);
    const [days, setDays] = useState(
        DAYS.map((d, i) => ({
            name: d,
            checked: i === date.getDay(),
        })),
    );
    const [endCondition, setEndCondition] = useState<{
        condition: EndCondition;
        date: Date;
        count: number;
    }>({
        condition: 'never',
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
        count: 1,
    });

    const changeEndDate = (endDate: Date) => {
        setEndCondition(prev => ({ ...prev, date: endDate }));
    };

    const submitCustomRecurrenceRule = () => {
        console.log('custom recurrence rule');
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.customRecurrence} isDim={true}>
            <div className={styles.customRecurrenceModal}>
                <h3>반복 설정</h3>
                <div className={styles.rules}>
                    <div className={styles.intervalContainer}>
                        <label>반복 주기</label>
                        <div className={styles.interval}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={interval}
                                    min={1}
                                    onChange={e =>
                                        setInterval(Number(e.target.value) || 1)
                                    }
                                />
                                <span className="underline" />
                            </div>
                            <button className={styles.period}>주drop</button>
                        </div>
                    </div>
                    <div className={styles.daysContainer}>
                        <label>반복 요일</label>
                        <div className={styles.days}>
                            {days.map((d, i) => {
                                return (
                                    <>
                                        <input
                                            type="checkbox"
                                            key={i}
                                            id={d.name}
                                            className={styles.day}
                                            checked={d.checked}
                                            disabled={i === date.getDay()}
                                            onChange={e =>
                                                setDays(prev => {
                                                    const temp = [...prev];
                                                    temp[i].checked =
                                                        e.target.checked;
                                                    return temp;
                                                })
                                            }
                                        />
                                        <label htmlFor={d.name}>{d.name}</label>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.endConditionContainer}>
                        <label>종료</label>
                        <div className={styles.endCondition}>
                            <div className={styles.conditionWrapper}>
                                <input
                                    type="radio"
                                    name="endCondition"
                                    id="never"
                                    checked={endCondition.condition === 'never'}
                                    onChange={() =>
                                        setEndCondition(prev => ({
                                            ...prev,
                                            condition: 'never',
                                        }))
                                    }
                                />
                                <label htmlFor="never">없음</label>
                            </div>
                            <div className={styles.conditionWrapper}>
                                <input
                                    type="radio"
                                    name="endCondition"
                                    id="until"
                                    checked={endCondition.condition === 'until'}
                                    onChange={() =>
                                        setEndCondition(prev => ({
                                            ...prev,
                                            condition: 'until',
                                        }))
                                    }
                                />
                                <label htmlFor="until">날짜: </label>
                                <div className={styles.endInputWrapper}>
                                    <MiniCalendarDropDown
                                        title="종료 날짜"
                                        date={endCondition.date || date}
                                        changeDate={changeEndDate}
                                        disabled={
                                            endCondition.condition !== 'until'
                                        }
                                        bodyStyle={{
                                            top: '-247px',
                                            width: '250px',
                                        }}
                                    />
                                    {endCondition.condition !== 'until' && (
                                        <div className={styles.blur} />
                                    )}
                                </div>
                            </div>
                            <div className={styles.conditionWrapper}>
                                <input
                                    type="radio"
                                    name="endCondition"
                                    id="count"
                                    checked={endCondition.condition === 'count'}
                                    onChange={() =>
                                        setEndCondition(prev => ({
                                            ...prev,
                                            condition: 'count',
                                        }))
                                    }
                                />
                                <label htmlFor="count">다음</label>
                                <div className={styles.endInputWrapper}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="number"
                                            value={endCondition.count}
                                            min={1}
                                            onChange={e =>
                                                setEndCondition(prev => ({
                                                    ...prev,
                                                    count: Number(
                                                        e.target.value,
                                                    ),
                                                }))
                                            }
                                            className={styles.count}
                                        />
                                        <span className="underline" />
                                    </div>
                                    <span className={styles.countText}>
                                        회 반복
                                    </span>
                                    {endCondition.condition !== 'count' && (
                                        <div className={styles.blur} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.btnContainer}>
                    <button
                        className={styles.cancel}
                        onClick={() => closeModal(MODAL_NAMES.customRecurrence)}
                    >
                        취소
                    </button>
                    <button
                        className={styles.complete}
                        onClick={submitCustomRecurrenceRule}
                    >
                        완료
                    </button>
                </div>
            </div>
        </ModalFrame>
    );
}
