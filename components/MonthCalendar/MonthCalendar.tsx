import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Swal from 'sweetalert2';

import styles from './MonthCalendar.module.scss';

import { getEntireScheduleAPI, CalendarURLParams } from '@apis/calendar';
import DayinMonth from '@components/MonthCalendar/DayinMonth';
import CreateScheduleButton from '@components/ScheduleModal/CreateScheduleButton';
import Sidebar from '@components/Sidebar/Sidebar';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import { getCalendarDates } from '@utils/calculateDate';
import { DAYS, formatDate } from '@utils/formatting';
import { FullSchedule, LayeredEvents } from '@customTypes/ScheduleTypes';
import getLayeredEvents from '@utils/layerEvents';
import { useCalendarContext } from '@contexts/CalendarContext';

export default function MonthCalendar() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { needUpdate, setNeedUpdate } = useCalendarContext();
    const { user, accessToken } = useSessionContext();
    const { isOpen } = useSidebarContext();
    const monthHolderRef = useRef<HTMLDivElement>(null);

    const monthDates = useMemo(() => {
        return getCalendarDates({
            dateObj: year
                ? new Date(Number(year), Number(month) - 1, Number(date))
                : new Date(),
        });
    }, [year, month, date]);
    const [monthEvents, setMonthEvents] = useState<FullSchedule[]>();
    const [layeredEvents, setLayeredEvents] = useState<LayeredEvents>();
    const [dayBoxSize, setDayBoxSize] = useState<
        | {
              width: string;
              height: string;
              padding: string;
          }
        | undefined
    >(undefined);

    useEffect(() => {
        if (monthDates || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk!,
                    from: formatDate(monthDates[0]),
                    to: formatDate(monthDates[monthDates.length - 1]),
                } as CalendarURLParams,
                accessToken,
            )
                .then(res => {
                    setMonthEvents(res.data.results);
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
        console.log('updated');
    }, [monthDates, needUpdate]);

    useEffect(() => {
        if (monthDates && monthEvents) {
            setLayeredEvents(getLayeredEvents(monthDates, monthEvents));
        }
    }, [monthDates, monthEvents]);
    useEffect(() => {
        const monthLength = monthDates.length;
        const holderWidth = monthHolderRef.current?.clientWidth;
        const holderHeight = monthHolderRef.current?.clientHeight;
        if (holderWidth && holderHeight) {
            const dayWidth = (holderWidth - 12 * 6) / 7;
            const numOfWeeks = monthLength / 7;
            const dayHeight =
                (holderHeight - 12 * (numOfWeeks - 1)) / numOfWeeks;
            setDayBoxSize({
                width: `${Math.round(dayWidth)}px`,
                height: `${dayHeight}px`,
                padding: `0px ${(dayWidth - Math.round(dayWidth)) / 2}`,
            });
        }
    }, [monthDates, monthHolderRef]);
    console.log(layeredEvents);

    return (
        <div className={styles.wrapper} style={{}}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.calendarHolder}>
                <div className={styles.headrow}>
                    {DAYS.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                </div>
                <div className={styles.monthHolder} ref={monthHolderRef}>
                    <div className={styles.month}>
                        {layeredEvents &&
                            Object.entries(layeredEvents).map((data, index) => {
                                return (
                                    <DayinMonth
                                        key={index}
                                        dateData={{
                                            dateString: data[0],
                                            day: data[1].day,
                                        }}
                                        eventData={data[1]}
                                        boxSize={dayBoxSize}
                                    />
                                );
                            })}
                    </div>

                    <div
                        className={styles.borders}
                        style={{ flexDirection: 'column' }}
                    >
                        {Array(monthDates?.length! / 7 - 1)
                            .fill(0)
                            .map((v, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={styles.horizontal}
                                    />
                                );
                            })}
                    </div>
                </div>
                <div
                    className={styles.borders}
                    style={{ flexDirection: 'row' }}
                >
                    {Array(6)
                        .fill(0)
                        .map((v, i) => {
                            return <div key={i} className={styles.vertical} />;
                        })}
                </div>
            </div>
        </div>
    );
}
