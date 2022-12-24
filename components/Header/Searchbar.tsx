import Image from 'next/image';
import React, { FormEvent, useEffect, useRef } from 'react';

import { MODAL_NAMES, useModal } from '../../contexts/ModalContext';
import search_icon from '../../public/images/search_icon.svg';

import styles from './Searchbar.module.scss';

interface SearchbarProps {
    isOpen: boolean;
    close(): void;
}

export default function Searchbar({ isOpen, close }: SearchbarProps) {
    const { openModal } = useModal();
    const searchRef = useRef<HTMLDivElement>(null);

    const searchSchedule = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const onClickOuterArea = (e: MouseEvent) => {
        if (
            searchRef.current !== null &&
            !searchRef.current.contains(e.target as Node)
        ) {
            close();
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

    return (
        <>
            <div className={styles.searchbar} ref={searchRef}>
                <form className={styles.search} onSubmit={searchSchedule}>
                    <button>
                        <Image src={search_icon} height={25} alt="search" />
                    </button>
                    <input type="text" placeholder="검색" autoFocus />
                    <button
                        type="button"
                        onClick={() => openModal(MODAL_NAMES.search)}
                    >
                        ▾
                    </button>
                </form>
            </div>
        </>
    );
}
