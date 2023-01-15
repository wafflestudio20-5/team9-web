import React from 'react';

import styles from './DayCalendar.module.scss';

import DayComponent from '@components/DayComponent';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';

export default function DayCalendar() {
    const { isOpen } = useSidebarContext();

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <></>}
            {/* <div className={styles.timeHolder}>

            </div> */}
            <DayComponent />
        </div>
    );
}
