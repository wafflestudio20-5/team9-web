import React from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';

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

function Time({ hour, min }: { hour: number; min: number }) {
    return (
        <li>
            {hour}시 {min}분
        </li>
    );
}

export default function TimeDropDown({ title }: { title: string }) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input type="text" placeholder={title} onClick={openDropDown} />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ height: '150px', overflow: 'auto' }}
            >
                <ul style={{ width: '100px' }}>
                    {getTimeList().map((time, i) => {
                        return (
                            <li key={i}>
                                {time[0]}시 {time[1]}분
                            </li>
                        );
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
