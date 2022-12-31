import React, { useEffect } from 'react';

import DayCalendar from '@components/DayCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function DayTodayPage() {
    const { setYearNow, setMonthNow, setDateNow, setDayNow, setCalendarType } =
        useDateContext();
    const now = new Date();

    useEffect(() => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
        setCalendarType(CalendarType.day);
    }, [now]);
    return <DayCalendar />;
}
