import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { CalendarType } from './Header/CalendarTypeDropDown';
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
    const now = new Date();

    useEffect(() => {
        router.push(
            `/${calendarType}/${now.getFullYear()}/${
                now.getMonth() + 1
            }/${now.getDate()}`,
        );
    }, []);

    return <div className={styles.redirect}>{children}</div>;
}
