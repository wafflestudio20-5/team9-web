import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import styles from './ScheduleCalendar.module.scss';

import { DayinSchedule } from '@components/ScheduleCalendar/DayinSchedule';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import {
    NumberedEvent,
    NumberedEventsByDay,
    FullSchedule,
} from '@customTypes/ScheduleTypes';
import { getFrozenEvents, isDateIncluded } from '@utils/layerEvents';
import { formatDate } from '@utils/formatting';
import { getEntireScheduleAPI } from '@apis/calendar';
import { useSessionContext } from '@contexts/SessionContext';
import { useRouter } from 'next/router';

//temporary until backend changes
function toHttps(url: string) {
    if (url === null) {
        return '';
    }
    const [protocol, path] = url.split('://');
    console.log(url);
    console.log(path);
    return protocol === 'https' ? url : `https://${path}`;
}

export default function ScheduleCalendar() {
    const { isOpen } = useSidebarContext();
    const { accessToken, user } = useSessionContext();
    const router = useRouter();
    const { year, month, date } = router.query;
    const today = new Date();
    const dateObj = useMemo(() => {
        return year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : today;
    }, [year, month, date]);
    const dateBoundaryObj = useMemo(() => {
        return year
            ? new Date(Number(year) + 10, Number(month) - 1, Number(date))
            : new Date(
                  today.getFullYear() + 10,
                  today.getMonth(),
                  today.getDate(),
              );
    }, [year, month, date]);
    const [scheduleEvent, setScheduleEvent] = useState<NumberedEvent[]>();
    const [scheduleEventByDay, setScheduleEventByDay] =
        useState<NumberedEventsByDay>();
    const [bufferData, setBufferData] = useState<NumberedEvent[]>();

    const scrollHolderRef = useRef<HTMLDivElement>(null);
    const targetRef = React.createRef<HTMLDivElement>();
    const [next, setNext] = useState<string>('');
    const [loadCount, setLoadCount] = useState(0);
    const [renderCount, setRenderCount] = useState(0);
    useEffect(() => {
        // initial API call -> get total of 40 entries, only display 20
        if (user?.pk) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk,
                    from: formatDate(dateObj),
                    to: formatDate(dateBoundaryObj),
                },
                accessToken,
            )
                .then(res => {
                    setLoadCount(20);
                    setRenderCount(20);
                    setScheduleEvent(
                        res.data.results.map(
                            (event: FullSchedule, index: number) => {
                                return { num: index, event: event };
                            },
                        ),
                    );
                    return res.data.next;
                })
                .then(url => {
                    if (url === null) {
                        return;
                    } else {
                        axios
                            .get(toHttps(url), {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            })
                            .then(res => {
                                setLoadCount(40);
                                setNext(toHttps(res.data.next));
                                setBufferData(
                                    res.data.results &&
                                        res.data.results.map(
                                            (
                                                event: FullSchedule,
                                                index: number,
                                            ) => {
                                                return {
                                                    num: 20 + index,
                                                    event: event,
                                                };
                                            },
                                        ),
                                );
                            });
                    }
                });
        }
    }, [user?.pk]);

    const [setTarget] = useInfiniteScroll(
        () => {
            console.log('intersecting');
            if (!scheduleEvent || !bufferData || !next) {
                return;
            }
            setScheduleEvent([...scheduleEvent, ...bufferData]);
            setRenderCount(renderCount + 20);
            axios
                .get(next, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then(res => {
                    setLoadCount(loadCount + 20);
                    setNext(toHttps(res.data.next));
                    setBufferData(res.data.results);
                });
        },
        { threshold: 0, root: scrollHolderRef?.current },
    );

    useEffect(() => {
        if (typeof targetRef !== 'function') {
            setTarget(targetRef.current);
        }
    }, [targetRef.current]);

    useEffect(() => {
        if (scheduleEvent) {
            const eventsByDay = {} as NumberedEventsByDay;
            const { frozenEvents, scrollableEvents } = getFrozenEvents(
                scheduleEvent.map(data => {
                    return data.event;
                }),
            );
            if (frozenEvents) {
                frozenEvents.forEach(event => {
                    const dateObj = new Date(event.start_at);
                    while (isDateIncluded(dateObj, event)) {
                        const dateString = formatDate(dateObj);
                        if (eventsByDay[dateString]) {
                            eventsByDay[dateString].push({
                                num: 0,
                                event: event,
                            });
                        } else {
                            eventsByDay[dateString] = [
                                {
                                    num: 0,
                                    event: event,
                                },
                            ];
                        }
                        dateObj.setDate(dateObj.getDate() + 1);
                    }
                });
            }
            if (scrollableEvents) {
                scrollableEvents.forEach(event => {
                    const dateString = event.start_at.split(' ')[0];
                    if (eventsByDay[dateString]) {
                        eventsByDay[dateString].push({
                            num: 0,
                            event: event,
                        });
                    } else {
                        eventsByDay[dateString] = [
                            {
                                num: 0,
                                event: event,
                            },
                        ];
                    }
                });
            }
            const sorted = Object.entries(eventsByDay).sort(([key1], [key2]) =>
                key1 < key2 ? -1 : 1,
            );
            let i = 0;
            sorted.forEach(([dateString, eventData], index) => {
                eventsByDay[dateString] = eventsByDay[dateString].map(
                    (eventData, index) => {
                        return { num: index + i, event: eventData.event };
                    },
                );
                i += eventData?.length;
            });
            console.log(eventsByDay);
            setScheduleEventByDay(eventsByDay);
        }
    }, [scheduleEvent]);

    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div className={styles.scrollHolder} ref={scrollHolderRef}>
                {scheduleEventByDay &&
                    Object.entries(scheduleEventByDay).map(
                        ([dateString, eventData], index) => {
                            return (
                                <DayinSchedule
                                    key={index}
                                    dateString={dateString}
                                    eventData={eventData}
                                    ref={targetRef}
                                    renderCount={renderCount}
                                />
                            );
                        },
                    )}
            </div>
        </div>
    );
}
