import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import dropdown_icon from '../../public/images/dropdown_icon.svg';
import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '../DropDown';

const CalendarType: { [key: string]: { name: string; path: string } } = {
    index: { name: 'index', path: '/' },
    month: { name: 'month', path: '/month' },
    schedule: { name: 'schedule', path: '/schedule' },
};

const getCalendarTypeFromPathname = (pathname: string) => {
    switch (pathname) {
        case CalendarType.month.path:
            return '월';
        case CalendarType.schedule.path:
            return '일정';
        default:
            return '캘린더';
    }
};

export default function CalendarTypeDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();
    const router = useRouter();

    const changeCalendarType = (option: string) => {
        closeDropDown();
        router.push(CalendarType[option]?.path || '/');
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
                    <li onClick={() => changeCalendarType('month')}>
                        <span>월</span>
                        <span>M</span>
                    </li>
                    <li onClick={() => changeCalendarType('schedule')}>
                        <span>일정</span>
                        <span>A</span>
                    </li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
