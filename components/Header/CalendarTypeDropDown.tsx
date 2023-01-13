import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';
import dropdown_icon from '@images/dropdown_icon.svg';

export default function CalendarTypeDropDown() {
    const {
        dropDownRef,
        dropDownHeaderButtonRef,
        isOpen,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    } = useDropDown();
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { calendarType } = useCalendarContext();
    const router = useRouter();

    const formatCalendarTypeToKr = (calendarType: CalendarType) => {
        switch (calendarType) {
            case CalendarType.day:
                return '일';
            case CalendarType.week:
                return '주';
            case CalendarType.month:
                return '월';
            case CalendarType.schedule:
                return '일정';
            default:
                return '캘린더';
        }
    };

    const getPathnameFromCalendarType = (calendarType: string) => {
        if (!(calendarType in CalendarType)) return '/';
        else if (!router.query.year) return `/${calendarType}/today`;
        else return `/${calendarType}/${yearNow}/${monthNow}/${dateNow}`;
    };

    const changeCalendarType = (calenderType: string) => {
        closeDropDown();
        const newPathname = getPathnameFromCalendarType(calenderType);
        router.push(newPathname);
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={toggleDropDown}>
                <button ref={dropDownHeaderButtonRef} onBlur={maintainFocus}>
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {formatCalendarTypeToKr(calendarType)}
                    </span>
                    <Image
                        src={dropdown_icon}
                        height={20}
                        alt="calender_type"
                    />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    <li onClick={() => changeCalendarType(CalendarType.day)}>
                        <span>일</span>
                        <span>D</span>
                    </li>
                    <li onClick={() => changeCalendarType(CalendarType.week)}>
                        <span>주</span>
                        <span>W</span>
                    </li>
                    <li onClick={() => changeCalendarType(CalendarType.month)}>
                        <span>월</span>
                        <span>M</span>
                    </li>
                    <li
                        onClick={() =>
                            changeCalendarType(CalendarType.schedule)
                        }
                    >
                        <span>일정</span>
                        <span>A</span>
                    </li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
