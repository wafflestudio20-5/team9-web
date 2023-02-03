import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState, useMemo } from 'react';

import styles from './DayCalendar.module.scss';

import { getEntireScheduleAPI, CalendarURLParams } from '@apis/calendar';
import Sidebar from '@components/Sidebar/Sidebar';
import AcrossEvent from '@components/EventComponents/AcrossEvent';
import FillerEvent from '@components/EventComponents/FillerEvent';
import { useSidebarContext } from '@contexts/SidebarContext';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import { formatHour, formatDate, DAYS } from '@utils/formatting';
import { useSessionContext } from '@contexts/SessionContext';
import { useCalendarContext } from '@contexts/CalendarContext';
import {
    FullSchedule,
    LayerData,
    DailyLayerData,
} from '@customTypes/ScheduleTypes';
import {
    getLayeredFrozenEvents,
    getLayeredWeeklyWithinEvents,
} from '@utils/layerEvents';
import getEventComponent from '@utils/getEventComponent';

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
                setDayEvents(res.data.results);
            });
        }
        setNeedUpdate(false);
    }, [needUpdate, user, paramDate]);
    useEffect(() => {
        if (dayEvents) {
            setLayeredFrozenEvents(
                getLayeredFrozenEvents(dayEvents, [paramDate])[
                    formatDate(paramDate)
                ],
            );
            setLayeredWithinEvents(
                getLayeredWeeklyWithinEvents(dayEvents, [paramDate])[
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
                                        // if (data === null) {
                                        //     return (
                                        //         <FillerEvent
                                        //             key={layer}
                                        //             eventHeight={20}
                                        //         />
                                        //     );
                                        // }
                                        // if (data === undefined) {
                                        //     return;
                                        // }
                                        // if (!data.event) {
                                        //     return;
                                        // }
                                        // const type = () => {
                                        //     if (
                                        //         data.event.start_at.split(
                                        //             ' ',
                                        //         )[0] === formatDate(paramDate)
                                        //     ) {
                                        //         return 'leftEnd';
                                        //     } else if (
                                        //         data.event.end_at.split(
                                        //             ' ',
                                        //         )[0] === formatDate(paramDate)
                                        //     ) {
                                        //         return 'rightEnd';
                                        //     } else if (
                                        //         data.event.end_at.split(
                                        //             ' ',
                                        //         )[1] === '00:00:00' &&
                                        //         data.event.end_at.split(
                                        //             ' ',
                                        //         )[0] ===
                                        //             formatDate(
                                        //                 new Date(
                                        //                     paramDate.getFullYear(),
                                        //                     paramDate.getMonth(),
                                        //                     paramDate.getDate() +
                                        //                         1,
                                        //                 ),
                                        //             )
                                        //     ) {
                                        //         return 'rightEnd';
                                        //     } else {
                                        //         return 'middle';
                                        //     }
                                        // };
                                        // return (
                                        //     <AcrossEvent
                                        //         type={type()}
                                        //         eventData={data.event}
                                        //         layer={Number(layer)}
                                        //     />
                                        // );
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
                                            <div className={styles.layer}></div>
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
