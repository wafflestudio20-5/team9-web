import React from 'react';

import styles from './Sidebar.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function Sidebar() {
    const { isClosing } = useSidebarContext();
    const sendFollowRequest = () => {};
    return (
        <div className={isClosing ? `${styles.closing}` : `${styles.open}`}>
            <div className={styles.wrapper}>
                <div>Create Button</div>
                <div className={styles.calendar}>
                    <MiniCalendar />
                </div>
                <div className={styles.addFriends}>
                    <UserSearchDropDown toExecute={sendFollowRequest} />
                </div>
                <div>My Calenders</div>
                <div>Other Calenders</div>
            </div>
        </div>
    );
}
