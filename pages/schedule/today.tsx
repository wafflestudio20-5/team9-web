import React, { useEffect } from 'react';

import ScheduleCalendar from '@components/ScheduleCalendar/ScheduleCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function ScheduleTodayPage() {
    const { changeToToday, setCalendarType } = useDateContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.schedule);
    }, [changeToToday]);

    return <ScheduleCalendar />;
}
