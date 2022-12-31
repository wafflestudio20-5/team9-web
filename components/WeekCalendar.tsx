import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { CalendarType } from '@components/Header/CalendarTypeDropDown';
import { useDateContext } from '@contexts/DateContext';

export default function WeekCalendar() {
    const { yearNow, monthNow, dateNow } = useDateContext();
    const router = useRouter();
    const now = new Date();

    useEffect(() => {
        if (
            isNaN(Number(yearNow)) ||
            isNaN(Number(monthNow)) ||
            isNaN(Number(dateNow))
        ) {
            // redirect to NOT_FOUND page?
            // or throw 404 error?
        }

        if (
            yearNow === now.getFullYear() &&
            monthNow === now.getMonth() + 1 &&
            dateNow === now.getDate()
        ) {
            router.push(`/${CalendarType.week}/today`);
        } else {
            router.push(
                `/${CalendarType.week}/${yearNow}/${monthNow}/${dateNow}`,
            );
        }
    }, [yearNow, monthNow, dateNow]);

    return <div>Week Calendar</div>;
}