import Image from 'next/image';
import React, { useState } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import dropdown_icon from '@images/dropdown_icon.svg';

export default function SearchCategoryDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();
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
            <DropDownHeader controlDropDown={openDropDown}>
                <button
                    type="button"
                    onClick={openDropDown}
                    style={buttonStyle}
                >
                    <span>{category}</span>
                    <Image
                        src={dropdown_icon}
                        height={17}
                        alt="search_category"
                    />
                </button>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
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
