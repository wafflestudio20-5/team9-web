import Image from 'next/image';
import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import { MODAL_NAMES, useModal } from '../../contexts/ModalContext';
import close_icon from '../../public/images/close_icon.svg';
import dropdown_icon from '../../public/images/dropdown_icon.svg';
import search_icon from '../../public/images/search_icon.svg';

import styles from './Searchbar.module.scss';

interface SearchbarProps {
    isOpen: boolean;
    close(): void;
}

export default function Searchbar({ isOpen, close }: SearchbarProps) {
    const { getState, openModal } = useModal();
    const searchRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<string>('');

    const searchSchedule = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const resetQuery = () => {
        setQuery('');
        if (inputRef !== null) inputRef.current?.focus();
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
        if (isOpen && getState(MODAL_NAMES.searchDetails) === 'closed') {
            window.addEventListener('click', onClickOuterArea);
        }
        return () => {
            window.removeEventListener('click', onClickOuterArea);
        };
    }, [isOpen, getState]);

    if (!isOpen) return null;

    return (
        <div className={styles.searchbar}>
            <form
                className={styles.search}
                ref={searchRef}
                onSubmit={searchSchedule}
            >
                <button>
                    <Image src={search_icon} height={24} alt="search" />
                </button>
                <input
                    type="search"
                    value={query}
                    ref={inputRef}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="검색"
                    autoFocus
                />
                <button type="button" onClick={resetQuery}>
                    <Image src={close_icon} height={24} alt="reset_search" />
                </button>
                <button
                    type="button"
                    onClick={() => openModal(MODAL_NAMES.searchDetails)}
                >
                    <Image
                        src={dropdown_icon}
                        height={24}
                        alt="detailed_search"
                    />
                </button>
            </form>
        </div>
    );
}
