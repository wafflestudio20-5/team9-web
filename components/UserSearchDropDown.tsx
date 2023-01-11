import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { useState, useRef, useEffect } from 'react';
import styles from './UserSearchDropDown.module.scss';
import axios from 'axios';
import account_default_icon from '@images/account_default_icon.svg';
import close_icon from '@images/close_icon.svg';
import Image from 'next/image';
import useLocalStorage from '@hooks/useLocalStorage';
import updateSequence from '@utils/updateSequence';

interface UserSearchDropDownProps {
    toExecute: (item: UserDataForSearch) => void;
    buttonText: string;
    width?: string; // custom width when used elsewhere
    underlineColor?: string;
}

export function UserSearchDropDown({
    toExecute,
    buttonText,
    width,
    underlineColor,
}: UserSearchDropDownProps) {
    const { dropDownRef, openDropDown, closeDropDown, isOpen } = useDropDown();
    const { stored, setStored } = useLocalStorage<UserDataForSearch[] | null>(
        'searchRecord_addFriend',
        null,
    );
    const [searchInput, setSearchInput] = useState('');
    const [selectedResults, setSelectedResults] = useState<
        UserDataForSearch[] | null
    >([]);
    const [suggestions, setSuggestions] = useState<UserDataForSearch[] | null>(
        stored ? stored : null, // handle undefined
    );
    const [underline, setUnderline] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    // useRef to place suggestions dropdown directly below searchbox
    // needed b/c searchbox height changes according to the lenght of selectedResults

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!isOpen) {
            openDropDown(); // to tackle case of continuous search wihtout clicking again
        }
        setSearchInput(e.target.value);
        if (e.target.value !== '') {
            axios
                .get(
                    `http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/search/candidate/?search=${e.target.value}`,
                )
                .then(res =>
                    res.data.results.length !== 0
                        ? setSuggestions(res.data.results)
                        : setSuggestions(null),
                )
                .catch(() => setSuggestions(null));
        } else {
            setSuggestions(stored ? stored : null);
        }
    };

    const handleSubmit = (item: UserDataForSearch | null) => {
        if (item) {
            const newSelectedResults = updateSequence<UserDataForSearch>({
                sequence: selectedResults,
                getUniqueKey: x => {
                    return x.pk;
                },
                itemToAdd: item,
                sorted: false,
            });
            setSelectedResults(newSelectedResults);
            const newSearchRecord = updateSequence<UserDataForSearch>({
                sequence: stored,
                getUniqueKey: x => {
                    return x.pk;
                },
                itemToAdd: item,
                maxLength: 4,
            });
            setStored(newSearchRecord);
        }
        setSearchInput('');
        closeDropDown();
    };

    useEffect(() => {
        if (stored !== undefined) {
            setSuggestions(stored);
        }
    }, [stored]);

    const executeAction = () => {
        if (selectedResults) {
            selectedResults.map(item => toExecute(item));
        }
        setSelectedResults(null);
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={() => {}} style={{ display: 'flex' }}>
                {/* openDropDown does nothing here to prevent dropdown expanding when removing items from selectedResults */}
                <div
                    className={styles.container}
                    ref={containerRef}
                    style={width ? { width: width } : { flexGrow: 1 }}
                >
                    {selectedResults?.map((item, index) => {
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
                                handleChange(e);
                            }}
                            className={styles.input}
                            placeholder="사용자 검색..."
                            onFocus={() => {
                                setUnderline(true);
                                openDropDown();
                            }}
                            onBlur={() => {
                                setUnderline(false);
                            }}
                        />
                    </form>
                    <div
                        className={
                            underline
                                ? `${styles.underline} ${styles.expand}`
                                : `${styles.underline}`
                        }
                        style={{ backgroundColor: underlineColor }}
                    />
                </div>
                <button onClick={executeAction}>{buttonText}</button>
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{
                    top: containerRef.current?.offsetHeight,
                    width: containerRef.current?.offsetWidth,
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
                        <li>No results...</li>
                    )}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
