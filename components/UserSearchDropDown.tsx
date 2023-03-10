import React, { useState, useRef, useEffect } from 'react';

import styles from './UserSearchDropDown.module.scss';

import { searchUserAPI } from '@apis/social';
import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { UserDataForSearch } from '@customTypes/UserTypes';
import useLocalStorage from '@hooks/useLocalStorage';
import AccountDefaultIcon from '@images/account_default_icon.svg';
import CloseIcon from '@images/close_icon.svg';
import updateSequence from '@utils/updateSequence';

interface UserSearchDropDownProps {
    toExecute: (item: UserDataForSearch) => void;
    interceptResult?: (result: UserDataForSearch[]) => void;
    buttonText: string;
    width?: string; // custom width when used elsewhere
    underlineColor?: string;
    resetOnExecution?: boolean;
    submitButtonNotRequired?: boolean;
    placeholder?: string;
    getImage?: boolean;
}

export function UserSearchDropDown({
    toExecute,
    interceptResult,
    buttonText,
    width,
    underlineColor,
    resetOnExecution,
    submitButtonNotRequired,
    placeholder,
    getImage,
}: UserSearchDropDownProps) {
    const { dropDownRef, openDropDown, closeDropDown, isOpen } = useDropDown();

    const { stored, setStored } = useLocalStorage<UserDataForSearch[] | null>(
        'searchRecord_addFriend',
        null,
    );
    // state variables for saving search records in localStorage

    const [searchInput, setSearchInput] = useState('');
    // controlled input

    const [selectedResults, setSelectedResults] = useState<
        UserDataForSearch[] | null
    >([]);
    // items selected before pressing the final button and executing whatever function that needs to be executed
    // displayed in the container as rounded rectangular items
    // conceptually similar to staging files

    const [suggestions, setSuggestions] = useState<UserDataForSearch[] | null>(
        stored ? stored : null, // handle undefined
    ); // suggestions for the dropdown.
    // only stores the upmost 4 values, as only up to 4 suggestions are displayed at once

    const containerRef = useRef<HTMLDivElement | null>(null);
    // useRef to place suggestions dropdown directly below searchbox
    // needed b/c searchbox height and width changes
    // see below where this ref is used for more details

    useEffect(() => {
        // set suggestions to match stored search records when 'stored' changes
        // this is equivalent to the union of the following two instances:
        // 1) component mounts and stored is initialized
        // 2) user submits input box (== makes a search entry)
        if (stored !== undefined) {
            setSuggestions(stored);
        }
    }, [stored]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!isOpen) {
            openDropDown(); // to tackle case of continuous search wihtout clicking again
        }
        setSearchInput(e.target.value);
        if (e.target.value !== '') {
            // if there is input for search, send axios request for search results
            searchUserAPI(e.target.value)
                .then(res =>
                    res.data.results.length !== 0
                        ? setSuggestions(res.data.results.slice(0, 4))
                        : setSuggestions(null),
                )
                .catch(() => setSuggestions(null));
        } else {
            setSuggestions(stored ? stored : null);
        }
    };

    const handleSubmit = (item: UserDataForSearch | null) => {
        // executed on submitting of input text, either by pressing Enter or clicking on a suggestion
        if (item) {
            // update selectedResults and searchRecord using updateSequence function
            // updateSequence: checks if item to add is already in the given list.
            //                  if not included, add to the end of the list
            //                  if included & sorted = true(default), bring the item to the end of the list
            //                  if included & sorted = false, simply return previous list
            // see 'lib/utils/updateSequence.ts' for more details
            const newSelectedResults = updateSequence<UserDataForSearch>({
                sequence: selectedResults, // sequence to update
                getUniqueKey: x => {
                    // function that gets unique key for mapping
                    return x.pk;
                },
                itemToAdd: item, // item to be added to the sequence
                sorted: false, // if item is already in the sequence, do not change its position
            });
            setSelectedResults(newSelectedResults);
            const newSearchRecord = updateSequence<UserDataForSearch>({
                sequence: stored,
                getUniqueKey: x => {
                    return x.pk;
                },
                itemToAdd: item,
                maxLength: 4, // optional parameter: maximum length of the new sequence
                // only save the recent 4 searches to localStorage
            });
            setStored(newSearchRecord);
            if (interceptResult) interceptResult(newSelectedResults);
        }
        setSearchInput('');
        closeDropDown();
    };

    const executeAction = () => {
        // apply function provided through parameters on each item selected
        if (selectedResults) {
            selectedResults.map(item => toExecute(item));
        }
        if (resetOnExecution) {
            setSelectedResults(null);
        }

        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader style={{ display: 'flex', zIndex: 140 }}>
                {/* Large container. Area with gray background. Holds all selected(staged) items + input box */}
                <div
                    className={styles.container}
                    ref={containerRef}
                    style={
                        width ? { width: width } : { width: '100%' }
                        // if width is provided, fit to specified width
                        // otherwise, expand horizontally to fill all space available(flexGrow)
                    }
                >
                    <div className={styles.searchedResultWrapper}>
                        {selectedResults?.map(item => {
                            return (
                                <SelectedResultItem
                                    getImage={getImage ? true : false}
                                    key={item.pk}
                                    item={item}
                                    onClick={e => {
                                        e.preventDefault();
                                        setSelectedResults(
                                            selectedResults.filter(
                                                i => i !== item,
                                            ),
                                            // Remove button: on click,
                                            // remove this item from selectedResults
                                        );
                                        if (interceptResult) {
                                            interceptResult(
                                                selectedResults.filter(
                                                    i => i !== item,
                                                ),
                                            );
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
                    <form
                        onSubmit={e => {
                            // submitting the input box only (pressing Enter)
                            // is different from pressing the rightmost button for executing provided functions
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
                            placeholder={placeholder || '????????? ??????...'}
                            onFocus={openDropDown}
                        />
                    </form>
                    <div
                        className={
                            // thick underline with animations!
                            isOpen
                                ? `${styles.underline} ${styles.expand}`
                                : `${styles.underline}`
                        }
                        style={{ backgroundColor: underlineColor }}
                    />
                </div>
                {/* Rightmost button for executing final function (ex.sending friend request API call) */}
                {submitButtonNotRequired ? (
                    <></>
                ) : (
                    <button onClick={executeAction}>{buttonText}</button>
                )}
            </DropDownHeader>
            {/* DropDownBody displays suggestions -> either autocomplete for input search or the most recent 4 searches */}
            <DropDownBody
                isOpen={isOpen}
                style={{
                    // need to be positioned directly below the gray-background container,
                    // which has dynamic height according to the number of items in SelectedResults
                    // also, width must match the width of the container specified above,
                    // which is also dynamic depending on the specified width / width set to the UserSearchDropDown comp. as a whole
                    // Thus, use ref and offsetHeight/offsetWidth to get that value
                    // 'offset~' and not 'client~' to include borders etc.
                    top: containerRef.current?.offsetHeight,
                    width: containerRef.current?.offsetWidth,
                    zIndex: 130,
                }}
            >
                <ul className={styles.suggestions}>
                    {suggestions ? (
                        suggestions.slice(0, 4)?.map(item => {
                            return (
                                <SuggestionItem
                                    getImage={getImage ? true : false}
                                    key={item.pk}
                                    item={item}
                                    onClick={() => handleSubmit(item)}
                                />
                            );
                        })
                    ) : (
                        <li style={{ padding: '8px 10px' }}>No results...</li>
                    )}
                </ul>
            </DropDownBody>
        </DropDown>
    );
}

const SelectedResultItem = ({
    item,
    onClick,
    getImage,
}: {
    item: UserDataForSearch;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    getImage?: boolean;
}) => {
    // display rounded rectangles for each item selected (staged)
    // TODO after profile pictures are added:
    //          get profile picture with UserData and pass that to Image src prop
    return (
        <div className={styles.selected}>
            {getImage && <AccountDefaultIcon className="icon" width="20px" />}
            <div>{item.username}</div>
            <button onClick={onClick}>
                <CloseIcon />
            </button>
        </div>
    );
};

const SuggestionItem = ({
    item,
    onClick,
    getImage,
}: {
    item: UserDataForSearch;
    onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
    getImage?: boolean;
}) => {
    return (
        <li onClick={onClick}>
            <div className={styles.suggestion}>
                {getImage && (
                    <AccountDefaultIcon className="icon" width="30px" />
                )}
                <div className={styles.textHolder}>
                    <div className={styles.username}>{item.username}</div>
                    <div className={styles.email}>{item.email}</div>
                </div>
            </div>
        </li>
    );
};
