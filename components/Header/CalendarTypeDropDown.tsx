import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { useDateContext } from '../../contexts/DateContext';
import dropdown_icon from '../../public/images/dropdown_icon.svg';
import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '../DropDown';

export enum CalendarType {
    index = 'index',
    day = 'day',
    week = 'week',
    month = 'month',
    schedule = 'schedule',
}

export default function CalendarTypeDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();
    const { yearNow, monthNow, dateNow } = useDateContext();
    const router = useRouter();

    const getCalendarTypeFromPathname = (pathname: string) => {
        const regex = /(?<=\/)[^[]*?(?=\/)/g;
        const calendarType = pathname.match(regex);
        if (!calendarType) return '캘린더';
        switch (calendarType[0]) {
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
        return `/${calendarType}/${yearNow}/${monthNow}/${dateNow}`;
    };

    const changeCalendarType = (calenderType: string) => {
        closeDropDown();
        const newPathname = getPathnameFromCalendarType(calenderType);
        router.push(newPathname);
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <button>
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {getCalendarTypeFromPathname(router.pathname)}
                    </span>
                    <Image
                        src={dropdown_icon}
                        height={20}
                        alt="calender_type"
                    />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
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
