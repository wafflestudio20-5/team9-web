import React, { Dispatch, SetStateAction, useRef, useState } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { Recurrence, RecurrenceRule, Repeat } from '@customTypes/ScheduleTypes';
import DropdownIcon from '@images/dropdown_icon.svg';

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
            : Math.floor((date.getDate() - 1) / 7) + 1;

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
        { rule: { repeat: Repeat.none, interval: 0 }, text: '반복 안 함' },
        { rule: { repeat: Repeat.daily, interval: 1 }, text: '매일' },
        {
            rule: { repeat: Repeat.weekly, interval: 1, days: [date.getDay()] },
            text: `매주 ${DAYS[date.getDay()]}요일`,
        },
        {
            rule: { repeat: Repeat.monthly, interval: 1, date: date.getDate() },
            text: `매월 ${date.getDate()}일`,
        },
        {
            rule: {
                repeat: Repeat.monthly,
                interval: 1,
                ordinal: ordinal.number,
                days: [date.getDay()],
            },
            text: `매월 ${ordinal.text} ${DAYS[date.getDay()]}요일`,
        },
        {
            rule: {
                repeat: Repeat.yearly,
                interval: 1,
                month: date.getMonth(),
                date: date.getDate(),
            },
            text: `매년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
        },
        {
            rule: {
                repeat: Repeat.yearly,
                interval: 1,
                month: date.getMonth(),
                ordinal: ordinal.number,
                days: [date.getDay()],
            },
            text: `매년 ${date.getMonth() + 1}월 ${ordinal.text} ${
                DAYS[date.getDay()]
            }요일`,
        },
    ];

    const getCronjob = (rule: RecurrenceRule) => {
        if (rule.repeat === Repeat.none) return '';
        return 'cronjob';
    };

    const getEndDate = (rule: RecurrenceRule) => {
        if (rule.repeat === Repeat.none) return '';
        return 'endDate';
    };

    const changeRecurrenceRule = (newRule: RecurrenceRule, text: string) => {
        const newRecurrence: Recurrence = {
            isRecurring: newRule.repeat !== Repeat.none,
            cronjob: getCronjob(newRule),
            endDate: getEndDate(newRule),
        };

        setRecurrence(newRecurrence);
        setRuleText(text);
        closeDropDown();
    };

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
