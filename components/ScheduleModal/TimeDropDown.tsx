import React, { useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { formatTime } from '@utils/formattings';

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
    const triggerRef = useRef<HTMLInputElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);

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
            <DropDownHeader>
                <input
                    type="text"
                    value={formatTime(time)}
                    placeholder={title}
                    readOnly
                    style={{ width: '75px' }}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                    ref={triggerRef}
                />
                <span className="underline" />
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
                <ul style={{ padding: '0' }}>
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
