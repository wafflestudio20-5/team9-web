import React from 'react';

import { useDropDown } from '../lib/hooks/useDropDown';

import DropDown from './DropDown';

export default function CalendarDropDown({ title }: { title: string }) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    return (
        <>
            <div ref={dropDownRef} style={{ height: '100%' }}>
                {/* temp */}
                <input type="text" placeholder={title} onClick={openDropDown} />

                <DropDown isOpen={isOpen}>
                    <div style={{ width: '100px', height: '100px' }}>
                        calendar component
                    </div>
                </DropDown>
            </div>
        </>
    );
}
