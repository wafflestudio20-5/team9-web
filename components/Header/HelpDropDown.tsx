import React, { useRef } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import HelpIcon from '@images/help_icon.svg';

export default function HelpDropDown() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        isOpen,
        dropDownRef,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <HelpIcon className="icon" height="24px" />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '150px' }}>
                <ul>
                    <li
                        onClick={() => {
                            window.open(
                                'https://github.com/wafflestudio20-5/team9-web/blob/main/README.md',
                            );
                            closeDropDown();
                        }}
                    >
                        도움말
                    </li>
                    <li onClick={closeDropDown}>학습센터</li>
                    <li
                        onClick={() => {
                            window.open(
                                'https://github.com/wafflestudio20-5/team9-web',
                            );
                            closeDropDown();
                        }}
                    >
                        업데이트
                    </li>
                </ul>
                <ul>
                    <li
                        onClick={() => {
                            window.open(
                                'https://github.com/wafflestudio20-5/team9-web/issues',
                            );
                            closeDropDown();
                        }}
                    >
                        J에게 의견 보내기
                    </li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
