import { useRouter } from 'next/router';
import React from 'react';

import styles from './MonthCalendar.module.scss';

import DayinMonth from '@components/MonthCalendar/DayinMonth';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
import { getCalendarDates } from '@utils/calculateDate';
import { DAYS } from '@utils/formatting';

export default function MonthCalendar() {
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const { year, month, date } = router.query;

    const monthDates = getCalendarDates(
        new Date(Number(year), Number(month) - 1, Number(date)),
    );

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.monthHolder}>
                <div className={styles.headrow}>
                    {DAYS.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                </div>
                <div className={styles.month}>
                    {monthDates.map((date, index) => {
                        return <DayinMonth key={index} dateData={date} />;
                    })}
                </div>
            </div>
        </div>
    );
}
