import React, { useEffect } from 'react';

import DayCalendar from '@components/DayCalendar/DayCalendar';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';

export default function DayTodayPage() {
    const { changeToToday } = useDateContext();
    const { setCalendarType } = useCalendarContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.day);
    }, []);

    return <DayCalendar />;
}
