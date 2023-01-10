import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { useState, useRef, useEffect } from 'react';
import styles from './AddFriendsDropDown.module.scss';
import axios from 'axios';
import account_default_icon from '@images/account_default_icon.svg';
import close_icon from '@images/close_icon.svg';
import Image from 'next/image';
import useLocalStorage from '@hooks/useLocalStorage';

interface UserData {
    pk: number;
    username: string;
    email: string;
}

export function AddFriendsDropDown() {
    const { dropDownRef, openDropDown, closeDropDown, isOpen } = useDropDown();
    const { stored, setStored } = useLocalStorage<UserData[] | null>(
        'searchRecord_addFriend',
        null,
    );
    const [searchInput, setSearchInput] = useState('');
    const [selectedResults, setSelectedResults] = useState<UserData[]>([]);
    const [suggestions, setSuggestions] = useState<UserData[] | null>(
        stored ? stored : null,
    ); // for showing the most recent 4 search records
    // Specific implementation method is subject to discussion. Options include:
    // 1) GET Api when the AddFriendsDropDown component first mounts
    // 2) Save to localStorage every time a search happens -> get data from localStorage when component mounts
    const containerRef = useRef<HTMLDivElement | null>(null);
    // useRef to place suggestions dropdown directly below searchbox
    // needed b/c searchbox height changes according to the lenght of selectedResults

    const handleSubmit = (item: UserData | null) => {
        console.log(item);
        if (item) {
            setSelectedResults([...selectedResults, item]);
            const newSearchRecord = () => {
                if (stored) {
                    const sliced = stored.filter(i => {
                        return i.pk !== item.pk;
                    });
                    sliced.push(item);
                    return sliced.slice(-4);
                } else return [item];
            };
            setStored(newSearchRecord());
        }
        setSearchInput('');
        closeDropDown();
    };

    useEffect(() => {
        if (stored !== undefined) {
            setSuggestions(stored);
        }
    }, [stored]);

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={() => {}} style={{ display: 'flex' }}>
                <div className={styles.container} ref={containerRef}>
                    {selectedResults.map((item, index) => {
                        return (
                            <div key={index} className={styles.selected}>
                                <Image src={account_default_icon} alt="image" />
                                <div>{item['username']}</div>
                                <button
                                    onClick={e => {
                                        e.preventDefault();
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
                            handleSubmit(suggestions ? suggestions[0] : null);
                        }}
                    >
                        <input
                            value={searchInput}
                            onChange={e => {
                                e.preventDefault();
                                if (!isOpen) {
                                    openDropDown();
                                }
                                setSearchInput(e.target.value);
                                if (e.target.value !== '') {
                                    axios
                                        .get(
                                            `http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/search/candidate/?search=${e.target.value}`,
                                        )
                                        .then(res =>
                                            res.data.results.length !== 0
                                                ? setSuggestions(
                                                      res.data.results,
                                                  )
                                                : setSuggestions(null),
                                        )
                                        .catch(() => setSuggestions(null));
                                } else {
                                    setSuggestions(stored ? stored : null);
                                }
                            }}
                            onClick={openDropDown}
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
                        suggestions.slice(0, 4)?.map(item => {
                            return (
                                <li
                                    key={item.pk}
                                    onClick={() => handleSubmit(item)}
                                >
                                    {item.email}
                                </li>
                            );
                        })
                    ) : (
                        <li>No results</li>
                    )}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
