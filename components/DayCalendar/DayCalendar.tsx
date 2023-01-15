import React from 'react';

import styles from './DayCalendar.module.scss';

import DayComponent from '@components/DayComponent';
import Sidebar from '@components/Sidebar/Sidebar';
import { useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function DayCalendar() {
    const { isOpen } = useSidebarContext();
    const { dateNow, dayNow } = useDateContext();
    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <></>}
            <DayComponent isToday={true} date={dateNow} day={dayNow} />
        </div>
    );
}
