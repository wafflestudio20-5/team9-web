import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import styles from './Header.module.scss';

import CalendarTypeDropDown from '@components/Header/CalendarTypeDropDown';
import HelpDropDown from '@components/Header/HelpDropDown';
import Searchbar from '@components/Header/Searchbar';
import SettingsDropDown from '@components/Header/SettingsDropDown';
import { CalendarType, useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import apps_icon from '@images/apps_icon.svg';
import back_icon from '@images/back_icon.svg';
import before_icon from '@images/before_icon.svg';
import calendar_icon from '@images/calendar_icon.svg';
import dropdown_icon from '@images/dropdown_icon.svg';
import menu_icon from '@images/menu_icon.svg';
import next_icon from '@images/next_icon.svg';
import search_icon from '@images/search_icon.svg';
import {
    getNextDay,
    getNextMonth,
    getNextWeek,
    getPrevDay,
    getPrevMonth,
    getPrevWeek,
    getMonthInThisWeek,
} from '@utils/calculateDate';

function Header() {
    const { yearNow, monthNow, dateNow, dayNow, calendarType } =
        useDateContext();
    const { user } = useSessionContext();
    const { openModal } = useModal();
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const router = useRouter();
    const now = useMemo(() => new Date(), []);

    const getPathname = (
        calendarType: CalendarType,
        year: number,
        month: number,
        date: number,
    ) => `/${calendarType}/${year}/${month}/${date}`;

    const moveToday = () => {
        router.push(`/${calendarType}/today`);
    };

    const moveNext = () => {
        let fullDate = { year: yearNow, month: monthNow, date: dateNow };
        switch (calendarType) {
            case CalendarType.day:
                fullDate = getNextDay(yearNow, monthNow, dateNow);
                break;
            case CalendarType.week:
                fullDate = getNextWeek(yearNow, monthNow, dateNow);
                break;
            case CalendarType.month:
                fullDate = getNextMonth(yearNow, monthNow);
                break;
            case CalendarType.schedule:
                break;
            default:
                break;
        }
        const { year, month, date } = fullDate;
        const pathname = getPathname(calendarType, year, month, date);
        router.push(pathname);
    };

    const movePrev = () => {
        let fullDate = { year: yearNow, month: monthNow, date: dateNow };
        switch (calendarType) {
            case CalendarType.day:
                fullDate = getPrevDay(yearNow, monthNow, dateNow);
                break;
            case CalendarType.week:
                fullDate = getPrevWeek(yearNow, monthNow, dateNow);
                break;
            case CalendarType.month:
                fullDate = getPrevMonth(yearNow, monthNow);
                break;
            case CalendarType.schedule:
                break;
            default:
                break;
        }
        const { year, month, date } = fullDate;
        const pathname = getPathname(calendarType, year, month, date);
        router.push(pathname);
    };

    // schedule should be modified
    const getSelectedDate = () => {
        switch (calendarType) {
            case CalendarType.day:
                return `${yearNow}년 ${monthNow}월 ${dateNow}일`;
            case CalendarType.week:
                return getMonthInThisWeek(yearNow, monthNow, dateNow, dayNow);
            case CalendarType.month:
                return `${yearNow}년 ${monthNow}월`;
            case CalendarType.schedule:
                return `${yearNow}년 ${monthNow}월`;
            default:
                break;
        }
    };

    const closeSearchbar = () => {
        setIsSearchOpen(false);
    };

    const { isOpen, openSidebar, closeSidebar } = useSidebarContext();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                {/* sidebar menu */}
                <div
                    className={`${styles.sidebarContainer} ${
                        isSearchOpen && styles.hidden
                    }`}
                >
                    <button onClick={isOpen ? closeSidebar : openSidebar}>
                        <Image src={menu_icon} height={24} alt="sidebar" />
                    </button>
                </div>

                {/* title */}
                <div
                    className={`${styles.titleContainer} ${
                        isSearchOpen && styles.hidden
                    }`}
                >
                    <div>
                        <Image src={calendar_icon} height={40} alt="calendar" />
                        <span className={styles.dateToday}>
                            {now.getDate()}
                        </span>
                    </div>
                    <span>캘린더</span>
                </div>

                {/* back to original header */}
                <div
                    className={`${styles.back} ${
                        !isSearchOpen && styles.hidden
                    }`}
                >
                    <button onClick={closeSearchbar}>
                        <Image src={back_icon} height={24} alt="back" />
                    </button>
                    <span>검색</span>
                </div>
            </div>

            <div className={styles.middle}>
                {/* date (today, year, month) */}
                <div
                    className={`${styles.dateContainer} ${
                        isSearchOpen && styles.hidden
                    }`}
                >
                    <button className={styles.today} onClick={moveToday}>
                        오늘
                    </button>
                    <div className={styles.btnContainer}>
                        <button onClick={movePrev}>
                            <Image
                                src={before_icon}
                                height={24}
                                alt="prev_calendar"
                            />
                        </button>
                        <button onClick={moveNext}>
                            <Image
                                src={next_icon}
                                height={24}
                                alt="next_calendar"
                            />
                        </button>
                    </div>
                    <div className={styles.date}>
                        <button
                            className={isOpen ? styles.inactive : undefined}
                            onClick={() =>
                                !isOpen && openModal(MODAL_NAMES.calendar)
                            }
                        >
                            {getSelectedDate()}
                            {!isOpen && (
                                <Image
                                    src={dropdown_icon}
                                    height={24}
                                    alt="date"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* utils */}
                <div
                    className={`${styles.utilContainer} ${
                        isSearchOpen && styles.hidden
                    }`}
                >
                    {/* search */}
                    <div className={styles.search}>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                setIsSearchOpen(true);
                            }}
                        >
                            <Image src={search_icon} height={24} alt="search" />
                        </button>
                    </div>
                    <div className={styles.help}>
                        <HelpDropDown />
                    </div>
                    <div className={styles.settings}>
                        <SettingsDropDown />
                    </div>
                    <div className={styles.calendarType}>
                        <CalendarTypeDropDown />
                    </div>
                </div>
                <Searchbar isOpen={isSearchOpen} close={closeSearchbar} />
            </div>
            <div className={styles.right}>
                {/* user */}
                <div className={styles.userContainer}>
                    <div className={styles.apps}>
                        <button>
                            <Image src={apps_icon} height={24} alt="apps" />
                        </button>
                    </div>
                    {user ? (
                        <div className={styles.user}>
                            <button onClick={() => openModal(MODAL_NAMES.user)}>
                                {user?.username[0] || 'J'}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.login}>
                            <button onClick={() => router.push('/login')}>
                                로그인
                            </button>
                            <button onClick={() => router.push('/register')}>
                                회원가입
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
