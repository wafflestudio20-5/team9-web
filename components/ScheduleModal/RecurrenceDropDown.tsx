import Image from 'next/image';
import React, { Dispatch, SetStateAction, useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { Recurrence, RecurType } from '@customTypes/ScheduleTypes';
import dropdown_icon from '@images/dropdown_icon.svg';
import { formatDayToKr } from '@utils/formatDay';

// 반복 안함, 매일, 매주 *요일, 매월 *일,매월 *번째 *요일, 매년 *월 *일, 맞춤 설정

interface RecurrenceDropDownProps {
    date: Date;
    recurrence: Recurrence;
    setRecurrence: Dispatch<SetStateAction<Recurrence>>;
}

export default function RecurrenceDropDown({
    date,
    recurrence,
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

    const getOrdinalNumberOfDay = (date: Date) => {
        let order;

        const nextWeek = new Date(date);
        nextWeek.setDate(date.getDate() + 7);
        if (date.getMonth() !== nextWeek.getMonth()) {
            order = ' 마지막';
        } else {
            const ordinalNumber = parseInt(`${(date.getDate() - 1) / 7}`) + 1;
            order = ordinalNumber === 1 ? '첫번째' : `${ordinalNumber}번째`;
        }

        return `매월 ${order} ${formatDayToKr(date.getDay())}요일`;
    };

    const RecurTypeText = (date: Date): { [key: number]: string } => ({
        [RecurType.none]: '반복 안 함',
        [RecurType.day]: '매일',
        [RecurType.week]: `매주 ${formatDayToKr(date.getDay())}요일`,
        [RecurType.ordinal]: getOrdinalNumberOfDay(date),
        [RecurType.month]: `매월 ${date.getDate()}일`,
        [RecurType.year]: `매년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
        [RecurType.custom]: '맞춤 설정',
    });

    const getCronjob = (recurType: RecurType) => {
        if (recurType === RecurType.none) return '';
        return 'cronjob';
    };

    const getEndDate = (recurType: RecurType) => {
        if (recurType === RecurType.none) return '';
        return 'endDate';
    };

    const changeRecurrenceSetting = (e: React.MouseEvent<HTMLLIElement>) => {
        if (!(e.target instanceof HTMLLIElement)) return;

        const type = Number(e.target.dataset['recurrence'] ?? RecurType.none);
        const content = e.target.innerText;
        const isRecurrent = type !== RecurType.none;
        const cronjob = getCronjob(type);
        const endDate = getEndDate(type);

        const recurInfo: Recurrence = {
            type,
            content,
            isRecurrent,
            cronjob,
            endDate,
        };

        setRecurrence(recurInfo);
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
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {recurrence.content}
                    </span>
                    <Image
                        src={dropdown_icon}
                        width={20}
                        alt="recurrence_option"
                    />
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
                    {Object.keys(RecurTypeText(date)).map(recurType => {
                        return (
                            <li
                                key={recurType}
                                data-recurrence={recurType}
                                onClick={changeRecurrenceSetting}
                            >
                                {RecurTypeText(date)[Number(recurType)]}
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
