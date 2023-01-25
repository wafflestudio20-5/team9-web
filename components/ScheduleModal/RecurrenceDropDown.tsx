import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import {
    DateOption,
    Recurrence,
    RecurrenceRule,
    Repeat,
} from '@customTypes/ScheduleTypes';
import DropdownIcon from '@images/dropdown_icon.svg';
import { formatFullDate } from '@utils/formatDate';

// 반복 안함, 매일, 매주 *요일, 매월 *일,매월 *번째 *요일, 매년 *월 *일, 맞춤 설정

export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const OrdinalText: { [key: number]: string } = {
    1: '첫 번째',
    2: '두 번째',
    3: '세 번째',
    4: '네 번째',
    5: '마지막',
};

const getOrdinalNum = (date: Date) => {
    const nextWeek = new Date(date);
    nextWeek.setDate(date.getDate() + 7);
    const num =
        date.getMonth() !== nextWeek.getMonth()
            ? 5
            : Math.ceil(date.getDate() / 7);

    return num;
};

interface RecurrenceDropDownProps {
    date: Date;
    recurrence: Recurrence;
    setRecurrence: Dispatch<SetStateAction<Recurrence>>;
}

export default function RecurrenceDropDown({
    date,
    setRecurrence,
}: RecurrenceDropDownProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);
    const { openModal } = useModal();
    const [ruleText, setRuleText] = useState<string>('반복 안 함');
    const ordinal = {
        number: getOrdinalNum(date),
        text: OrdinalText[getOrdinalNum(date)],
    };

    const defaultRepeatOptions: {
        rule: RecurrenceRule;
        text: string;
    }[] = [
        {
            rule: { repeat: Repeat.none, interval: 0, stopCondition: 'never' },
            text: '반복 안 함',
        },
        {
            rule: { repeat: Repeat.daily, interval: 1, stopCondition: 'never' },
            text: '매일',
        },
        {
            rule: {
                repeat: Repeat.weekly,
                interval: 1,
                days: [date.getDay()],
                stopCondition: 'never',
            },
            text: `매주 ${DAYS[date.getDay()]}요일`,
        },
        {
            rule: {
                repeat: Repeat.monthly,
                interval: 1,
                dateOption: 'specific',
                stopCondition: 'never',
            },
            text: `매월 ${date.getDate()}일`,
        },
        {
            rule: {
                repeat: Repeat.monthly,
                interval: 1,
                dateOption: 'ordinal',
                ordinal: ordinal.number,
                days: [date.getDay()],
                stopCondition: 'never',
            },
            text: `매월 ${ordinal.text} ${DAYS[date.getDay()]}요일`,
        },
        {
            rule: {
                repeat: Repeat.yearly,
                interval: 1,
                dateOption: 'specific',
                stopCondition: 'never',
            },
            text: `매년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
        },
        {
            rule: {
                repeat: Repeat.yearly,
                interval: 1,
                dateOption: 'ordinal',
                ordinal: ordinal.number,
                days: [date.getDay()],
                stopCondition: 'never',
            },
            text: `매년 ${date.getMonth() + 1}월 ${ordinal.text} ${
                DAYS[date.getDay()]
            }요일`,
        },
    ];

    const getDailyCron = (interval: number) => {
        const time = `${date.getMinutes()} ${date.getHours()}`;
        return `${time} */${interval} * * *`;
    };

    const getWeeklyCron = (interval: number, days: number[]) => {
        const time = `${date.getMinutes()} ${date.getHours()}`;
        return `${time} * * ${days.join(',')}/${interval} *`;
    };

    const getMonthlyCron = (
        interval: number,
        dateOption: DateOption,
        ordinal?: number,
    ) => {
        const time = `${date.getMinutes()} ${date.getHours()}`;
        if (dateOption === 'specific') {
            return `${time} ${date.getDate()} */${interval} * *`;
        } else if (dateOption === 'last') {
            return `${time} L */${interval} * *`;
        } else {
            if (ordinal === 5) {
                return `${time} * */${interval} ${date.getDay()}L *`;
            } else {
                return `${time} * */${interval} ${date.getDay()}#${ordinal} *`;
            }
        }
    };

    const getYearlyCron = (
        interval: number,
        dateOption: DateOption,
        ordinal?: number,
    ) => {
        const time = `${date.getMinutes()} ${date.getHours()}`;

        if (dateOption === 'specific') {
            return `${time} ${date.getDate()} ${date.getMonth()} * */${interval}`;
        } else if (dateOption === 'last') {
            return `${time} L 1 * */${interval}`;
        } else {
            if (ordinal === 5) {
                return `${time} * ${date.getMonth()} ${date.getDay()}L */${interval}`;
            } else {
                return `${time} * ${date.getMonth()} ${date.getDay()}#${ordinal} */${interval}`;
            }
        }
    };

    const getCronjob = (rule: RecurrenceRule) => {
        if (rule.repeat === Repeat.none) return '';

        switch (rule.repeat) {
            case Repeat.daily:
                return getDailyCron(rule.interval);
            case Repeat.weekly:
                if (!rule.days) return '';
                return getWeeklyCron(rule.interval, rule.days);
            case Repeat.monthly:
                if (!rule.dateOption) return '';
                return getMonthlyCron(
                    rule.interval,
                    rule.dateOption,
                    rule.ordinal,
                );
            case Repeat.yearly:
                if (!rule.dateOption) return '';
                return getYearlyCron(
                    rule.interval,
                    rule.dateOption,
                    rule.ordinal,
                );
            default:
                return '';
        }
    };

    const calculateDailyEndDate = (interval: number, count: number) => {
        const endDate = new Date(date);
        const duration = interval * (count - 1);
        endDate.setDate(date.getDate() + duration);
        return formatFullDate(endDate, true);
    };

    const calculateWeeklyEndDate = (
        interval: number,
        count: number,
        days: number[],
    ) => {
        const daysNum = days.length;
        const lastStartDayOrder = (count - 1) % daysNum;
        const lastStartDayRepeatCnt = Math.ceil(count / daysNum);
        const lastStartDayIdx =
            (days.indexOf(date.getDay()) + lastStartDayOrder) % daysNum;

        let gap = days[lastStartDayIdx] - date.getDay();
        if (gap < 0) gap += 7 * interval;

        const endDate = new Date(date);
        const duration = gap + 7 * interval * (lastStartDayRepeatCnt - 1);
        endDate.setDate(date.getDate() + duration);
        return formatFullDate(endDate, true);
    };

    const calculateOrdinalEndDate = (endDate: Date, ordinal: number) => {
        if (ordinal === 5) {
            endDate.setMonth(endDate.getMonth() + 1, 0);
            let gap = endDate.getDay() - date.getDay();
            if (gap < 0) gap += 7;
            endDate.setDate(endDate.getDate() - gap);
        } else {
            endDate.setDate(1);
            let gap = date.getDay() - endDate.getDay();
            if (gap < 0) gap += 7;
            endDate.setDate(endDate.getDate() + gap + 7 * (ordinal - 1));
        }
    };

    const calculateMonthlyEndDate = (
        interval: number,
        count: number,
        dateOption: DateOption,
        ordinal?: number,
    ) => {
        const endDate = new Date(date);
        const duration = interval * (count - 1);
        endDate.setMonth(date.getMonth() + duration, 1);

        if (dateOption === 'specific') {
            endDate.setDate(date.getDate());
        } else if (dateOption === 'last') {
            endDate.setMonth(endDate.getMonth() + 1, 0);
        } else if (dateOption === 'ordinal') {
            if (!ordinal) return formatFullDate(date, true);
            calculateOrdinalEndDate(endDate, ordinal);
        }

        return formatFullDate(endDate, true);
    };

    const calculateYearlyEndDate = (
        interval: number,
        count: number,
        dateOption: DateOption,
        ordinal?: number,
    ) => {
        const endDate = new Date(date);
        const duration = interval * (count - 1);
        endDate.setFullYear(date.getFullYear() + duration, date.getMonth(), 1);

        if (dateOption === 'specific') {
            endDate.setDate(date.getDate());
        } else if (dateOption === 'last') {
            endDate.setMonth(3, 0); // last day of Feb (28 or 29)
        } else if (dateOption === 'ordinal') {
            if (!ordinal) return formatFullDate(date, true);
            calculateOrdinalEndDate(endDate, ordinal);
        }
        return formatFullDate(endDate, true);
    };

    const getEndDate = (rule: RecurrenceRule) => {
        if (rule.repeat === Repeat.none) return '';

        const temp = new Date(date);
        temp.setFullYear(
            date.getFullYear() + (rule.repeat === Repeat.yearly ? 5 : 1),
        );
        const defaultEndDate = formatFullDate(temp, true); // after 1 year (after 5 years for yearly schedule)

        switch (rule.stopCondition) {
            case 'until':
                if (!rule.until) return defaultEndDate;
                rule.until.setHours(date.getHours(), date.getMinutes());
                return formatFullDate(rule.until, true);

            case 'count':
                if (!rule.count) return defaultEndDate;
                switch (rule.repeat) {
                    case Repeat.daily:
                        return calculateDailyEndDate(rule.interval, rule.count);
                    case Repeat.weekly:
                        if (!rule.days) break;
                        return calculateWeeklyEndDate(
                            rule.interval,
                            rule.count,
                            rule.days,
                        );
                    case Repeat.monthly:
                        if (!rule.dateOption) break;
                        return calculateMonthlyEndDate(
                            rule.interval,
                            rule.count,
                            rule.dateOption,
                            rule.ordinal,
                        );
                    case Repeat.yearly:
                        if (!rule.dateOption) break;
                        return calculateYearlyEndDate(
                            rule.interval,
                            rule.count,
                            rule.dateOption,
                            rule.ordinal,
                        );
                }
                return formatFullDate(date, true);

            case 'never':
            default:
                return defaultEndDate;
        }
    };

    const changeRecurrenceRule = (newRule: RecurrenceRule, text: string) => {
        const newRecurrence: Recurrence = {
            isRecurring: newRule.repeat !== Repeat.none,
            cron_expr: getCronjob(newRule),
            recurring_end_at: getEndDate(newRule),
        };

        setRecurrence(newRecurrence);
        setRuleText(text);
        closeDropDown();
    };

    // reset recurrence rule when date changed
    useEffect(() => {
        changeRecurrenceRule(
            defaultRepeatOptions[0].rule,
            defaultRepeatOptions[0].text,
        );
    }, [date]);

    return (
        <DropDown dropDownRef={dropDownRef} style={{ width: 'fit-content' }}>
            <DropDownHeader style={{ width: 'fit-content', zIndex: '145' }}>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>{ruleText}</span>
                    <DropdownIcon className="icon" height="20px" />
                </button>
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: '40px',
                    height: '150px',
                    zIndex: '144',
                    overflow: 'auto',
                }}
            >
                <ul>
                    {defaultRepeatOptions.map(option => {
                        return (
                            <li
                                key={option.text}
                                onClick={() =>
                                    changeRecurrenceRule(
                                        option.rule,
                                        option.text,
                                    )
                                }
                            >
                                {option.text}
                            </li>
                        );
                    })}
                    <li
                        onClick={() => {
                            openModal(MODAL_NAMES.customRecurrence, {
                                date,
                                ordinal,
                                changeRecurrenceRule,
                            });
                            closeDropDown();
                        }}
                    >
                        맞춤 설정
                    </li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
