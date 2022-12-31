import React, { useEffect } from 'react';

import WeekCalendar from '@components/WeekCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function WeekTodayPage() {
    const { setYearNow, setMonthNow, setDateNow, setDayNow, setCalendarType } =
        useDateContext();
    const now = new Date();

    useEffect(() => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
        setCalendarType(CalendarType.week);
    }, [now]);

    return <WeekCalendar />;
}
