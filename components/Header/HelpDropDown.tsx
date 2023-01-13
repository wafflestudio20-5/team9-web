import Image from 'next/image';
import React from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import help_icon from '@images/help_icon.svg';

export default function HelpDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <button onClick={openDropDown}>
                    <Image src={help_icon} height={24} alt="help" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    <li>도움말</li>
                    <li>학습 센터</li>
                    <li>업데이트</li>
                </ul>
                <ul>
                    <li>J에게 의견 보내기</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
