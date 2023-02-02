import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import styles from './WeekCalendar.module.scss';

import { CalendarURLParams, getEntireScheduleAPI } from '@apis/calendar';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import Sidebar from '@components/Sidebar/Sidebar';
import DayinWeekAcross from '@components/WeekCalendar/DayinWeekAcross';
import DayinWeekWithin from '@components/WeekCalendar/DayinWeekWithin';
import { useCalendarContext } from '@contexts/CalendarContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import {
    FullSchedule,
    LayeredEvents,
    LayeredWeeklyWithinEvents,
} from '@customTypes/ScheduleTypes';
import { DAYS, formatDate, formatHour } from '@utils/formatting';
import {
    getLayeredFrozenEvents,
    getLayeredWeeklyWithinEvents,
} from '@utils/layerEvents';

export default function WeekCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { isOpen } = useSidebarContext();
    const { needUpdate, setNeedUpdate } = useCalendarContext();
    const { user, accessToken } = useSessionContext();
    const scrollHolderRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);
    const scrollObserver = useRef<IntersectionObserver>();
    const [isScrolledtoTop, setIsScolledtoTop] = useState(true);

    useEffect(() => {
        scrollObserver.current = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsScolledtoTop(entry.isIntersecting);
                });
            },
            {
                root: scrollHolderRef.current,
                rootMargin: '0px 0px 1320px 0px',
                threshold: 1,
            },
        );
    }, []);
    useEffect(() => {
        if (scrollContentRef.current) {
            scrollObserver.current?.observe(scrollContentRef.current!);
        }
    }, [scrollContentRef]);

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
    const [layeredFrozenEvents, setLayeredFrozenEvents] =
        useState<LayeredEvents>();
    const [layeredWeeklyWithinEvents, setLayeredWeeklyWithinEvents] =
        useState<LayeredWeeklyWithinEvents>();
    const acrossHolderHeight = useMemo(() => {
        if (layeredFrozenEvents) {
            let maxLayer = 0;
            Object.entries(layeredFrozenEvents).forEach(
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
    }, [layeredFrozenEvents]);

    useEffect(() => {
        const lastDay = weekDates[weekDates.length - 1];
        const dayAfterLast = new Date(
            lastDay.getFullYear(),
            lastDay.getMonth(),
            lastDay.getDate() + 1,
        );
        if ((user?.pk && weekDates) || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk,
                    from: formatDate(weekDates[0]),
                    to: formatDate(dayAfterLast),
                } as CalendarURLParams,
                accessToken,
            ).then(res => {
                setWeekEvents(res.data.results);
            });
        }
        setNeedUpdate(false);
    }, [weekDates, needUpdate, user]);

    useEffect(() => {
        if (weekEvents) {
            setLayeredFrozenEvents(
                getLayeredFrozenEvents(weekEvents, weekDates),
            );
            setLayeredWeeklyWithinEvents(
                getLayeredWeeklyWithinEvents(weekEvents, weekDates),
            );
        }
    }, [weekEvents]);

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.weekHolder}>
                <div
                    className={`${styles.frozenHolder} ${
                        isScrolledtoTop ? styles.scrolledToTop : ''
                    }`}
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
                            {layeredFrozenEvents &&
                                Object.entries(layeredFrozenEvents).map(
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
                        <div className={styles.lowerRight}>
                            <div className={styles.days}>
                                {layeredWeeklyWithinEvents &&
                                    Object.entries(
                                        layeredWeeklyWithinEvents,
                                    ).map(
                                        (
                                            [dateString, dailyLayerData],
                                            index,
                                        ) => {
                                            return (
                                                <DayinWeekWithin
                                                    key={index}
                                                    dailyLayerData={
                                                        dailyLayerData
                                                    }
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
                </div>
            </div>
        </div>
    );
}
