import React from 'react';

import styles from './Sidebar.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import { AddFriendsDropDown } from './AddFriendsDropDown';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function Sidebar() {
    const { isClosing } = useSidebarContext();
    return (
        <div className={isClosing ? `${styles.closing}` : `${styles.open}`}>
            <div className={styles.wrapper}>
                <div>Create Button</div>
                <div className={styles.calendar}>
                    <MiniCalendar />
                </div>
                <div className={styles.addFriends}>
                    <AddFriendsDropDown />
                </div>
                <div>My Calenders</div>
                <div>Other Calenders</div>
            </div>
        </div>
    );
}
