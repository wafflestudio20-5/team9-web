import React, { useEffect } from 'react';

import ScheduleCalendar from '@components/ScheduleCalendar/ScheduleCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function ScheduleTodayPage() {
    const { setYearNow, setMonthNow, setDateNow, setDayNow, setCalendarType } =
        useDateContext();
    const now = new Date();

    useEffect(() => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
        setCalendarType(CalendarType.schedule);
    }, [now]);
    return <ScheduleCalendar />;
}
