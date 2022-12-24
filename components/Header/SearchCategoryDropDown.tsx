import React, { useState } from 'react';

import { useDropDown } from '../../lib/hooks/useDropDown';
import DropDown from '../DropDown';

export default function SearchCategoryDropDown() {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();
    const [category, setCategory] = useState<string>('사용 중인 캘린더');

    const changeCategory = () => {
        closeDropDown();
    };

    return (
        <>
            <div ref={dropDownRef} style={{ height: '100%' }}>
                <button type="button" onClick={openDropDown}>
                    <span>{category}</span>
                    <span>▾</span>
                </button>
                <DropDown isOpen={isOpen}>
                    <ul>
                        <li onClick={changeCategory}>사용 중인 캘린더</li>
                        <li onClick={changeCategory}>전체 캘린더</li>
                    </ul>
                    <ul>
                        <li onClick={changeCategory}>이것은</li>
                        <li onClick={changeCategory}>카테고리</li>
                    </ul>
                </DropDown>
            </div>
        </>
    );
}
