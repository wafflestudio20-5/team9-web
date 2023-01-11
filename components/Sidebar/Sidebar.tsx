import React from 'react';
import axios, { AxiosError } from 'axios';
import styles from './Sidebar.module.scss';
import Swal from 'sweetalert2';

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
        axios
            .post(
                'http://ec2-43-201-9-194.ap-northeast-2.compute.amazonaws.com/api/v1/social/network/',
                { followee: { pk: item.pk } },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            )
            .catch(err => {
                const alertText = (err: Error | AxiosError) => {
                    if (axios.isAxiosError(err)) {
                        if (err.response?.status == 401) {
                            return '로그인해야 합니다.';
                        }
                        return `Error Code: ${err.response?.status}\nError Message: ${err.response?.data.detail}`;
                    }
                    return err.toString();
                };
                Swal.fire({
                    title: '친구 요청을 보낼 수 없습니다.',
                    text: alertText(err),
                    confirmButtonText: '확인',
                });
            });
    };

    const dummyMyCalendars = [
        { pk: 101, name: 'My Calendar 1' },
        { pk: 102, name: 'My Calendar 2' },
    ];
    const dummyOtherCalendars = [
        { pk: 301, name: 'Other Calendar 1' },
        { pk: 302, name: 'Other Calendar 2' },
        { pk: 303, name: 'Other Calendar 3' },
        { pk: 304, name: 'Other Calendar 4' },
    ];
    return (
        <div className={isClosing ? `${styles.closing}` : `${styles.open}`}>
            <div className={styles.wrapper}>
                <div>Create Button</div>
                <div className={styles.calendar}>
                    <MiniCalendar />
                </div>
                <div className={styles.addFriends}>
                    <div>친구 추가</div>
                    <UserSearchDropDown
                        toExecute={sendFollowRequest}
                        buttonText="요청"
                    />
                </div>
                <div className={styles.accordions}>
                    <Accordion
                        title="내 캘린더"
                        sequence={dummyMyCalendars}
                        mapFunction={mapCalendarToggle}
                        style={{
                            title: { marginLeft: '20px' },
                        }}
                    />
                </div>
                <div className={styles.accordions}>
                    <Accordion
                        title="다른 캘린더"
                        sequence={dummyOtherCalendars}
                        mapFunction={mapCalendarToggle}
                        style={{
                            title: { marginLeft: '20px' },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
