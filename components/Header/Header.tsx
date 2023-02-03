import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import styles from './Header.module.scss';

import CalendarTypeDropDown from '@components/Header/CalendarTypeDropDown';
import HelpDropDown from '@components/Header/HelpDropDown';
import Searchbar from '@components/Header/Searchbar';
import SettingsDropDown from '@components/Header/SettingsDropDown';
import { CalendarType, useCalendarContext } from '@contexts/CalendarContext';
import { useDateContext } from '@contexts/DateContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useSidebarContext } from '@contexts/SidebarContext';
import { useThemeContext } from '@contexts/ThemeContext';
import BackIcon from '@images/back_icon.svg';
import BeforeIcon from '@images/before_icon.svg';
import DropdownIcon from '@images/dropdown_icon.svg';
import Logo from '@images/logo.svg';
import MenuIcon from '@images/menu_icon.svg';
import NextIcon from '@images/next_icon.svg';
import NotificationIcon from '@images/notification_icon.svg';
import SearchIcon from '@images/search_icon.svg';
import {
    getNextDay,
    getNextMonth,
    getNextWeek,
    getPrevDay,
    getPrevMonth,
    getPrevWeek,
    getMonthInThisWeek,
    getTwoMonth,
} from '@utils/calculateDate';

export default function Header() {
    const { yearNow, monthNow, dateNow, dayNow } = useDateContext();
    const { calendarType } = useCalendarContext();
    const { user } = useSessionContext();
    const { openModal } = useModal();
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const router = useRouter();
    const now = useMemo(() => new Date(), []);
    const { theme } = useThemeContext();

    const getPathname = (
        calendarType: CalendarType,
        year: number,
        month: number,
        date: number,
    ) => `/${calendarType}/${year}/${month}/${date}`;

    const moveToday = () => {
        switch (calendarType) {
            case CalendarType.day:
            case CalendarType.week:
            case CalendarType.month:
            case CalendarType.schedule:
                router.push(`/${calendarType}/today`);
                break;
            default:
                break;
        }
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
                fullDate = getPrevMonth(yearNow, monthNow);
                break;
            default:
                return;
        }
        const { year, month, date } = fullDate;
        const pathname = getPathname(calendarType, year, month, date);
        router.push(pathname);
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
                fullDate = getNextMonth(yearNow, monthNow);
                break;
            default:
                return;
        }
        const { year, month, date } = fullDate;
        const pathname = getPathname(calendarType, year, month, date);
        router.push(pathname);
    };

    const getSelectedDate = () => {
        switch (calendarType) {
            case CalendarType.day:
                return `${yearNow}년 ${monthNow}월 ${dateNow}일`;
            case CalendarType.week:
                return getMonthInThisWeek(yearNow, monthNow, dateNow, dayNow);
            case CalendarType.month:
                return `${yearNow}년 ${monthNow}월`;
            case CalendarType.schedule:
                return getTwoMonth(yearNow, monthNow, false);
            default:
                return `${yearNow}년 ${monthNow}월 ${dateNow}일`;
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
                        <MenuIcon className="icon" height="24px" />
                    </button>
                </div>

                {/* title */}
                <div
                    className={`${styles.titleContainer} ${
                        isSearchOpen && styles.hidden
                    }`}
                    onClick={() => router.push('/')}
                >
                    <div>
                        <Logo />
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
                        <BackIcon className="icon" height="24px" />
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
                            <BeforeIcon height="24px" className="icon" />
                        </button>
                        <button onClick={moveNext}>
                            <NextIcon height="24px" className="icon" />
                        </button>
                    </div>
                    <div className={styles.date}>
                        <button
                            className={isOpen ? styles.inactive : undefined}
                            onClick={() =>
                                !isOpen && openModal(MODAL_NAMES.miniCalendar)
                            }
                        >
                            {getSelectedDate()}
                            {!isOpen && (
                                <DropdownIcon height="24px" className="icon" />
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
                            <SearchIcon className="icon" height="24px" />
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
                        <button
                            onClick={() => openModal(MODAL_NAMES.notification)}
                        >
                            <NotificationIcon className="icon" height="24px" />
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
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
