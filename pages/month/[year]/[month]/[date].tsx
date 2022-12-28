import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import DayinMonth from '../../../../components/DayinMonth';
import { CalendarType } from '../../../../components/Header/CalendarTypeDropDown';
import Sidebar from '../../../../components/Sidebar';
import { useDateContext } from '../../../../contexts/DateContext';
import { useSidebarContext } from '../../../../contexts/SidebarContext';
import { DAYS_ARR } from '../../../../lib/utils/formatDay';

import styles from './month.module.scss';

export default function MonthPage() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { isOpen } = useSidebarContext();
    const router = useRouter();

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
        const newPathname = `/${CalendarType.month}/${yearNow}/${monthNow}/${dateNow}`;
        router.push(newPathname);
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
