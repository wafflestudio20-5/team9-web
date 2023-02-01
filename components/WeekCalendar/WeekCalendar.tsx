import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import styles from './WeekCalendar.module.scss';

import DayinWeekAcross from './DayinWeekAcross';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
import { DAYS, formatDate } from '@utils/formatting';
import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';
import { useCalendarContext } from '@contexts/CalendarContext';
import { CalendarURLParams, getEntireScheduleAPI } from '@apis/calendar';
import { useSessionContext } from '@contexts/SessionContext';
import { getLayeredAcrossEvents } from '@utils/layerEvents';
import { useBoxSizeContext } from '@contexts/BoxSizeContext';

export default function WeekCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { isOpen } = useSidebarContext();
    const { needUpdate, setNeedUpdate } = useCalendarContext();
    const { user, accessToken } = useSessionContext();
    const { leftMargin, setClipBy, totalWidth, boxWidth } = useBoxSizeContext();

    useEffect(() => {
        setClipBy({ vertical: 0, horizontal: 115 + 8 });
    }, []);

    const today = new Date();
    const weekDates = useMemo(() => {
        const paramDate = year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : new Date();
        return Array(7)
            .fill(0)
            .map((v, i) => {
                return new Date(
                    paramDate.getFullYear(),
                    paramDate.getMonth(),
                    paramDate.getDate() - paramDate.getDay() + i,
                );
            });
    }, [year, month, date]);
    const [weekEvents, setWeekEvents] = useState<FullSchedule[]>();
    const [layeredAcrossEvents, setLayeredAcrossEvents] =
        useState<LayeredEvents>();
    const acrossHolderHeight = useMemo(() => {
        if (layeredAcrossEvents) {
            let maxLayer = 0;
            Object.entries(layeredAcrossEvents).forEach(
                ([dateData, eventData]) => {
                    maxLayer = Math.max(
                        Object.keys(eventData).length,
                        maxLayer,
                    );
                },
            );
            return maxLayer * 24 + 3;
        }
        return 0;
    }, [layeredAcrossEvents]);

    useEffect(() => {
        if (weekDates || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk!,
                    from: formatDate(weekDates[0]),
                    to: formatDate(weekDates[weekDates.length - 1]),
                } as CalendarURLParams,
                accessToken,
            )
                .then(res => {
                    setWeekEvents(res.data.results);
                })
                .catch(err => {
                    const alertText = (err: Error | AxiosError) => {
                        if (axios.isAxiosError(err)) {
                            if (err.response?.status === 401) {
                                return '로그인해야 합니다.';
                            }
                            return `Error Code: ${err.response?.status}\nError Message: ${err.response?.data.detail}`;
                        }
                        return err.toString();
                    };
                    Swal.fire({
                        title: '일정을 불러올 수 없습니다.',
                        text: alertText(err),
                        confirmButtonText: '확인',
                    }).then(res => {
                        if (
                            res.isConfirmed &&
                            axios.isAxiosError(err) &&
                            err.response?.status === 401
                        ) {
                            router.push('/login');
                        }
                    });
                });
        }
        setNeedUpdate(false);
    }, [weekDates, needUpdate]);

    useEffect(() => {
        if (weekEvents) {
            setLayeredAcrossEvents(
                getLayeredAcrossEvents(weekEvents, weekDates),
            );
        }
    }, [weekEvents]);
    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <></>}
            <div className={styles.weekHolder}>
                <div
                    className={styles.frozenHolder}
                    style={{ paddingLeft: `${leftMargin + 115}px` }}
                >
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
                    <div
                        className={styles.acrossHolder}
                        style={{
                            height: `${acrossHolderHeight}px`,
                        }}
                    >
                        <div className={styles.across}>
                            {layeredAcrossEvents &&
                                Object.entries(layeredAcrossEvents).map(
                                    ([dateData, eventData], index) => {
                                        return (
                                            <DayinWeekAcross
                                                key={index}
                                                dateData={dateData}
                                                eventData={eventData}
                                            />
                                        );
                                    },
                                )}
                        </div>
                        <div className={styles.borders}>
                            {Array(6)
                                .fill(0)
                                .map((v, i) => {
                                    return <div key={i} />;
                                })}
                        </div>
                    </div>
                </div>
                <div className={styles.scrollHolder}>
                    <div className={styles.scrollContent}>
                        <div
                            className={styles.lowerLeft}
                            style={{ width: `${115 + leftMargin}px` }}
                        >
                            <div className={styles.timestamps}></div>
                            <div className={styles.borderPortrude}></div>
                        </div>
                        <div className={styles.lowerRight}>
                            <div className={styles.days}>
                                {weekDates.map((key, index) => {
                                    return (
                                        <div
                                            className={styles.dayHolder}
                                            style={{ width: `${boxWidth}px` }}
                                        ></div>
                                    );
                                })}
                            </div>
                            <div className={styles.borders}>
                                {Array(6)
                                    .fill(0)
                                    .map((v, i) => {
                                        return <div key={i} />;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
