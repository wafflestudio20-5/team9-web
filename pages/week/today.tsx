import React, { useEffect } from 'react';

import WeekCalendar from '@components/WeekCalendar/WeekCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function WeekTodayPage() {
    const { changeToToday, setCalendarType } = useDateContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.week);
    }, []);

    return <WeekCalendar />;
}
