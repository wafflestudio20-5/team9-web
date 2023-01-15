import React, { Dispatch, SetStateAction, useRef } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';

interface SharingScopeDropDownProps {
    scope: string;
    setScope: Dispatch<SetStateAction<string>>;
}

export enum SharingScope {
    public = '전체공개',
    friend = '친구공개',
    private = '비공개',
}

export default function SharingScopeDropDown({
    scope,
    setScope,
}: SharingScopeDropDownProps) {
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
                    value={scope}
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
                    {Object.values(SharingScope).map(value => (
                        <li
                            key={value}
                            onClick={() => {
                                setScope(value);
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
