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

export default function MonthCalendar() {
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const { year, month, date } = router.query;
    const { user, accessToken } = useSessionContext();

    const monthDates = useMemo(() => {
        return getCalendarDates(
            year
                ? new Date(Number(year), Number(month) - 1, Number(date))
                : new Date(),
        );
    }, [year, month, date]);
    const [monthEvents, setMonthEvents] = useState<FullSchedule[]>();
    const [needUpdate, setNeedUpdate] = useState(true);
    const [layeredEvents, setLayeredEvents] = useState<LayeredEvents>();

    useEffect(() => {
        if (monthDates && needUpdate) {
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
    }, [monthDates, needUpdate]);

    useEffect(() => {
        if (monthDates && monthEvents) {
            setLayeredEvents(getLayeredEvents(monthDates, monthEvents));
        }
    }, [monthDates, monthEvents]);

    return (
        <div className={styles.wrapper}>
            {isOpen ? (
                <Sidebar />
            ) : (
                <CreateScheduleButton setNeedUpdate={setNeedUpdate} />
            )}
            <div className={styles.calendarHolder}>
                <div className={styles.headrow}>
                    {DAYS.map((item, index) => {
                        return <div key={index}>{item}</div>;
                    })}
                </div>
                <div className={styles.monthHolder}>
                    <div className={styles.month}>
                        {layeredEvents
                            ? Object.entries(layeredEvents).map(
                                  (data, index) => {
                                      return (
                                          <DayinMonth
                                              key={index}
                                              dateData={{
                                                  dateString: data[0],
                                                  day: data[1].day,
                                              }}
                                              eventData={data[1]}
                                          />
                                      );
                                  },
                              )
                            : monthDates?.map((date, index) => {
                                  return (
                                      <DayinMonth
                                          key={index}
                                          dateData={{
                                              dateString: formatDate(date),
                                              day: date.getDay(),
                                          }}
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
