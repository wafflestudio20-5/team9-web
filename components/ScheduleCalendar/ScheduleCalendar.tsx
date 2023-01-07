import React from 'react';

import styles from './ScheduleCalendar.module.scss';

import DayinSchedule from '@components/ScheduleCalendar/DayinSchedule';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function ScheduleCalendar() {
    const { isOpen } = useSidebarContext();
    const scheduleData = [
        { date: 2, day: 5, events: [] },
        { date: 5, day: 1, events: [] },
    ];

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
