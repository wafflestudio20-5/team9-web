import React from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';

export default function MiniCalendarDropDown({ title }: { title: string }) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input type="text" placeholder={title} onClick={openDropDown} />
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
                <div style={{ width: '250px', height: '150px' }}>
                    calendar component
                </div>
            </DropDownBody>
        </DropDown>
    );
}
