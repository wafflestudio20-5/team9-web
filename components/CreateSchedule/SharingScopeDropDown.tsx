import React, { Dispatch, SetStateAction } from 'react';

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
        dropDownHeaderInputRef,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={toggleDropDown}>
                <input
                    type="text"
                    value={scope}
                    placeholder="공개 설정"
                    readOnly
                    ref={dropDownHeaderInputRef}
                    onBlur={maintainFocus}
                />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ width: '100px', top: '40px' }}
            >
                <ul>
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
