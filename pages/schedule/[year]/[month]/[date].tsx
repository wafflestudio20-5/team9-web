import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import ScheduleCalendar from '@components/ScheduleCalendar/ScheduleCalendar';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';

export default function SchedulePage() {
    const { validateDate, changeFullDate } = useDateContext();
    const { setCalendarType } = useCalendarContext();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;
        const { year, month, date } = router.query;
        const isValid = validateDate(year, month, date);
        if (isValid) {
            changeFullDate(Number(year), Number(month), Number(date));
            setCalendarType(CalendarType.schedule);
        } else {
            // redirect to NOT_FOUND page?
            // or throw 404 error?
            router.push(`/${CalendarType.schedule}/today`);
        }
    }, [router.isReady, router.query, validateDate, changeFullDate]);

    return <ScheduleCalendar />;
}
