import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo } from 'react';
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

    const monthDates = useMemo(() => {
        return getCalendarDates({
            dateObj: year
                ? new Date(Number(year), Number(month) - 1, Number(date))
                : new Date(),
        });
    }, [year, month, date]);
    const [monthEvents, setMonthEvents] = useState<FullSchedule[]>();
    const [layeredEvents, setLayeredEvents] = useState<LayeredEvents>();

    useEffect(() => {
        if ((user && monthDates) || needUpdate) {
            getEntireScheduleAPI(
                {
                    pk: user?.pk!,
                    from: formatDate(monthDates[0]),
                    to: formatDate(monthDates[monthDates.length - 1]),
                } as CalendarURLParams,
                accessToken,
            ).then(res => {
                setMonthEvents(res.data.results);
            });
        }
        setNeedUpdate(false);
    }, [monthDates, needUpdate, user]);

    useEffect(() => {
        if (monthEvents) {
            setLayeredEvents(getLayeredEvents(monthEvents, monthDates));
        }
    }, [monthEvents]); // update layeredEvents only after monthEvents was updated to match new monthDates
    // thus, dependency does not include monthDates to prevent errors

    return (
        <div className={styles.wrapper}>
            {isOpen ? <Sidebar /> : <CreateScheduleButton />}
            <div className={styles.calendarHolder}>
                <div className={styles.headrow}>
                    {DAYS.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                </div>
                <div className={styles.monthHolder} id="ExpansionBasis">
                    <div
                        className={styles.month}
                        style={{
                            gridTemplateRows: `${Array(monthDates.length / 7)
                                .fill('1fr')
                                .join(' ')}`,
                        }}
                    >
                        {layeredEvents &&
                            Object.entries(layeredEvents).map((data, index) => {
                                return (
                                    <DayinMonth
                                        key={index}
                                        dateString={data[0]}
                                        layerData={data[1]}
                                    />
                                );
                            })}
                    </div>

                    <div className={`${styles.borders} ${styles.horizontal}`}>
                        {Array(monthDates?.length! / 7 - 1)
                            .fill(0)
                            .map((v, i) => {
                                return <div key={i} />;
                            })}
                    </div>
                </div>
                <div className={`${styles.borders} ${styles.vertical}`}>
                    {Array(6)
                        .fill(0)
                        .map((v, i) => {
                            return <div key={i} />;
                        })}
                </div>
            </div>
        </div>
    );
}
