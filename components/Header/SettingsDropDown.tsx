import Image from 'next/image';
import React from 'react';

import settings_icon from '../../public/images/settings_icon.svg';
import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '../DropDown';

export default function SettingsDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <button onClick={openDropDown}>
                    <Image src={settings_icon} height={24} alt="settings" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
                <ul>
                    <li>설정</li>
                    <li>휴지통</li>
                </ul>
                <ul>
                    <li>밀도 및 색상</li>
                    <li>인쇄</li>
                </ul>
                <ul>
                    <li>부가기능 설치하기</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
