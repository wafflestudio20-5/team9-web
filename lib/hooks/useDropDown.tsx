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
        console.log('open');
        setIsOpen(!isOpen);
    };

    const closeDropDown = () => {
        console.log('close');
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', onClickOuterArea);
            console.log('added');
        }
        return () => {
            window.removeEventListener('click', onClickOuterArea);
            console.log('revmoed');
        };
    }, [isOpen]);

    return { dropDownRef, isOpen, openDropDown, closeDropDown };
}
