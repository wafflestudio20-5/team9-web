import React, { useState, useMemo } from 'react';

import styles from './MiniCalendar.module.scss';

import BeforeIcon from '@images/before_icon.svg';
import NextIcon from '@images/next_icon.svg';
import { getCalendarDates } from '@utils/calculateDate';
import { DAYS } from '@utils/formatting';

interface MiniCalendarProps {
    dateVariable: Date;
    onDateClickFunction: (e: Date) => void;
}

export default function MiniCalendar({
    dateVariable,
    onDateClickFunction,
}: MiniCalendarProps) {
    const [dateObj, setDateObj] = useState(dateVariable);

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
        return getCalendarDates({ dateObj: dateObj, count: 42 });
    }, [dateObj]);

    const getDateClassName = (item: Date) => {
        const today = new Date();
        if (item.toDateString() == today.toDateString()) {
            return styles.today;
        }
        if (item.toDateString() == dateVariable.toDateString()) {
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
                <button onClick={showPrevious} type="button">
                    <BeforeIcon className="icon" width="24px" />
                </button>
                <button onClick={showNext} type="button">
                    <NextIcon className="icon" width="24px" />
                </button>
            </div>
            <div className={styles.header}>
                {DAYS.map((item, index) => {
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
                                onDateClickFunction(item);
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
