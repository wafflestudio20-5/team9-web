import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { useState, useRef } from 'react';
import styles from './AddFriendsDropDown.module.scss';
import axios from 'axios';
import account_default_icon from '@images/account_default_icon.svg';
import close_icon from '@images/close_icon.svg';
import Image from 'next/image';

export function AddFriendsDropDown() {
    const { dropDownRef, openDropDown, isOpen } = useDropDown();
    const [searchInput, setSearchInput] = useState('');
    const [selectedResults, setSelectedResults] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<
        { pk: number; email: string }[] | null
    >([
        { pk: 1, email: 'recent1' },
        { pk: 2, email: 'recent2' },
        { pk: 3, email: 'recent3' },
        { pk: 4, email: 'recent4' },
    ]); // for showing the most recent 4 search records
    // Specific implementation method is subject to discussion. Options include:
    // 1) GET Api when the AddFriendsDropDown component first mounts
    // 2) Save to localStorage every time a search happens -> get data from localStorage when component mounts
    const containerRef = useRef<HTMLDivElement | null>(null);
    // useRef to place suggestions dropdown directly below searchbox
    // needed b/c searchbox height changes according to the lenght of selectedResults

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader
                openDropDown={openDropDown}
                style={{ display: 'flex' }}
            >
                <div className={styles.container} ref={containerRef}>
                    {selectedResults.map((item, index) => {
                        return (
                            <div key={index} className={styles.selected}>
                                <Image src={account_default_icon} alt="image" />
                                <div>{item}</div>
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        console.log('button clicked');
                                        setSelectedResults(
                                            selectedResults.filter(i => {
                                                return i !== item;
                                            }),
                                        );
                                    }}
                                >
                                    <Image src={close_icon} alt="remove" />
                                </button>
                            </div>
                        );
                    })}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setSelectedResults([
                                ...selectedResults,
                                searchInput,
                            ]);
                            setSearchInput('');
                        }}
                    >
                        <input
                            value={searchInput}
                            onChange={e => {
                                e.preventDefault();
                                setSearchInput(e.target.value);
                                if (e.target.value !== '') {
                                    axios
                                        .get(
                                            `http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/search/candidate/?search=${e.target.value}`,
                                        )
                                        .then(res => setSuggestions(res.data))
                                        .catch(() => setSuggestions(null));
                                } else {
                                    setSuggestions([
                                        { pk: 1, email: 'recent1' },
                                        { pk: 2, email: 'recent2' },
                                        { pk: 3, email: 'recent3' },
                                        { pk: 4, email: 'recent4' },
                                    ]);
                                }
                            }}
                            className={styles.input}
                        />
                    </form>
                </div>
                <button>추가</button>
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: containerRef.current?.clientHeight,
                }}
            >
                <ul>
                    {suggestions ? (
                        suggestions?.map(item => {
                            return <li key={item.pk}>{item.email}</li>;
                        })
                    ) : (
                        <li>No results</li>
                    )}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
