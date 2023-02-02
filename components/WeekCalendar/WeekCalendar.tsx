import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import styles from './WeekCalendar.module.scss';

import DayinWeekAcross from './DayinWeekAcross';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
import { DAYS, formatDate } from '@utils/formatting';
import {
    FullSchedule,
    LayeredEvents,
    LayeredWeeklyWithinEvents,
} from '@customTypes/ScheduleTypes';
import { useCalendarContext } from '@contexts/CalendarContext';
import { CalendarURLParams, getEntireScheduleAPI } from '@apis/calendar';
import { useSessionContext } from '@contexts/SessionContext';
import {
    getLayeredAcrossEvents,
    getLayeredWeeklyWithinEvents,
} from '@utils/layerEvents';
import DayInWeekWithin from './DayInWeekWithin';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';

export default function WeekCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { isOpen } = useSidebarContext();
    const { needUpdate, setNeedUpdate } = useCalendarContext();
    const { user, accessToken } = useSessionContext();

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
    const [layeredWeeklyWithinEvents, setLayeredWeeklyWithinEvents] =
        useState<LayeredWeeklyWithinEvents>();
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
        if ((user && weekDates) || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk!,
                    from: formatDate(weekDates[0]),
                    to: formatDate(weekDates[weekDates.length - 1]),
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
            setLayeredAcrossEvents(
                getLayeredAcrossEvents(weekEvents, weekDates),
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
                        <div className={styles.lowerLeft}>
                            <div className={styles.timestamps}></div>
                            <div className={styles.borderPortrude}></div>
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
                                                <DayInWeekWithin
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
