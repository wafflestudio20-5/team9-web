import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { CalendarType } from '../contexts/DateContext';

import styles from './RedirectPage.module.scss';

interface RedirectPageProps {
    calendarType: CalendarType;
    children: React.ReactNode;
}

export default function RedirectPage({
    calendarType,
    children,
}: RedirectPageProps) {
    const router = useRouter();

    useEffect(() => {
        router.push(`/${calendarType}/today`);
    }, []);

    return <div className={styles.redirect}>{children}</div>;
}
