import React, { useEffect } from 'react';

import ScheduleCalendar from '@components/ScheduleCalendar/ScheduleCalendar';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';

export default function ScheduleTodayPage() {
    const { changeToToday } = useDateContext();
    const { setCalendarType } = useCalendarContext();

    useEffect(() => {
        changeToToday();
        setCalendarType(CalendarType.schedule);
    }, [changeToToday]);

    return <ScheduleCalendar />;
}
