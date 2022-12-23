import Image from 'next/image';
import React from 'react';

import { useDropDown } from '../lib/hooks/useDropDown';
import help_icon from '../public/images/help_icon.svg';

import DropDown from './DropDown';

export default function HelpDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <>
            <div ref={dropDownRef} style={{ height: '100%' }}>
                <button onClick={openDropDown}>
                    <Image src={help_icon} height={25} alt="help" />
                </button>
                <DropDown isOpen={isOpen}>
                    <ul>
                        <li>도움말</li>
                        <li>학습 센터</li>
                        <li>업데이트</li>
                    </ul>
                    <ul>
                        <li>J에게 의견 보내기</li>
                    </ul>
                </DropDown>
            </div>
        </>
    );
}
