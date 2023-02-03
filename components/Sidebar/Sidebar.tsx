import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import Swal from 'sweetalert2';

import { mapCalendarToggle } from './CalendarToggle';
import styles from './Sidebar.module.scss';

import { followRequestAPI } from '@apis/social';
import { Accordion } from '@components/Accordion';
import MiniCalendar from '@components/MiniCalendar';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { useCalendarContext } from '@contexts/CalendarContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import { UserDataForSearch } from '@customTypes/UserTypes';
import AddScheduleIcon from '@images/add_schedule_icon.svg';
import ExpandIcon from '@images/expand_icon.svg';

export default function Sidebar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { isClosing } = useSidebarContext();
    const { accessToken } = useSessionContext();
    const { calendarType } = useCalendarContext();
    const dateObjNow = useMemo(() => {
        return year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : new Date();
    }, [year, month, date]);
    const sendFollowRequest = (item: UserDataForSearch) => {
        followRequestAPI(item.pk, accessToken)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '친구 요청을 보냈습니다.',
                    confirmButtonText: '확인',
                });
            })
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
        <div
            className={
                isClosing
                    ? `${styles.sidebar} ${styles.closing}`
                    : `${styles.sidebar} ${styles.open}`
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.createButtonHolder}>
                    <div className={styles.roundedButton}>
                        <AddScheduleIcon
                            className="icon"
                            height="36px"
                            viewBox="46 46 469 469"
                        />
                        <div>만들기</div>
                        <ExpandIcon className="icon" height="15px" />
                    </div>
                </div>
                <div className={styles.calendar}>
                    <MiniCalendar
                        dateVariable={dateObjNow}
                        onDateClickFunction={date => {
                            router.push(
                                `/${calendarType}/${date?.getFullYear()}/${
                                    date.getMonth() + 1
                                }/${date.getDate()}`,
                            );
                        }}
                    />
                </div>
                <div className={styles.addFriends}>
                    <div>친구 추가</div>
                    <UserSearchDropDown
                        toExecute={sendFollowRequest}
                        buttonText="요청"
                        resetOnExecution={true}
                    />
                </div>
                {/* <div className={styles.accordions}>
                    <Accordion
                        title="내 캘린더"
                        sequence={dummyMyCalendars}
                        mapFunction={mapCalendarToggle}
                        style={{
                            title: { marginLeft: '15px' },
                        }}
                    />
                </div>
                <div className={styles.accordions}>
                    <Accordion
                        title="다른 캘린더"
                        sequence={dummyOtherCalendars}
                        mapFunction={mapCalendarToggle}
                        style={{
                            title: { marginLeft: '15px' },
                        }}
                    />
                </div> */}
            </div>
        </div>
    );
}
