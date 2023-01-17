import React, { Dispatch, SetStateAction } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import {
    ProtectionLevel,
    ProtectionLevelText,
} from '@customTypes/CalendarTypes';

interface ProtectionLevelDropDownProps {
    protectionLevel: ProtectionLevel;
    setProtectionLevel: Dispatch<SetStateAction<ProtectionLevel>>;
}

export default function ProtectionLevelDropDown({
    protectionLevel,
    setProtectionLevel,
}: ProtectionLevelDropDownProps) {
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader style={{ zIndex: 120 }}>
                <input
                    type="text"
                    value={ProtectionLevelText[protectionLevel]}
                    placeholder="공개 설정"
                    readOnly
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                />
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
