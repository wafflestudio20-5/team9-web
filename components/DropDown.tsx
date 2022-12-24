import React from 'react';

import styles from './DropDown.module.scss';

interface DropDownProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export default function DropDown({ isOpen, children }: DropDownProps) {
    const dropDownClass = () => (isOpen ? styles.open : styles.closed);

    return (
        <div className={`${styles.dropDown} ${dropDownClass()}`}>
            {children}
        </div>
    );
}
