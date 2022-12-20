import React from 'react';

import DayinMonth from '../components/DayinMonth';
import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import { DAYS_ARR } from '../lib/utils/formatDay';

import styles from './month.module.scss';

export default function MonthPage() {
    const { isOpen } = useSidebarContext();

    // data for month to be displayed
    // will fetch from api request
    // need to specify response format
    const monthData = [
        { m: 11, d: 27, events: [] },
        { m: 11, d: 28, events: [] },
        { m: 11, d: 29, events: [] },
        { m: 11, d: 30, events: [] },
        { m: 12, d: 1, events: [] },
        { m: 12, d: 2, events: [] },
        { m: 12, d: 3, events: [] },
        { m: 12, d: 4, events: [] },
        { m: 12, d: 5, events: [] },
        { m: 12, d: 6, events: [] },
        { m: 12, d: 7, events: [] },
        { m: 12, d: 8, events: [] },
        { m: 12, d: 9, events: [] },
        { m: 12, d: 10, events: [] },
        { m: 12, d: 11, events: [] },
        { m: 12, d: 12, events: [] },
        { m: 12, d: 13, events: [] },
        { m: 12, d: 14, events: [] },
        { m: 12, d: 15, events: [] },
        { m: 12, d: 16, events: [] },
        { m: 12, d: 17, events: [] },
        { m: 12, d: 18, events: [] },
        { m: 12, d: 19, events: [] },
        { m: 12, d: 20, events: [] },
        { m: 12, d: 21, events: [] },
        { m: 12, d: 22, events: [] },
        { m: 12, d: 23, events: [] },
        { m: 12, d: 24, events: [] },
        { m: 12, d: 25, events: [] },
        { m: 12, d: 26, events: [] },
        { m: 12, d: 27, events: [] },
        { m: 12, d: 28, events: [] },
        { m: 12, d: 29, events: [] },
        { m: 12, d: 30, events: [] },
        { m: 12, d: 31, events: [] },
    ];
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
