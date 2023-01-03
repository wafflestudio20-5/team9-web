import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import WeekCalendar from '@components/WeekCalendar/WeekCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function WeekPage() {
    const { validateDate, changeFullDate, setCalendarType } = useDateContext();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;
        const { year, month, date } = router.query;
        const isValid = validateDate(year, month, date);
        if (isValid) {
            changeFullDate(Number(year), Number(month), Number(date));
            setCalendarType(CalendarType.week);
        } else {
            // redirect to NOT_FOUND page?
            // or throw 404 error?
            router.push(`/${CalendarType.week}/today`);
        }
    }, [router.isReady, router.query, validateDate, changeFullDate]);

    return <WeekCalendar />;
}
