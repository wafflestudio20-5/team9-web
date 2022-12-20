import React from 'react';

import DayinSchedule from '../components/DayinSchedule';
import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';

import styles from './schedule.module.scss';

export default function SchedulePage() {
    const { isOpen } = useSidebarContext();
    const scheduleData = [
        { dt: 2, dy: 5, events: [] },
        { dt: 5, dy: 1, events: [] },
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
