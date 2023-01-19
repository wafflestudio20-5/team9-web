import Image from 'next/image';
import React, { Dispatch, SetStateAction, useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import { Recurrence, RecurType } from '@customTypes/ScheduleTypes';
import dropdown_icon from '@images/dropdown_icon.svg';

// 반복 안함, 매일, 매주 *요일, 매월 *일,매월 *번째 *요일, 매년 *월 *일, 맞춤 설정

interface RecurrenceDropDownProps {
    date: Date;
    recurrence: Recurrence;
    setRecurrence: Dispatch<SetStateAction<Recurrence>>;
}

export default function RecurrenceDropDown({
    date,
    recurrence,
    setRecurrence,
}: RecurrenceDropDownProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);

    return (
        <DropDown dropDownRef={dropDownRef} style={{ width: 'fit-content' }}>
            <DropDownHeader style={{ width: 'fit-content', zIndex: '145' }}>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {recurrence.content}
                    </span>
                    <Image
                        src={dropdown_icon}
                        width={20}
                        alt="recurrence_option"
                    />
                </button>
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: '40px',
                    height: '150px',
                    zIndex: '144',
                    overflow: 'auto',
                }}
            >
                <ul>
                    <li>반복 안 함</li>
                    <li>매일</li>
                    <li>매주 *요일</li>
                    <li>매월 며칠</li>
                    <li>매월 *번째 *요일</li>
                    <li>매년 *월 *일</li>
                    <li>맞춤 설정</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
