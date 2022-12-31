import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { CalendarType, useDateContext } from '../contexts/DateContext';

import styles from './RedirectPage.module.scss';

interface RedirectPageProps {
    calendarType: CalendarType;
    children: React.ReactNode;
}

export default function RedirectPage({
    calendarType,
    children,
}: RedirectPageProps) {
    const { setYearNow, setMonthNow, setDateNow, setDayNow } = useDateContext();
    const router = useRouter();
    const now = new Date();

    useEffect(() => {
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const day = now.getDay();
        setYearNow(year);
        setMonthNow(month);
        setDateNow(date);
        setDayNow(day);
        router.push(`/${calendarType}/${year}/${month}/${date}`);
    }, []);

    return <div className={styles.redirect}>{children}</div>;
}
