import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import DayinSchedule from '../../../../components/DayinSchedule';
import { CalendarType } from '../../../../components/Header/CalendarTypeDropDown';
import Sidebar from '../../../../components/Sidebar';
import { useDateContext } from '../../../../contexts/DateContext';
import { useSidebarContext } from '../../../../contexts/SidebarContext';
import styles from '../../../schedule.module.scss';

export default function SchedulePage() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const scheduleData = [
        { date: 2, day: 5, events: [] },
        { date: 5, day: 1, events: [] },
    ];

    useEffect(() => {
        const newPathname = `/${CalendarType.schedule}/${yearNow}/${monthNow}/${dateNow}`;
        router.push(newPathname);
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
