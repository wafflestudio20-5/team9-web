import React, { useRef } from 'react';

import styles from './DayCalendar.module.scss';

import Sidebar from '@components/Sidebar/Sidebar';
import { useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import { formatHour } from '@utils/formatting';

export default function DayCalendar() {
    const { isOpen } = useSidebarContext();
    const { yearNow, monthNow, dateNow } = useDateContext();

    const scrollHolderRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.dayHolder}>
                <div className={styles.frozenHolder}></div>
                <div className={styles.scrollHolder} ref={scrollHolderRef}>
                    <div
                        className={styles.scrollContent}
                        ref={scrollContentRef}
                    >
                        <div className={styles.lowerLeft}>
                            <div className={styles.timestamps}>
                                {Array(23)
                                    .fill(0)
                                    .map((v, i) => {
                                        const newDate = new Date();
                                        newDate.setHours(i + 1);
                                        return (
                                            <div
                                                key={i}
                                                className={styles.hour}
                                            >
                                                <div>{formatHour(newDate)}</div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className={styles.borderPortrude} />
                        </div>
                        <div className={styles.lowerRight}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
