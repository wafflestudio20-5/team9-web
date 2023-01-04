import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useDateContext } from '../contexts/DateContext';
import before_icon from '../public/images/before_icon.svg';
import next_icon from '../public/images/next_icon.svg';
import {
    getPrevMonth,
    getNextMonth,
    getCalendarDates,
    getLastDayInMonth,
} from '@utils/calculateDate';
import styles from './MiniCalendar.module.scss';

export default function MiniCalendar() {
    const { yearNow, monthNow, dateNow, dayNow } = useDateContext();
    const [yearToShow, setYearToShow] = useState(yearNow);
    const [monthToShow, setMonthToShow] = useState(monthNow);
    const [dayDatePair, setDayDatePair] = useState({
        date: dateNow,
        day: dayNow,
    });
    const calendarDates = useMemo(() => {
        return getCalendarDates(
            yearToShow,
            monthToShow,
            dayDatePair.date,
            dayDatePair.day,
        );
    }, [yearToShow, monthToShow, dayDatePair]);
    const showPrevious = () => {
        const prevMonth = getPrevMonth(yearToShow, monthToShow);
        setDayDatePair(
            calendarDates[0] == 1
                ? {
                      date: getLastDayInMonth(prevMonth.year, prevMonth.month),
                      day: 6,
                  }
                : { date: calendarDates[0], day: 0 },
        );
        setYearToShow(prevMonth.year);
        setMonthToShow(prevMonth.month);
    };
    const showNext = () => {
        const nextMonth = getNextMonth(yearToShow, monthToShow);
        setDayDatePair(
            calendarDates[-1] >= 7 // previous calendar ended with no dates from the next month
                ? { date: 1, day: 0 }
                : { date: calendarDates[-1], day: 6 },
        );
        setYearToShow(nextMonth.year);
        setMonthToShow(nextMonth.month);
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.time}>
                <div>{`${yearToShow}년 ${monthToShow}월`}</div>
            </div>
            <div className={styles.buttons}>
                <button onClick={showPrevious}>
                    <Image
                        src={before_icon}
                        alt="이전"
                        width={24}
                        height={24}
                    />
                </button>
                <button onClick={showNext}>
                    <Image src={next_icon} alt="이후" width={24} height={24} />
                </button>
            </div>
            <div className={styles.main}>
                {calendarDates.map(i => {
                    return <div>{i}</div>;
                })}
            </div>
        </div>
    );
}
