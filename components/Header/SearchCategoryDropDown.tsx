import Image from 'next/image';
import React, { useRef, useState } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import dropdown_icon from '@images/dropdown_icon.svg';

export default function SearchCategoryDropDown() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const {
        dropDownRef,
        isOpen,
        toggleDropDown,
        closeDropDown,
        maintainFocus,
    } = useDropDown(triggerRef);
    const [category, setCategory] = useState<string>('사용 중인 캘린더');

    const changeCategory = () => {
        closeDropDown();
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader>
                <button
                    type="button"
                    style={buttonStyle}
                    ref={triggerRef}
                    onClick={toggleDropDown}
                    onBlur={maintainFocus}
                >
                    <span>{category}</span>
                    <Image
                        src={dropdown_icon}
                        height={17}
                        alt="search_category"
                    />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ width: '125px' }}>
                <ul>
                    <li onClick={changeCategory}>사용 중인 캘린더</li>
                    <li onClick={changeCategory}>전체 캘린더</li>
                </ul>
                <ul>
                    <li onClick={changeCategory}>이것은</li>
                    <li onClick={changeCategory}>카테고리</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
