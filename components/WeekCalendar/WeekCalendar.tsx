import React from 'react';

import styles from './WeekCalendar.module.scss';

import DayComponent from '@components/DayComponent';
import Sidebar from '@components/Sidebar/Sidebar';
import { useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function WeekCalendar() {
    const { isOpen } = useSidebarContext();
    const { yearNow, monthNow, dateNow, dayNow } = useDateContext();

    const sevenDays: Array<number> = Array.from({ length: 7 }, (v, i) => i);
    const startDay = new Date(yearNow, monthNow - 1, dateNow - dayNow);

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <></>}
            <div className={styles.weekHolder}>
                {sevenDays.map((key, index) => {
                    return (
                        <DayComponent
                            isToday={key === dayNow}
                            date={
                                new Date(
                                    startDay.getFullYear(),
                                    startDay.getMonth(),
                                    startDay.getDate() + key,
                                )
                            }
                            key={key}
                        />
                    );
                })}
            </div>
        </div>
    );
}
