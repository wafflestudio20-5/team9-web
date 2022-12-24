import { useEffect, useRef, useState } from 'react';

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
