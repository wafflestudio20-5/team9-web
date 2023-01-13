import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import styles from './CalendarModal.module.scss';

import MiniCalendar from '@components/MiniCalendar';
import ModalFrame from '@components/ModalFrame';
import { useCalendarContext } from '@contexts/CalendarContext';
import { MODAL_NAMES } from '@contexts/ModalContext';

export default function CalendarModal() {
    const router = useRouter();
    const { year, month, date } = router.query;
    const { calendarType } = useCalendarContext();
    const dateObjNow = useMemo(() => {
        return year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : new Date();
    }, [year, month, date]);
    return (
        <ModalFrame modalName={MODAL_NAMES.calendar}>
            <div className={styles.calendarModal}>
                <MiniCalendar
                    dateVariable={dateObjNow}
                    onDateClickFunction={date => {
                        router.push(
                            `/${calendarType}/${date?.getFullYear()}/${
                                date.getMonth() + 1
                            }/${date.getDate()}`,
                        );
                    }}
                />
            </div>
        </ModalFrame>
    );
}
