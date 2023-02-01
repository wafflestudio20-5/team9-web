import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import styles from './WeekCalendar.module.scss';

import Sidebar from '@components/Sidebar/Sidebar';
import { useDateContext } from '@contexts/DateContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import { DAYS } from '@utils/formatting';

export default function WeekCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { isOpen } = useSidebarContext();

    const today = new Date();
    const weekDates = useMemo(() => {
        const paramDate = year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : new Date();
        return Array(7)
            .fill(0)
            .map((v, i) => {
                let dateObj = new Date(
                    paramDate.getFullYear(),
                    paramDate.getMonth(),
                    paramDate.getDate() - paramDate.getDay() + i,
                );
                return dateObj;
            });
    }, [year, month, date]);

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <></>}
            <div className={styles.weekHolder}>
                <div className={styles.frozenHolder}>
                    <div className={styles.headrow}>
                        {weekDates.map((v, i) => {
                            return (
                                <div
                                    className={`${styles.headrowItem} ${
                                        v.toDateString() ===
                                        today.toDateString()
                                            ? styles.today
                                            : ''
                                    }`}
                                    key={i}
                                >
                                    <div className={styles.day}>
                                        {DAYS[v.getDay()]}
                                    </div>
                                    <div
                                        className={styles.date}
                                        onClick={() => {
                                            router.push(
                                                `/day/${v.getFullYear()}/${
                                                    v.getMonth() + 1
                                                }/${v.getDate()}`,
                                            );
                                        }}
                                    >
                                        <div> {v.getDate()}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.acrossHolder}></div>
                </div>
                <div className={styles.scrollHolder}>
                    <div className={styles.scrollContent}>
                        <div className={styles.timestamps}></div>
                        <div className={styles.borderPortrude}></div>
                        {weekDates.map((key, index) => {
                            return (
                                <div></div>
                                // <DayComponent
                                //     isToday={key === dayNow}
                                //     date={
                                //         new Date(
                                //             startDay.getFullYear(),
                                //             startDay.getMonth(),
                                //             startDay.getDate() + key,
                                //         )
                                //     }
                                //     key={key}
                                // />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
