import React, { useEffect } from 'react';

import MonthCalendar from '@components/MonthCalendar/MonthCalendar';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';

export default function MonthTodayPage() {
    const { changeToToday } = useDateContext();
    const { setCalendarType } = useCalendarContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.month);
    }, [changeToToday]);

    return <MonthCalendar />;
}
