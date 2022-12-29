import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { useDateContext } from '../../contexts/DateContext';
import { MODAL_NAMES, useModal } from '../../contexts/ModalContext';
import { useSessionContext } from '../../contexts/SessionContext';
import { useSidebarContext } from '../../contexts/SidebarContext';
import apps_icon from '../../public/images/apps_icon.svg';
import back_icon from '../../public/images/back_icon.svg';
import before_icon from '../../public/images/before_icon.svg';
import calendar_icon from '../../public/images/calendar_icon.svg';
import dropdown_icon from '../../public/images/dropdown_icon.svg';
import menu_icon from '../../public/images/menu_icon.svg';
import next_icon from '../../public/images/next_icon.svg';
import search_icon from '../../public/images/search_icon.svg';

import CalendarTypeDropDown from './CalendarTypeDropDown';
import styles from './Header.module.scss';
import HelpDropDown from './HelpDropDown';
import Searchbar from './Searchbar';
import SettingsDropDown from './SettingsDropDown';

function Header() {
    const {
        yearNow,
        monthNow,
        setYearNow,
        setMonthNow,
        setDateNow,
        setDayNow,
    } = useDateContext();
    const { user } = useSessionContext();
    const { openModal } = useModal();
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const now = useMemo(() => new Date(), []);

    const changeDateToToday = () => {
        setYearNow(now.getFullYear());
        setMonthNow(now.getMonth() + 1);
        setDateNow(now.getDate());
        setDayNow(now.getDay());
    };

    const moveToNextMonth = () => {
        if (monthNow === 12) {
            setYearNow(yearNow + 1);
            setMonthNow(1);
            setDayNow(new Date(`${yearNow + 1}-1-1`).getDay());
        } else {
            setMonthNow(monthNow + 1);
            setDayNow(new Date(`${yearNow}-${monthNow + 1}-1`).getDay());
        }
        setDateNow(1);
    };

    const moveToLastMonth = () => {
        if (monthNow === 1) {
            setYearNow(yearNow - 1);
            setMonthNow(12);
            setDayNow(new Date(`${yearNow - 1}-12-1`).getDay());
        } else {
            setMonthNow(monthNow - 1);
            setDayNow(new Date(`${yearNow}-${monthNow - 1}-1`).getDay());
        }
        setDateNow(1);
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
                    <button
                        className={styles.today}
                        onClick={changeDateToToday}
                    >
                        오늘
                    </button>
                    <div className={styles.btnContainer}>
                        <button onClick={moveToLastMonth}>
                            <Image
                                src={before_icon}
                                height={24}
                                alt="last_month"
                            />
                        </button>
                        <button onClick={moveToNextMonth}>
                            <Image
                                src={next_icon}
                                height={24}
                                alt="next_month"
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
                            {yearNow}년 {monthNow}월{' '}
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
                                J
                            </button>
                        </div>
                    ) : (
                        <div className={styles.login}>
                            <button onClick={() => openModal(MODAL_NAMES.login)}>
                                로그인
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
