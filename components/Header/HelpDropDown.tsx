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
    const {
        isOpen,
        dropDownRef,
        dropDownHeaderButtonRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={toggleDropDown}>
                <button
                    ref={dropDownHeaderButtonRef}
                    onBlur={maintainFocus}
                    className="helpbutton"
                >
                    <Image src={help_icon} height={24} alt="help" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    {['도움말', '학습센터', '업데이트'].map((v, i) => (
                        <li key={i} onClick={closeDropDown}>
                            {v}
                        </li>
                    ))}
                </ul>
                <ul>
                    <li>J에게 의견 보내기</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
