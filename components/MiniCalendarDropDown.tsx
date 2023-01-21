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
    disabled?: boolean;
    bodyStyle?: React.CSSProperties;
}

export default function MiniCalendarDropDown({
    title,
    date,
    changeDate,
    disabled,
    bodyStyle,
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
                    disabled={disabled}
                />
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={bodyStyle || { top: '40px', width: '250px' }}
            >
                <MiniCalendar
                    dateVariable={date}
                    onDateClickFunction={onChangeDate}
                />
            </DropDownBody>
        </DropDown>
    );
}
