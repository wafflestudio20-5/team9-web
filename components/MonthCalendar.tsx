import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import styles from './MonthCalendar.module.scss';

import DayinMonth from '@components/DayinMonth';
import Sidebar from '@components/Sidebar';
import { useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import { DAYS_ARR } from '@utils/formatDay';

export default function MonthCalendar() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const now = new Date();

    // data for month to be displayed
    // will fetch from api request
    // need to specify response format
    const monthData = [
        { month: 11, date: 27, events: [] },
        { month: 11, date: 28, events: [] },
        { month: 11, date: 29, events: [] },
        { month: 11, date: 30, events: [] },
        { month: 12, date: 1, events: [] },
        { month: 12, date: 2, events: [] },
        { month: 12, date: 3, events: [] },
        { month: 12, date: 4, events: [] },
        { month: 12, date: 5, events: [] },
        { month: 12, date: 6, events: [] },
        { month: 12, date: 7, events: [] },
        { month: 12, date: 8, events: [] },
        { month: 12, date: 9, events: [] },
        { month: 12, date: 10, events: [] },
        { month: 12, date: 11, events: [] },
        { month: 12, date: 12, events: [] },
        { month: 12, date: 13, events: [] },
        { month: 12, date: 14, events: [] },
        { month: 12, date: 15, events: [] },
        { month: 12, date: 16, events: [] },
        { month: 12, date: 17, events: [] },
        { month: 12, date: 18, events: [] },
        { month: 12, date: 19, events: [] },
        { month: 12, date: 20, events: [] },
        { month: 12, date: 21, events: [] },
        { month: 12, date: 22, events: [] },
        { month: 12, date: 23, events: [] },
        { month: 12, date: 24, events: [] },
        { month: 12, date: 25, events: [] },
        { month: 12, date: 26, events: [] },
        { month: 12, date: 27, events: [] },
        { month: 12, date: 28, events: [] },
        { month: 12, date: 29, events: [] },
        { month: 12, date: 30, events: [] },
        { month: 12, date: 31, events: [] },
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
            router.push('/month/today');
        } else {
            router.push(`/month/${yearNow}/${monthNow}/${dateNow}`);
        }
    }, [yearNow, monthNow, dateNow]);

    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div className={styles.monthHolder}>
                <div className={styles.headrow}>
                    {DAYS_ARR.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                </div>
                <div className={styles.month}>
                    {monthData.map((dayData, index) => {
                        return <DayinMonth key={index} dayData={dayData} />;
                    })}
                </div>
            </div>
        </div>
    );
}
