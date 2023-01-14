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

export function useDropDown(triggerRef?: React.RefObject<HTMLElement>) {
    /**
     * pass `dropDownRef` to props of <DropDown> component (to detect outer area clicks)
     * pass `openDropDown` or `toggleDropDown` to `controlDropDown` props of <DropDownHeader> component
     *      then you can open or toggle dropdown by clicking dropdown header
     * pass `isOpen` to props of <DropDownBody> component (to activate or deactivate dropdown)
     *
     * (optional)
     * if you want to keep focus on your dropdown trigger element,
     *      1) create your ref object
     *      2) pass it to `ref` props of your trigger element
     *      3) pass it to parameter(`triggerRef`) of `useDropDown`
     *      4) pass `maintainFocus` function below to `onBlur` props of your trigger element
     */

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const openDropDown = () => {
        setIsOpen(true);
    };

    const closeDropDown = () => {
        setIsOpen(false);
    };

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    };

    // focus the dropdown trigger element in dropdown header
    const focusTriggerElement = () => {
        triggerRef?.current?.focus();
    };

    // blur the dropdown trigger element in dropdown header
    const blurTriggerElement = () => {
        triggerRef?.current?.blur();
    };

    // keep focus on the dropdown trigger element in dropdown header
    const maintainFocus = () => {
        if (isOpen) focusTriggerElement();
    };

    const onClickOuterArea = (e: MouseEvent) => {
        if (dropDownRef.current === null) return;

        // if clicked area is included in dropdown, keep focus on the trigger element
        if (dropDownRef.current.contains(e.target as Node)) {
            focusTriggerElement();
        } else {
            closeDropDown();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
        } else {
            blurTriggerElement();
        }

        return () => {
            window.removeEventListener('click', onClickOuterArea);
        };
    }, [isOpen]);

    return {
        isOpen,
        dropDownRef,
        openDropDown,
        closeDropDown,
        toggleDropDown,
        maintainFocus,
    };
}
