import React, { useEffect } from 'react';

import MonthCalendar from '@components/MonthCalendar/MonthCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function MonthTodayPage() {
    const { setYearNow, setMonthNow, setDateNow, setDayNow, setCalendarType } =
        useDateContext();
    const now = new Date();

    useEffect(() => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
        setCalendarType(CalendarType.month);
    }, [now]);

    return <MonthCalendar />;
}
