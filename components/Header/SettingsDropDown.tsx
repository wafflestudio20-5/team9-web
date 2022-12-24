import Image from 'next/image';
import React from 'react';

import { useDropDown } from '../../lib/hooks/useDropDown';
import settings_icon from '../../public/images/settings_icon.svg';
import DropDown from '../DropDown';

export default function SettingsDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <div ref={dropDownRef} style={{ height: '100%' }}>
            <button onClick={openDropDown}>
                <Image src={settings_icon} height={25} alt="settings" />
            </button>
            <DropDown isOpen={isOpen}>
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
            </DropDown>
        </div>
    );
}
