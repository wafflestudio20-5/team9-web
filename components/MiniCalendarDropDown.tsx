import React from 'react';

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
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    const onChangeDate = (newDate: Date) => {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        changeDate(newDate);
        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={`${date.getFullYear()}년 ${
                        date.getMonth() + 1
                    }월 ${date.getDate()}일`}
                    onClick={openDropDown}
                    placeholder={title}
                    readOnly
                    style={{ width: '120px' }}
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
