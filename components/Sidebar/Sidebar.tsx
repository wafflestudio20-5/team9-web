import React from 'react';
import axios from 'axios';
import styles from './Sidebar.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { useSidebarContext } from '@contexts/SidebarContext';
import { Accordion } from '@components/Accordion';
import { mapCalendarToggle } from './calendarToggle';
import { useSessionContext } from '@contexts/SessionContext';

export default function Sidebar() {
    const { isClosing } = useSidebarContext();
    const { accessToken } = useSessionContext();
    const sendFollowRequest = (item: UserDataForSearch) => {
        axios.post(
            'http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/network/',
            { followee: { pk: item.pk } },
            { headers: { Authorization: `Bearer ${accessToken}` } },
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
                <div>
                    <Accordion
                        title="내 캘린더"
                        sequence={['Dummy 1', 'Dummy 2', 'Dummy 3']}
                        mapFunction={mapCalendarToggle}
                    />
                </div>
                <div>
                    <Accordion
                        title="다른 캘린더"
                        sequence={['Dummy 1', 'Dummy 2', 'Dummy 3', 'Dummy 4']}
                        mapFunction={mapCalendarToggle}
                    />
                </div>
            </div>
        </div>
    );
}
