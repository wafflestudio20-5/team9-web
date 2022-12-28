import React from 'react';

import DayinSchedule from '../../../../components/DayinSchedule';
import Sidebar from '../../../../components/Sidebar';
import { useSidebarContext } from '../../../../contexts/SidebarContext';

import styles from './schedule.module.scss';

export default function SchedulePage() {
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
