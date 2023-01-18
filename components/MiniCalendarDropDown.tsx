import React, { useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import MiniCalendar from '@components/MiniCalendar';

interface MiniCalendarDropDownProps {
    title: string;
    date: Date;
    changeDate(newDate: Date): void;
}

export default function MiniCalendarDropDown({
    title,
    date,
    changeDate,
}: MiniCalendarDropDownProps) {
    const triggerRef = useRef<HTMLInputElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);

    const onChangeDate = (newDate: Date) => {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        changeDate(newDate);
        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <input
                    type="text"
                    value={`${date.getFullYear()}년 ${
                        date.getMonth() + 1
                    }월 ${date.getDate()}일`}
                    placeholder={title}
                    readOnly
                    style={{ width: '120px' }}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                    ref={triggerRef}
                />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ top: '40px', width: '250px' }}
            >
                <MiniCalendar
                    dateVariable={date}
                    onDateClickFunction={onChangeDate}
                />
            </DropDownBody>
        </DropDown>
    );
}
