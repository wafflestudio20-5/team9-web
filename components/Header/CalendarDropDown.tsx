import React from 'react';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '../DropDown';

export default function CalendarDropDown({ title }: { title: string }) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                {/* temp */}
                <input type="text" placeholder={title} onClick={openDropDown} />
            </DropDownHeader>
            <DropDownBody isOpen={isOpen}>
                <div style={{ width: '100px', height: '100px' }}>
                    calendar component
                </div>
            </DropDownBody>
        </DropDown>
    );
}
