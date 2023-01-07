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
    const [selectedResults, setSelectedResults] = useState([]);
    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader
                openDropDown={openDropDown}
                style={{ height: 'fit-content' }}
            >
                <div>
                    {selectedResults.map((item, index) => {
                        return <div key={index}>{`chosen ${index}`}</div>;
                    })}
                    <input
                        value={searchInput}
                        onChange={e => {
                            e.preventDefault();
                            setSearchInput(e.target.value);
                        }}
                    />
                    <button>추가</button>
                </div>
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ top: '0px', position: 'relative' }}
            >
                <ul>
                    <li>sth</li>
                </ul>
            </DropDownBody>
        </DropDown>
    );
}
