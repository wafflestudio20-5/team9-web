import React, { useEffect, useRef, useState } from 'react';

import styles from './DropDown.module.scss';

interface DropDownProps {
    dropDownRef: React.ForwardedRef<HTMLDivElement>;
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
    controlDropDown(): void;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function DropDownHeader({
    controlDropDown,
    style,
    children,
}: DropDownHeaderProps) {
    return (
        <div
            className={styles.dropDownHeader}
            onClick={controlDropDown}
            style={style}
        >
            {children}
        </div>
    );
}

interface DropDownBodyProps {
    isOpen: boolean;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function DropDownBody({ isOpen, style, children }: DropDownBodyProps) {
    return (
        <div
            className={`${styles.dropDownBody} ${!isOpen && styles.closed}`}
            style={style}
        >
            {children}
        </div>
    );
}

export function useDropDown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const dropDownHeaderButtonRef = useRef<HTMLButtonElement>(null);
    const dropDownHeaderInputRef = useRef<HTMLInputElement>(null);

    const openDropDown = () => {
        setIsOpen(true);
    };

    const closeDropDown = () => {
        setIsOpen(false);
    };

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    };

    const maintainFocus = () => {
        if (isOpen) {
            dropDownHeaderButtonRef.current?.focus();
            dropDownHeaderInputRef.current?.focus();
        } else {
            dropDownHeaderButtonRef.current?.blur();
            dropDownHeaderInputRef.current?.blur();
        }
    };

    const onClickOuterArea = (e: MouseEvent) => {
        if (dropDownRef.current === null) return;

        if (dropDownRef.current.contains(e.target as Node)) {
            maintainFocus();
        } else {
            closeDropDown();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
        }
        maintainFocus();

        return () => {
            window.removeEventListener('click', onClickOuterArea);
        };
    }, [isOpen]);

    return {
        isOpen,
        dropDownRef,
        dropDownHeaderButtonRef,
        dropDownHeaderInputRef,
        openDropDown,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    };
}
