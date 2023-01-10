import React from 'react';
import axios from 'axios';
import styles from './Sidebar.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function Sidebar() {
    const { isClosing } = useSidebarContext();
    const sendFollowRequest = (item: UserDataForSearch) => {
        axios.post(
            'https://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/network/',
            { followee: { pk: item.pk } },
            { withCredentials: true },
        );
    };
    return (
        <div className={isClosing ? `${styles.closing}` : `${styles.open}`}>
            <div className={styles.wrapper}>
                <div>Create Button</div>
                <div className={styles.calendar}>
                    <MiniCalendar />
                </div>
                <div className={styles.addFriends}>
                    <UserSearchDropDown
                        toExecute={sendFollowRequest}
                        buttonText="추가"
                    />
                </div>
                <div>My Calenders</div>
                <div>Other Calenders</div>
            </div>
        </div>
    );
}
