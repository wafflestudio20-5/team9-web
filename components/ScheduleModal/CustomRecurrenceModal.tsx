import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import styles from './CustomRecurrenceModal.module.scss';
import { DAYS } from './RecurrenceDropDown';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import {
    DateOption,
    Period,
    PeriodText,
    RecurrenceRule,
    Repeat,
    StopCondition,
} from '@customTypes/ScheduleTypes';
import DropDownIcon from '@images/dropdown_icon.svg';
import { errorToast } from '@utils/customAlert';
import { formatFullDate } from '@utils/formatDate';

interface CustomRecurrenceModalProps {
    date: Date;
    ordinal: { number: number; text: string };
    changeRecurrenceRule(newRule: RecurrenceRule, content: string): void;
}

export default function CustomRecurrenceModal({
    date,
    ordinal,
    changeRecurrenceRule,
}: CustomRecurrenceModalProps) {
    const { closeModal } = useModal();
    const [interval, setInterval] = useState<number>(1);
    const [period, setPeriod] = useState<Period>(Repeat.weekly);
    const [days, setDays] = useState(
        DAYS.map((d, i) => ({
            name: d,
            num: i,
            checked: i === date.getDay(),
        })),
    );
    const [dateOption, setDateOption] = useState<{
        option: DateOption;
        text: string;
    }>({
        option: 'specific',
        text:
            period === Repeat.monthly
                ? `매월 ${date.getDate()}일`
                : `매년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
    });
    const [stopCondition, setStopCondition] = useState<{
        condition: StopCondition;
        until: Date;
        count: number;
    }>({
        condition: 'never',
        until: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 7,
        ),
        count: 1,
    });

    const changeEndDate = (endDate: Date) => {
        setStopCondition(prev => ({ ...prev, until: endDate }));
    };

    const getRepeatIntervalText = (interval: number, period: Period) => {
        if (interval === 1) {
            if (period === Repeat.monthly) return '매월';
            return `매${PeriodText[period]}`;
        } else {
            return `${interval}${PeriodText[period]}마다`;
        }
    };

    const validateCustomRecurrenceRule = () => {
        return (
            interval >= 1 &&
            (stopCondition.condition !== 'count' || stopCondition.count >= 1)
        );
    };

    const submitCustomRecurrenceRule = () => {
        const isValid = validateCustomRecurrenceRule();
        if (!isValid) {
            errorToast('반복 설정값이 올바르지 않습니다.');
            return;
        }

        const newRule: RecurrenceRule = {
            repeat: period,
            interval: interval,
            dateOption: dateOption.option,
            stopCondition: stopCondition.condition,
        };
        let text = getRepeatIntervalText(interval, period);

        switch (period) {
            default:
            case Repeat.daily:
                break;
            case Repeat.weekly:
                newRule.days = days.filter(d => d.checked).map(d => d.num);
                text += ` ${newRule.days
                    .map(d => `${DAYS[d]}요일`)
                    .join(', ')}`;
                break;
            case Repeat.monthly:
                text += ` ${dateOption.text}`;
                if (dateOption.option === 'ordinal') {
                    newRule.ordinal = ordinal.number;
                    newRule.days = [date.getDay()];
                }
                break;
            case Repeat.yearly:
                text += ` ${dateOption.text}`;
                if (dateOption.option === 'ordinal') {
                    newRule.ordinal = ordinal.number;
                    newRule.days = [date.getDay()];
                }
                break;
        }

        switch (stopCondition.condition) {
            case 'count':
                newRule.count = stopCondition.count;
                text += `, ${stopCondition.count}회`;
                break;
            case 'until':
                newRule.until = stopCondition.until;
                text += `, 종료일: ${formatFullDate(stopCondition.until)}`;
                break;
            case 'never':
            default:
                break;
        }

        changeRecurrenceRule(newRule, text);
        closeModal(MODAL_NAMES.customRecurrence);
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.customRecurrence} isDim={true}>
            <div className={styles.customRecurrenceModal}>
                <h3>반복 설정</h3>
                <div
                    className={`${styles.rules} ${
                        period !== Repeat.daily && styles.flexible
                    }`}
                >
                    <div className={styles.intervalContainer}>
                        <label>반복 주기</label>
                        <div className={styles.interval}>
                            <div className={styles.inputUnderlineWrapper}>
                                <input
                                    type="number"
                                    value={interval || ''}
                                    className={
                                        interval < 1 ? styles.invalid : ''
                                    }
                                    min={1}
                                    max={100}
                                    onChange={e =>
                                        setInterval(Number(e.target.value))
                                    }
                                />
                                <span className="underline" />
                            </div>
                            <PeriodDropDown
                                period={period}
                                setPeriod={setPeriod}
                            />
                        </div>
                    </div>
                    {[Repeat.monthly, Repeat.yearly].includes(period) && (
                        <div className={styles.dateOptionContainer}>
                            <label>반복 날짜</label>
                            <DateOptionDropDown
                                date={date}
                                ordinal={ordinal}
                                period={period}
                                dateOption={dateOption}
                                setDateOption={setDateOption}
                            />
                        </div>
                    )}
                    {period === Repeat.weekly && (
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
                                            <label htmlFor={d.name}>
                                                {d.name}
                                            </label>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className={styles.stopConditionContainer}>
                        <label>종료</label>
                        <div className={styles.stopCondition}>
                            <div className={styles.conditionWrapper}>
                                <input
                                    type="radio"
                                    name="stopCondition"
                                    id="never"
                                    checked={
                                        stopCondition.condition === 'never'
                                    }
                                    onChange={() =>
                                        setStopCondition(prev => ({
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
                                    name="stopCondition"
                                    id="count"
                                    checked={
                                        stopCondition.condition === 'count'
                                    }
                                    onChange={() =>
                                        setStopCondition(prev => ({
                                            ...prev,
                                            condition: 'count',
                                        }))
                                    }
                                />
                                <label htmlFor="count">다음</label>
                                <div
                                    className={
                                        stopCondition.condition !== 'count'
                                            ? `${styles.countContainer} ${styles.disabled}`
                                            : styles.countContainer
                                    }
                                >
                                    <div
                                        className={styles.inputUnderlineWrapper}
                                    >
                                        <input
                                            type="number"
                                            value={stopCondition.count || ''}
                                            className={
                                                stopCondition.count < 1
                                                    ? `${styles.count} ${styles.invalid}`
                                                    : styles.count
                                            }
                                            min={1}
                                            max={100}
                                            disabled={
                                                stopCondition.condition !==
                                                'count'
                                            }
                                            onChange={e =>
                                                setStopCondition(prev => ({
                                                    ...prev,
                                                    count: Number(
                                                        e.target.value,
                                                    ),
                                                }))
                                            }
                                        />
                                        <span className="underline" />
                                    </div>
                                    <span className={styles.countText}>
                                        회 반복
                                    </span>
                                </div>
                            </div>
                            <div className={styles.conditionWrapper}>
                                <input
                                    type="radio"
                                    name="stopCondition"
                                    id="until"
                                    checked={
                                        stopCondition.condition === 'until'
                                    }
                                    onChange={() =>
                                        setStopCondition(prev => ({
                                            ...prev,
                                            condition: 'until',
                                        }))
                                    }
                                />
                                <label htmlFor="until">날짜: </label>
                                <div
                                    className={`${styles.calendar} ${
                                        stopCondition.condition !== 'until' &&
                                        styles.disabled
                                    }`}
                                >
                                    <MiniCalendarDropDown
                                        title="종료 날짜"
                                        date={stopCondition.until || date}
                                        changeDate={changeEndDate}
                                        disabled={
                                            stopCondition.condition !== 'until'
                                        }
                                        bodyStyle={{
                                            top: '-245px',
                                            width: '240px',
                                            zIndex: 175,
                                        }}
                                    />
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

interface PeriodDropDownProps {
    period: Exclude<Repeat, Repeat.none>;
    setPeriod: Dispatch<SetStateAction<Exclude<Repeat, Repeat.none>>>;
}

function PeriodDropDown({ period, setPeriod }: PeriodDropDownProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader style={{ zIndex: 171 }}>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {PeriodText[period]}
                    </span>
                    <DropDownIcon className="icon" height="20px" />
                </button>
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ top: '40px', zIndex: 170 }}>
                <ul>
                    {Object.keys(PeriodText).map((p, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                setPeriod(Number(p));
                                closeDropDown();
                            }}
                        >
                            {PeriodText[Number(p)]}
                        </li>
                    ))}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}

interface DateOptionDropDdownProps {
    date: Date;
    ordinal: { number: number; text: string };
    period: Period;
    dateOption: { option: DateOption; text: string };
    setDateOption: Dispatch<
        SetStateAction<{ option: DateOption; text: string }>
    >;
}

function DateOptionDropDown({
    date,
    ordinal,
    period,
    dateOption,
    setDateOption,
}: DateOptionDropDdownProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);
    const isLastDay = useMemo(() => {
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return date.getDate() === lastDay.getDate();
    }, [date]);

    const dateOptions: {
        [key: number]: { option: DateOption; text: string }[];
    } = {
        [Repeat.monthly]: [
            { option: 'specific', text: `${date.getDate()}일` },
            { option: 'last', text: '마지막날' },
            {
                option: 'ordinal',
                text: `${ordinal.text} ${DAYS[date.getDay()]}요일`,
            },
        ],
        [Repeat.yearly]: [
            {
                option: 'specific',
                text: `${date.getMonth() + 1}월 ${date.getDate()}일`,
            },
            { option: 'last', text: '2월 마지막날' },
            {
                option: 'ordinal',
                text: `${date.getMonth() + 1}월 ${ordinal.text} ${
                    DAYS[date.getDay()]
                }요일`,
            },
        ],
    };

    const getDateOptionFullText = (text: string) => {
        switch (period) {
            case Repeat.monthly:
                return `매월 ${text}`;
            case Repeat.yearly:
                return `매년 ${text}`;
        }
    };

    const changeDateOption = (option: DateOption, text: string) => {
        setDateOption({ option, text });
        closeDropDown();
    };

    useEffect(() => {
        const newText =
            period === Repeat.monthly
                ? `${date.getDate()}일`
                : `${date.getMonth() + 1}월 ${date.getDate()}일`;

        setDateOption({ option: 'specific', text: newText });
    }, [period]);

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span>{getDateOptionFullText(dateOption.text)}</span>
                    <DropDownIcon className="icon" height="20px" />
                </button>
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ top: '40px' }}>
                <ul>
                    {dateOptions[period].map((v, i) => {
                        if (
                            (!isLastDay && v.option === 'last') ||
                            (period === Repeat.yearly &&
                                date.getMonth() !== 1 &&
                                isLastDay &&
                                v.option === 'last')
                        ) {
                            return null;
                        }

                        return (
                            <li
                                onClick={() =>
                                    changeDateOption(v.option, v.text)
                                }
                                key={i}
                            >
                                {getDateOptionFullText(v.text)}
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
