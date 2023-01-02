import React, { useEffect } from 'react';

import MonthCalendar from '@components/MonthCalendar/MonthCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function MonthTodayPage() {
    const { changeToToday, setCalendarType } = useDateContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.month);
    }, []);

    return <MonthCalendar />;
}
