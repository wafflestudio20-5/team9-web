import React, { Dispatch, SetStateAction } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { formatTime } from '@utils/formatTime';

interface Time {
    hour: number;
    minute: number;
}

interface TimeDropDownProps {
    title: string;
    time: Time;
    setTime: Dispatch<SetStateAction<Time>>;
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
        const times: number[][] = [];

        hours.forEach(h => {
            minutes.forEach(m => {
                times.push([h, m]);
            });
        });

        return times;
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={formatTime(time.hour, time.minute, false)}
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
                    height: '150px',
                    overflow: 'auto',
                    width: '115px',
                }}
            >
                <ul>
                    {getTimeList().map((t, i) => {
                        return (
                            <li
                                key={i}
                                onClick={() => {
                                    setTime({ hour: t[0], minute: t[1] });
                                    closeDropDown();
                                }}
                            >
                                {formatTime(t[0], t[1], false)}
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
