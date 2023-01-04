import React, { useEffect } from 'react';

import WeekCalendar from '@components/WeekCalendar/WeekCalendar';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';

export default function WeekTodayPage() {
    const { changeToToday } = useDateContext();
    const { setCalendarType } = useCalendarContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.week);
    }, []);

    return <WeekCalendar />;
}
