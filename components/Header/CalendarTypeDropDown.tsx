import { useRouter } from 'next/router';
import React from 'react';

import { useDropDown } from '../../lib/hooks/useDropDown';
import DropDown from '../DropDown';

const PageOption: { [key: string]: { name: string; path: string } } = {
    index: { name: 'index', path: '/' },
    month: { name: 'month', path: '/month' },
    schedule: { name: 'schedule', path: '/schedule' },
};

const getCalendarTypeFromPathname = (pathname: string) => {
    switch (pathname) {
        case PageOption.month.path:
            return '월';
        case PageOption.schedule.path:
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
        router.push(PageOption[option]?.path || '/');
    };

    return (
        <>
            <div ref={dropDownRef} style={{ height: '100%' }}>
                <button onClick={openDropDown}>
                    <span>
                        {getCalendarTypeFromPathname(router.pathname)}
                        {/* 캘린더 */}
                    </span>
                    <span>▾</span>
                </button>
                <DropDown isOpen={isOpen}>
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
                </DropDown>
            </div>
        </>
    );
}
