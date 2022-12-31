import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import WeekCalendar from '@components/WeekCalendar';
import { CalendarType, useDateContext } from '@contexts/DateContext';

export default function WeekPage() {
    const { setYearNow, setMonthNow, setDateNow, setDayNow, setCalendarType } =
        useDateContext();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;
        const { year, month, date } = router.query;

        if (
            isNaN(Number(year)) ||
            isNaN(Number(month)) ||
            isNaN(Number(date))
        ) {
            // redirect to NOT_FOUND page?
            // or throw 404 error?
            router.push(`/${CalendarType.week}/today`);
            return;
        }
        setYearNow(Number(year));
        setMonthNow(Number(month));
        setDateNow(Number(date));
        setDayNow(new Date(`${year}-${month}-${date}`).getDay());
        setCalendarType(CalendarType.week);
    }, [router.isReady, router.query]);

    return <WeekCalendar />;
}
