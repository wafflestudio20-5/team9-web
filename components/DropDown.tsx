import React, { useEffect, useRef, useState } from 'react';

import styles from './DropDown.module.scss';

interface DropDownProps {
    dropDownRef: React.LegacyRef<HTMLDivElement>;
    children: React.ReactNode;
}

export function DropDown({ dropDownRef, children }: DropDownProps) {
    return (
        <>
            <div className={styles.dropDown} ref={dropDownRef}>
                {children}
            </div>
        </>
    );
}

interface DropDownHeaderProps {
    openDropDown(): void;
    children: React.ReactNode;
}

export function DropDownHeader({
    openDropDown,
    children,
}: DropDownHeaderProps) {
    return (
        <div className={styles.dropDownHeader} onClick={openDropDown}>
            {children}
        </div>
    );
}

interface DropDownBodyProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export function DropDownBody({ isOpen, children }: DropDownBodyProps) {
    return (
        <div className={`${styles.dropDownBody} ${!isOpen && styles.closed}`}>
            {children}
        </div>
    );
}

export function useDropDown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const onClickOuterArea = (e: MouseEvent) => {
        if (
            dropDownRef.current !== null &&
            !dropDownRef.current.contains(e.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    const openDropDown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropDown = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
        }
        return () => {
            window.removeEventListener('click', onClickOuterArea);
        };
    }, [isOpen]);

    return { dropDownRef, isOpen, openDropDown, closeDropDown };
}
