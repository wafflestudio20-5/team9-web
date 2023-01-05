import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';

import styles from './MiniCalendar.module.scss';

import { useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';
import before_icon from '@images/before_icon.svg';
import next_icon from '@images/next_icon.svg';
import { DAYS_ARR } from '@utils/formatDay';

export default function MiniCalendar() {
    const router = useRouter();
    const { yearNow, monthNow, dateNow } = useDateContext();
    const { calendarType } = useCalendarContext();
    const { year, month, date } = router.query;
    const [dateObj, setDateObj] = useState(
        year
            ? new Date(Number(year), Number(month) - 1, Number(date))
            : new Date(), // for `/today` pages. (year, month, date are undefined)
    );

    const firstDay = useMemo(() => {
        const temp = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        return temp.getDay();
    }, [dateObj]);

    const showPrevious = () => {
        const newDateObj = new Date(dateObj);
        newDateObj.setMonth(dateObj.getMonth() - 1, 1); // set datevalue to 1 to prevent date auto-correction problems
        setDateObj(newDateObj);
    };
    const showNext = () => {
        const newDateObj = new Date(dateObj);
        newDateObj.setMonth(dateObj.getMonth() + 1, 1);
        setDateObj(newDateObj);
    };

    const calendarDates = useMemo(() => {
        return Array.from(Array(42).keys()).map(item => {
            const temp = new Date(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate(),
            );
            temp.setDate(item - firstDay + 1);
            return temp;
        });
    }, [dateObj]);

    const getDateClassName = (item: Date) => {
        const today = new Date();
        if (item.toDateString() == today.toDateString()) {
            return styles.today;
        }
        if (
            item.getFullYear() == yearNow &&
            item.getMonth() + 1 == monthNow &&
            item.getDate() == dateNow
        ) {
            return styles.chosen;
        }
        if (item.getMonth() == dateObj.getMonth()) {
            return styles.currMonth;
        }
        return styles.notCurrMonth;
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.time}>
                <div>{`${dateObj.getFullYear()}년 ${
                    dateObj.getMonth() + 1
                }월`}</div>
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
            <div className={styles.header}>
                {DAYS_ARR.map((item, index) => {
                    return (
                        <div className={styles.item} key={index}>
                            <div>{item}</div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.main}>
                {calendarDates.map((item, index) => {
                    return (
                        <div
                            className={getDateClassName(item)}
                            key={index}
                            onClick={() => {
                                router.push(
                                    `/${calendarType}/${item.getFullYear()}/${
                                        item.getMonth() + 1
                                    }/${item.getDate()}`,
                                );
                            }}
                        >
                            <div>{item.getDate()}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
