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
    const [isFocused, setIsFocused] = useState<boolean>(false);
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
        console.log('maintain', dropDownHeaderButtonRef);
        if (isOpen) {
            console.log('focus', dropDownHeaderButtonRef);
            dropDownHeaderButtonRef.current?.focus();
            dropDownHeaderInputRef.current?.focus();
        } else {
            dropDownHeaderButtonRef.current?.blur();
            dropDownHeaderInputRef.current?.blur();
        }
    };

    const toggleFocus = () => {
        if (isFocused) {
            dropDownHeaderButtonRef.current?.blur();
            setIsFocused(false);
        } else {
            dropDownHeaderButtonRef.current?.focus();
            setIsFocused(true);
        }
    };

    const onClickOuterArea = (e: MouseEvent) => {
        console.log('click', dropDownHeaderButtonRef);
        if (dropDownRef.current === null) return;

        if (dropDownRef.current.contains(e.target as Node)) {
            dropDownHeaderButtonRef.current?.focus();
            dropDownHeaderInputRef.current?.focus();
        } else {
            console.log('outer', dropDownHeaderButtonRef);
            closeDropDown();
        }
    };

    useEffect(() => {
        if (isFocused) {
            openDropDown();
        } else {
            closeDropDown();
        }
    }, [isFocused]);

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
        toggleFocus,
    };
}
