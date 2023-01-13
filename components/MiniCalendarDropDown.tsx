import Image from 'next/image';
import React, { useState, useMemo } from 'react';

import styles from './MiniCalendar.module.scss';

import {
    DropDown,
    DropDownBody,
    DropDownHeader,
    useDropDown,
} from '@components/DropDown';
import before_icon from '@images/before_icon.svg';
import next_icon from '@images/next_icon.svg';
import { DAYS_ARR } from '@utils/formatDay';

interface MiniCalendarDropDownProps {
    title: string;
    date: Date;
    changeDate(newDate: Date): void;
}

export default function MiniCalendarDropDown({
    title,
    date,
    changeDate,
}: MiniCalendarDropDownProps) {
    const { dropDownRef, isOpen, openDropDown, closeDropDown } = useDropDown();

    const [dateObj, setDateObj] = useState(date);

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
            item.getFullYear() == date.getFullYear() &&
            item.getMonth() + 1 == date.getMonth() + 1 &&
            item.getDate() == date.getDate()
        ) {
            return styles.chosen;
        }
        if (item.getMonth() == dateObj.getMonth()) {
            return styles.currMonth;
        }
        return styles.notCurrMonth;
    };

    const onChangeDate = (newDate: Date) => {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        changeDate(newDate);
        closeDropDown();
    };

    return (
        <DropDown dropDownRef={dropDownRef}>
            <DropDownHeader openDropDown={openDropDown}>
                <input
                    type="text"
                    value={`${date.getFullYear()}년 ${
                        date.getMonth() + 1
                    }월 ${date.getDate()}일`}
                    onClick={openDropDown}
                    placeholder={title}
                    readOnly
                    style={{ width: '120px' }}
                />
            </DropDownHeader>
            <DropDownBody
                isOpen={isOpen}
                style={{ top: '40px', width: '250px' }}
            >
                <div className={styles.wrapper}>
                    <div className={styles.time}>
                        <div>{`${dateObj.getFullYear()}년 ${
                            dateObj.getMonth() + 1
                        }월`}</div>
                    </div>
                    <div className={styles.buttons}>
                        <button onClick={showPrevious} type="button">
                            <Image
                                src={before_icon}
                                alt="이전"
                                width={24}
                                height={24}
                            />
                        </button>
                        <button onClick={showNext} type="button">
                            <Image
                                src={next_icon}
                                alt="이후"
                                width={24}
                                height={24}
                            />
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
                                        onChangeDate(item);
                                    }}
                                >
                                    <div>{item.getDate()}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DropDownBody>
        </DropDown>
    );
}
