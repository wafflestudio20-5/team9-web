import React from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { formatTime } from '@utils/formatTime';

interface TimeDropDownProps {
    title: string;
    time: Date;
    setTime(newTime: Date): void;
}

export default function TimeDropDown({
    title,
    time,
    setTime,
}: TimeDropDownProps) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    const getTimeList = () => {
        const hours = Array(24)
            .fill(0)
            .map((v, i) => i);
        const minutes = Array(4)
            .fill(0)
            .map((v, i) => i * 15);
        const times: Date[] = [];

        hours.forEach(h => {
            minutes.forEach(m => {
                const newDate = new Date(time);
                newDate.setHours(h);
                newDate.setMinutes(m);
                times.push(newDate);
            });
        });

        return times;
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={formatTime(time)}
                    onClick={openDropDown}
                    placeholder={title}
                    readOnly
                    style={{ width: '75px' }}
                />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: '40px',
                    width: '115px',
                    height: '150px',
                    overflow: 'auto',
                }}
            >
                <ul>
                    {getTimeList().map((newTime, i) => {
                        return (
                            <li
                                key={i}
                                onClick={() => {
                                    setTime(newTime);
                                    closeDropDown();
                                }}
                            >
                                {formatTime(newTime)}
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
