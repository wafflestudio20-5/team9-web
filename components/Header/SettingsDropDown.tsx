import Image from 'next/image';
import React, { useRef } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import settings_icon from '@images/settings_icon.svg';

export default function SettingsDropDown() {
    const {
        isOpen,
        dropDownRef,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button onClick={toggleDropDown} onBlur={maintainFocus}>
                    <Image src={settings_icon} height={24} alt="settings" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    <li onClick={closeDropDown}>설정</li>
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
