import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState, useMemo } from 'react';

import styles from './DayCalendar.module.scss';

import { getEntireScheduleAPI, CalendarURLParams } from '@apis/calendar';
import DailyEvent from '@components/EventComponents/DailyEvent';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import Sidebar from '@components/Sidebar/Sidebar';
import { useCalendarContext } from '@contexts/CalendarContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import {
    FullSchedule,
    LayerData,
    DailyLayerData,
} from '@customTypes/ScheduleTypes';
import { formatHour, formatDate, DAYS } from '@utils/formatting';
import getEventComponent from '@utils/getEventComponent';
import {
    getFrozenEvents,
    getLayeredEvents,
    getLayeredWeeklyWithinEvents,
} from '@utils/layerEvents';

export default function DayCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const paramDate = useMemo(() => {
        return year ? new Date(`${year}-${month}-${date}`) : new Date();
    }, [year, month, date]);
    const today = new Date();
    const { isOpen } = useSidebarContext();
    const { user, accessToken } = useSessionContext();
    const { needUpdate, setNeedUpdate } = useCalendarContext();

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

    const [dayEvents, setDayEvents] = useState<FullSchedule[]>();
    const [layeredFrozenEvents, setLayeredFrozenEvents] = useState<LayerData>();
    const [layeredWithinEvents, setLayeredWithinEvents] =
        useState<DailyLayerData>();

    useEffect(() => {
        if ((user?.pk && paramDate) || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk,
                    from: formatDate(paramDate),
                    to: formatDate(
                        new Date(
                            paramDate.getFullYear(),
                            paramDate.getMonth(),
                            paramDate.getDate() + 1,
                        ),
                    ),
                } as CalendarURLParams,
                accessToken,
            ).then(res => {
                setDayEvents(res.data);
            });
        }
        setNeedUpdate(false);
    }, [needUpdate, user, paramDate]);
    useEffect(() => {
        if (dayEvents) {
            const { frozenEvents, scrollableEvents } =
                getFrozenEvents(dayEvents);
            console.log(frozenEvents);
            setLayeredFrozenEvents(
                getLayeredEvents(frozenEvents, [paramDate], true)[
                    formatDate(paramDate)
                ],
            );
            console.log('layered successfully');
            setLayeredWithinEvents(
                getLayeredWeeklyWithinEvents(scrollableEvents, [paramDate])[
                    formatDate(paramDate)
                ],
            );
        }
    }, [dayEvents]);

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.dayHolder}>
                <div
                    className={`${styles.frozenHolder} ${
                        isScrolledtoTop ? styles.scrolledToTop : ''
                    }`}
                >
                    <div
                        className={`${styles.dateHolder} ${
                            paramDate.toDateString() === today.toDateString()
                                ? styles.today
                                : ''
                        }`}
                    >
                        <div className={styles.day}>
                            {DAYS[paramDate.getDay()]}
                        </div>
                        <div className={styles.date}>
                            <div>{paramDate.getDate()}</div>
                        </div>
                    </div>
                    <div className={styles.acrossHolder}>
                        <div className={styles.across}>
                            {layeredFrozenEvents &&
                                Object.entries(layeredFrozenEvents).map(
                                    ([layer, data]) => {
                                        return getEventComponent({
                                            data: data,
                                            layer: Number(layer),
                                            independentView: true,
                                        });
                                    },
                                )}
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
                            <div className={styles.backgroundProvider} />
                            {layeredWithinEvents &&
                                Object.entries(layeredWithinEvents).map(
                                    ([layer, eventData], index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={styles.layer}
                                            >
                                                {eventData &&
                                                    eventData.map(
                                                        (
                                                            eventDataItem: {
                                                                textTop: number;
                                                                event: FullSchedule;
                                                            },
                                                            index: number,
                                                        ) => {
                                                            return (
                                                                <DailyEvent
                                                                    key={index}
                                                                    textTop={
                                                                        eventDataItem.textTop
                                                                    }
                                                                    event={
                                                                        eventDataItem.event
                                                                    }
                                                                    layer={Number(
                                                                        layer,
                                                                    )}
                                                                />
                                                            );
                                                        },
                                                    )}
                                            </div>
                                        );
                                    },
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
