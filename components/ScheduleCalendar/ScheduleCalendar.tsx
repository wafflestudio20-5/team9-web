import axios from 'axios';
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from 'react';

import styles from './ScheduleCalendar.module.scss';

import DayinSchedule from '@components/ScheduleCalendar/DayinSchedule';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSidebarContext } from '@contexts/SidebarContext';
import {
    NumberedEvent,
    NumberedEventsByDay,
    FullSchedule,
} from '@customTypes/ScheduleTypes';
import { getFrozenEvents } from '@utils/layerEvents';
import { getDatesInEvent, isDateIncluded } from '@utils/calcEventDates';
import { formatDate } from '@utils/formatting';
import { getEntireScheduleAPI } from '@apis/calendar';
import { useSessionContext } from '@contexts/SessionContext';
import { useRouter } from 'next/router';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import { useCalendarContext } from '@contexts/CalendarContext';

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
            ? new Date(Number(year), Number(month) + 1, Number(date))
            : new Date(
                  today.getFullYear(),
                  today.getMonth() + 2,
                  today.getDate(),
              );
    }, [year, month, date]);

    const [scheduleEventByDay, setScheduleEventByday] =
        useState<NumberedEventsByDay>();

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
            setScheduleEventByday(getScheduleEventsByDay(res.data.results));
        });
    }, [user, needUpdate, dateObj]);

    const getScheduleEventsByDay = (scheduleEvent: FullSchedule[]) => {
        const eventsByDay = {} as NumberedEventsByDay;
        const { frozenEvents, scrollableEvents } =
            getFrozenEvents(scheduleEvent);
        if (frozenEvents) {
            frozenEvents.forEach(event => {
                const datesInEvent = getDatesInEvent(event);
                for (let i = 0; i < datesInEvent.length; i++) {
                    if (eventsByDay[datesInEvent[i]]) {
                        eventsByDay[datesInEvent[i]].push({
                            num: 0,
                            event: event,
                        });
                    } else {
                        eventsByDay[datesInEvent[i]] = [
                            { num: 0, event: event },
                        ];
                    }
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
                    ></div>
                </div>
            </div>
        </div>
    );
}
