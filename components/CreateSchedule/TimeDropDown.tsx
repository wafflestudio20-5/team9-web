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
    changeTime(newTime: Date): void;
}

export default function TimeDropDown({
    title,
    time,
    changeTime,
}: TimeDropDownProps) {
    const { isOpen, dropDownRef, openDropDown, closeDropDown } = useDropDown();

    const getTimeList = () =>
        Array(24 * 4)
            .fill(0)
            .map((v, i) => {
                const newDate = new Date(time);
                newDate.setHours(0, i * 15);
                return newDate;
            });

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader controlDropDown={openDropDown}>
                <input
                    type="text"
                    value={formatTime(time)}
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
                                    changeTime(newTime);
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
