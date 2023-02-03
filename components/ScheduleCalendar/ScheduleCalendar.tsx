import axios from 'axios';
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from 'react';

import styles from './ScheduleCalendar.module.scss';

import { DayinSchedule } from '@components/ScheduleCalendar/DayinSchedule';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
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
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import { useCalendarContext } from '@contexts/CalendarContext';

//temporary until backend changes
function toHttps(url: string) {
    if (url === null) {
        return '';
    }
    const [protocol, path] = url.split('://');
    return protocol === 'https' ? url : `https://${path}`;
}

export default function ScheduleCalendar() {
    const { isOpen } = useSidebarContext();
    const { accessToken, user } = useSessionContext();
    const { needUpdate } = useCalendarContext();
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
    const [next, setNext] = useState('');
    const [scheduleEvent, setScheduleEvent] = useState<FullSchedule[]>();
    const [scheduleEventByDay, setScheduleEventByday] =
        useState<NumberedEventsByDay>();
    const [loadMore, setLoadMore] = useState(false);
    const [isEndOfList, setIsEndOfList] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // initial api call
        if (!user || needUpdate) {
            return;
        }
        getEntireScheduleAPI(
            {
                pk: user?.pk,
                from: formatDate(dateObj),
                to: formatDate(dateBoundaryObj),
            },
            accessToken,
        ).then(res => {
            setNext(res.data.next);
            setScheduleEvent(res.data.results);
        });
    }, [user, needUpdate]);

    const fetchData = useCallback(async () => {
        if (!next) {
            setIsEndOfList(true);
        }
        axios
            .get(next, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then(res => {
                setNext(res.data.next);
                setScheduleEvent(
                    scheduleEvent
                        ? [...res.data.results, ...scheduleEvent]
                        : res.data.results,
                );
            });
    }, []);

    useEffect(() => {
        // layer events after data has been fetched
        if (scheduleEvent) {
            console.log(getScheduleEventsByDay(scheduleEvent));
            setScheduleEventByday(getScheduleEventsByDay(scheduleEvent));
        }
    }, [scheduleEvent]);

    useEffect(() => {
        if (!targetRef.current || isEndOfList) return;

        // load more on intersection
        const io = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                fetchData();
            }
        });
        io.observe(targetRef.current);

        return () => {
            io.disconnect();
        };
    }, [fetch, isEndOfList]);

    const getScheduleEventsByDay = (scheduleEvent: FullSchedule[]) => {
        const eventsByDay = {} as NumberedEventsByDay;
        const { frozenEvents, scrollableEvents } =
            getFrozenEvents(scheduleEvent);
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

        const sorted = Object.entries(eventsByDay).sort(
            ([key1, item1], [key2, item2]) => (key1 < key2 ? -1 : 1),
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
        return eventsByDay;
    };

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.scrollHolder}>
                <div className={styles.scrollContent}>
                    {scheduleEventByDay &&
                        Object.entries(scheduleEventByDay)
                            .sort(([key1, item1], [key2, item2]) =>
                                key1 < key2 ? -1 : 1,
                            )
                            .map(([dateString, eventData], index) => {
                                return (
                                    <DayinSchedule
                                        key={index}
                                        dateString={dateString}
                                        eventData={eventData}
                                    />
                                );
                            })}

                    <div
                        style={{ position: 'absolute', bottom: '100px' }}
                        ref={targetRef}
                    >
                        {isEndOfList && <div>end of schedules</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
