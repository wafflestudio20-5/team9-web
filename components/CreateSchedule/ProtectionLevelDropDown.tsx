import React, { Dispatch, SetStateAction } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';

interface ProtectionLevelDropDownProps {
    protectionLevel: string;
    setProtectionLevel: Dispatch<SetStateAction<string>>;
}

export enum ProtectionLevel {
    public = '전체공개',
    follower = '친구공개',
    private = '비공개',
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
            <DropDownHeader style={{ zIndex: 140 }}>
                <input
                    type="text"
                    value={protectionLevel}
                    placeholder="공개 설정"
                    readOnly
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ width: '100px', top: '40px', zIndex: 130 }}
            >
                <ul style={{ padding: '0' }}>
                    {Object.values(ProtectionLevel).map(value => (
                        <li
                            key={value}
                            onClick={() => {
                                setProtectionLevel(value);
                                closeDropDown();
                            }}
                        >
                            {value}
                        </li>
                    ))}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
