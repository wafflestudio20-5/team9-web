import React, { useEffect, useRef, useState } from 'react';

import styles from './DropDown.module.scss';

interface DropDownProps {
    dropDownRef: React.ForwardedRef<HTMLDivElement>; // pass `dropDownRef` in `useDropDown`
    children: React.ReactNode;
}

export function DropDown({ dropDownRef, children }: DropDownProps) {
    return (
        <>
            <div className={styles.dropDown} ref={dropDownRef} tabIndex={-1}>
                {children}
            </div>
        </>
    );
}

interface DropDownHeaderProps {
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function DropDownHeader({ style, children }: DropDownHeaderProps) {
    return (
        <div className={styles.dropDownHeader} style={style}>
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
     * pass `dropDownRef` to props of <DropDown> component (to detect outer area clicks)
     * pass `openDropDown` or `toggleDropDown` where you want (maybe to your trigger element)
     * pass `isOpen` to props of <DropDownBody> component (to activate and deactivate dropdown)
     *
     * (optional)
     * if you want to keep focus on your dropdown trigger element,
     *     1) pass `maintainFocus` function below to `onBlur` props of your trigger element
     *     2) create your triggerRef (using `useRef` of React) and pass it to `ref` props of your trigger element
     *     3) pass your triggerRef as a parameter of `closeModal`
     * CAUTION! if you use this option, you shouldn't pass `toggleDropDown` to `onFocus` props
     */

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const openDropDown = () => {
        setIsOpen(true);
    };

    const closeDropDown = (triggerRef?: React.RefObject<HTMLElement>) => {
        setIsOpen(false);
        triggerRef?.current?.blur();
    };

    const toggleDropDown = (e: React.MouseEvent<HTMLElement>) => {
        if (isOpen) {
            e.currentTarget.blur();
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    const maintainFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (dropDownRef.current?.contains(e.relatedTarget)) {
            e.target.focus();
        }
    };

    const onClickOuterArea = (e: MouseEvent) => {
        if (
            dropDownRef.current !== null &&
            !dropDownRef.current.contains(e.target as Node)
        ) {
            closeDropDown();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
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
