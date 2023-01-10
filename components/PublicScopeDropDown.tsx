import React, { Dispatch, SetStateAction } from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';

interface PublicScopeDropDownProps {
    scope: string;
    setScope: Dispatch<SetStateAction<string>>;
}

enum PublicScope {
    public = '전체공개',
    friend = '친구공개',
    private = '비공개',
}

export default function PublicScopeDropDown({
    scope,
    setScope,
}: PublicScopeDropDownProps) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={scope}
                    onClick={openDropDown}
                    placeholder="공개 설정"
                    readOnly
                />
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
                <ul style={{ width: '100px' }}>
                    {Object.values(PublicScope).map(value => (
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
