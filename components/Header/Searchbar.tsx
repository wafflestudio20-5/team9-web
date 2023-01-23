import React, { FormEvent, useEffect, useRef, useState } from 'react';

import styles from './Searchbar.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import CloseIcon from '@images/close_icon.svg';
import DropdownIcon from '@images/dropdown_icon.svg';
import SearchIcon from '@images/search_icon.svg';

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

    const clearQuery = () => {
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
                    <SearchIcon height="24px" className="icon" />
                </button>
                <input
                    type="search"
                    value={query}
                    ref={inputRef}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="검색"
                    autoFocus
                />
                <button
                    type="button"
                    className={`${styles.clear} ${!query && styles.hidden}`}
                    onClick={clearQuery}
                >
                    <CloseIcon height="24px" className="icon" />
                </button>
                <button
                    type="button"
                    onClick={() => openModal(MODAL_NAMES.searchDetails)}
                >
                    <DropdownIcon height="24px" className="icon" />
                </button>
            </form>
        </div>
    );
}
