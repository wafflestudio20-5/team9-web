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
    date: Date;
    setDate(newDate: Date): void;
}

export default function TimeDropDown({
    title,
    date,
    setDate,
}: TimeDropDownProps) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    const getTimeList = () => {
        const hours = Array(24)
            .fill(0)
            .map((v, i) => i);
        const minutes = Array(4)
            .fill(0)
            .map((v, i) => i * 15);
        const times: number[][] = [];

        hours.forEach(h => {
            minutes.forEach(m => {
                times.push([h, m]);
            });
        });

        return times;
    };

    const changeTime = (newTime: number[]) => {
        const hour = newTime[0];
        const minute = newTime[1];
        const newDate = new Date(date);
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        setDate(newDate);
        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={formatTime(
                        date.getHours(),
                        date.getMinutes(),
                        false,
                    )}
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
                    {getTimeList().map((time, i) => {
                        return (
                            <li
                                key={i}
                                onClick={() => {
                                    changeTime(time);
                                }}
                            >
                                {formatTime(time[0], time[1], false)}
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
