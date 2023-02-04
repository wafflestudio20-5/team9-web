import React, { useRef, useState } from 'react';

import {
    useDropDown,
    DropDown,
    DropDownBody,
    DropDownHeader,
} from '@components/DropDown';
import DropdownIcon from '@images/dropdown_icon.svg';

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
                    <DropdownIcon height="17px" className="icon" />
                </button>
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ width: '125px', top: '40px' }}
            >
                <ul>
                    <li onClick={changeCategory}>사용 중인 캘린더</li>
                    <li onClick={changeCategory}>전체 캘린더</li>
                </ul>
                <ul>
                    <li onClick={changeCategory}>이것도</li>
                    <li onClick={changeCategory}>장식</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
