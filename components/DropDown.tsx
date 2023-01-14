import React, { useEffect, useRef, useState } from 'react';

import styles from './DropDown.module.scss';

interface DropDownProps {
    dropDownRef: React.ForwardedRef<HTMLDivElement>; // pass `dropDownRef` in `useDropDown`
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
    controlDropDown(): void; // pass `openDropDown` or `toggleDropDown` in `useDropDown`
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
    isOpen: boolean; // pass `isOpen` in `useDropDown`
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
    /**
     * pass `dropDownRef` as props to <DropDown> component (to detect outer area clicks)
     * pass `openDropDown` or `toggleDropDown` as `controlDropDown` props to <DropDownHeader> component
     *      then you can open or toggle dropdown by clicking dropdown header
     * pass `isOpen` as props to <DropDownBody> component (to activate or deactivate dropdown)
     *
     * (optional)
     * if you want to keep focus on your dropdown trigger button,
     *      1) pass `dropDownHeaderButtonRef` below as `ref` props to your trigger button
     *      2) and pass `maintainFocus` function below as `onBlur` props to your trigger button
     *      caution! trigger button should be <button> element
     * if you want to keep focus on your dropdown trigger input,
     *      1) pass `dropDownHeaderInputRef` below as `ref` props to your trigger input
     *      2) and pass `maintainFocus` function below as `onBlur` props to your trigger input
     *      caution! trigger input should be <input> element
     */

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const dropDownHeaderButtonRef = useRef<HTMLButtonElement>(null); // ref for dropdown trigger <button> element
    const dropDownHeaderInputRef = useRef<HTMLInputElement>(null); // ref for dropdown trigger <input> element

    const openDropDown = () => {
        setIsOpen(true);
    };

    const closeDropDown = () => {
        setIsOpen(false);
    };

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    };

    // focus the dropdown trigger element(button or input) in dropdown header
    const focusHeader = () => {
        dropDownHeaderButtonRef.current?.focus();
        dropDownHeaderInputRef.current?.focus();
    };

    // blur the dropdown trigger element(button or input) in dropdown header
    const blurHeader = () => {
        dropDownHeaderButtonRef.current?.blur();
        dropDownHeaderInputRef.current?.blur();
    };

    // keep focus on the dropdown trigger element(button or input) in dropdown header
    const maintainFocus = () => {
        if (isOpen) focusHeader();
    };

    const onClickOuterArea = (e: MouseEvent) => {
        if (dropDownRef.current === null) return;

        // if clicked area is included in dropdown, keep focus on the trigger element
        if (dropDownRef.current.contains(e.target as Node)) {
            focusHeader();
        } else {
            closeDropDown();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
        } else {
            blurHeader();
        }

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
