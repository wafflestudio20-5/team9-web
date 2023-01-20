import Image from 'next/image';
import React, { Dispatch, SetStateAction, useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import {
    ProtectionLevel,
    ProtectionLevelText,
} from '@customTypes/ScheduleTypes';
import DropdownIcon from '@images/dropdown_icon.svg';

interface ProtectionLevelDropDownProps {
    protectionLevel: ProtectionLevel;
    setProtectionLevel: Dispatch<SetStateAction<ProtectionLevel>>;
}

export default function ProtectionLevelDropDown({
    protectionLevel,
    setProtectionLevel,
}: ProtectionLevelDropDownProps) {
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
            <DropDownHeader style={{ width: 'fit-content', zIndex: 120 }}>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {ProtectionLevelText[protectionLevel]}
                    </span>
                    <DropdownIcon height="20px" />
                </button>
                <span className="underline" />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ width: '100px', top: '40px', zIndex: 110 }}
            >
                <ul style={{ padding: '0' }}>
                    {Object.keys(ProtectionLevelText).map(lev => (
                        <li
                            key={lev}
                            onClick={() => {
                                setProtectionLevel(Number(lev));
                                closeDropDown();
                            }}
                        >
                            {ProtectionLevelText[Number(lev)]}
                        </li>
                    ))}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
