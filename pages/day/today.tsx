import React, { useEffect } from 'react';

import DayCalendar from '@components/DayCalendar/DayCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function DayTodayPage() {
    const { setCalendarType, changeToToday } = useDateContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.day);
    }, [changeToToday]);

    return <DayCalendar />;
}
