import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import styles from './ScheduleCalendar.module.scss';

import DayinSchedule from '@components/DayinSchedule';
import Sidebar from '@components/Sidebar';
import { CalendarType, useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function ScheduleCalendar() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const now = new Date();
    const scheduleData = [
        { date: 2, day: 5, events: [] },
        { date: 5, day: 1, events: [] },
    ];

    useEffect(() => {
        if (
            isNaN(Number(yearNow)) ||
            isNaN(Number(monthNow)) ||
            isNaN(Number(dateNow))
        ) {
            // redirect to NOT_FOUND page?
            // or throw 404 error?
        }

        if (
            yearNow === now.getFullYear() &&
            monthNow === now.getMonth() + 1 &&
            dateNow === now.getDate()
        ) {
            router.push(`/${CalendarType.schedule}/today`);
        } else {
            router.push(
                `/${CalendarType.schedule}/${yearNow}/${monthNow}/${dateNow}`,
            );
        }
    }, [yearNow, monthNow, dateNow]);

    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div className={styles.scheduleHolder}>
                {scheduleData.map((dayData, index) => {
                    return <DayinSchedule key={index} dayData={dayData} />;
                })}
            </div>
        </div>
    );
}
