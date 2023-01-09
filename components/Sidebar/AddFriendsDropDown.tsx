import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { useState, useRef } from 'react';
import styles from './AddFriendsDropDown.module.scss';
import axios from 'axios';

export function AddFriendsDropDown() {
    const { dropDownRef, openDropDown, isOpen } = useDropDown();
    const [searchInput, setSearchInput] = useState('');
    const [selectedResults, setSelectedResults] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[] | null>([
        'last1',
        'last2',
        'last3',
        'last4',
    ]); // for showing the most recent 4 search records
    // Specific implementation method is subject to discussion. Options include:
    // 1) GET Api when the AddFriendsDropDown component first mounts
    // 2) Save to localStorage every time a search happens -> get data from localStorage when component mounts
    const formRef = useRef<HTMLFormElement | null>(null);
    // useRef to place suggestions dropdown directly below searchbox
    // needed b/c searchbox height changes according to the lenght of selectedResults

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <form
                    className={styles.container}
                    onSubmit={e => {
                        e.preventDefault();
                        setSelectedResults([...selectedResults, searchInput]);
                        setSearchInput('');
                    }}
                    ref={formRef}
                >
                    {selectedResults.map((item, index) => {
                        return <div key={index}>{`chosen ${index}`}</div>;
                    })}
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
                                    .catch(() =>
                                        setSuggestions(['no results']),
                                    );
                            } else {
                                setSuggestions([
                                    'last1',
                                    'last2',
                                    'last3',
                                    'last4',
                                ]);
                            }
                        }}
                        className={styles.input}
                    />
                </form>
                <button>추가</button>
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: formRef.current?.clientHeight,
                }}
            >
                <ul>
                    {suggestions?.map((item, index) => {
                        return <li key={index}>{item}</li>;
                    })}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
