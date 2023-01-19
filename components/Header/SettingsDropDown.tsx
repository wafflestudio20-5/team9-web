import { useRouter } from 'next/router';
import React, { useRef } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import SettingsIcon from '@images/settings_icon.svg';

export default function SettingsDropDown() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);
    const router = useRouter();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <SettingsIcon height="24px" className="icon" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    <li
                        onClick={() => {
                            router.push('/settings');
                        }}
                    >
                        설정
                    </li>
                    <li onClick={closeDropDown}>휴지통</li>
                </ul>
                <ul>
                    <li onClick={closeDropDown}>밀도 및 색상</li>
                    <li onClick={closeDropDown}>인쇄</li>
                </ul>
                <ul>
                    <li onClick={closeDropDown}>부가기능 설치하기</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
