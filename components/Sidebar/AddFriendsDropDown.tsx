import {
    DropDown,
    DropDownHeader,
    DropDownBody,
    useDropDown,
} from '@components/DropDown';
import { useState } from 'react';

export function AddFriendsDropDown() {
    const { dropDownRef, openDropDown, isOpen } = useDropDown();
    const [searchInput, setSearchInput] = useState('');
    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <form>
                    <input
                        value={searchInput}
                        onChange={e => {
                            e.preventDefault();
                            setSearchInput(e.target.value);
                        }}
                    />
                    <button type="submit">추가</button>
                </form>
            </DropDownHeader>
            <DropDownBody isOpen={isOpen} style={{ top: '0px' }}>
                <ul>
                    <li>sth</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
