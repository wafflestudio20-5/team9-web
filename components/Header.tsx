import Image from 'next/image';
import React, { useMemo } from 'react';

import { useDateContext } from '../contexts/DateContext';
import { useSidebarContext } from '../contexts/SidebarContext';
import { useModal } from '../lib/hooks/useModal';
import before_icon from '../public/images/before_icon.svg';
import calendar_icon from '../public/images/calendar_icon.svg';
import help_icon from '../public/images/help_icon.svg';
import menu_icon from '../public/images/menu_icon.svg';
import next_icon from '../public/images/next_icon.svg';
import search_icon from '../public/images/search_icon.svg';
import settings_icon from '../public/images/settings_icon.svg';

import CalendarTypeDropDown from './CalendarTypeDropDown';
import styles from './Header.module.scss';
import HelpDropDown from './HelpDropDown';
import { MODAL_NAMES } from './ModalContainer';
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
    const { openModal } = useModal();
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

    const { isOpen, openSidebar, closeSidebar } = useSidebarContext();

    return (
        <>
            <header className={styles.header}>
                {/* sidebar menu */}
                <div className={styles.sidebarContainer}>
                    <button onClick={isOpen ? closeSidebar : openSidebar}>
                        <Image src={menu_icon} height={25} alt="sidebar" />
                    </button>
                </div>

                {/* title */}
                <div className={styles.titleContainer}>
                    <div>
                        <span className={styles.dateToday}>
                            {now.getDate()}
                        </span>
                        <Image src={calendar_icon} height={35} alt="calendar" />
                    </div>
                    <span>캘린더</span>
                </div>

                {/* date (today, year, month) */}
                <div className={styles.dateContainer}>
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
                                height={25}
                                alt="last_month"
                            />
                        </button>
                        <button onClick={moveToNextMonth}>
                            <Image
                                src={next_icon}
                                height={25}
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
                            {yearNow}년 {monthNow}월 {!isOpen && '▾'}
                        </button>
                    </div>
                </div>

                {/* utils */}
                <div className={styles.utilContainer}>
                    {/* search */}
                    <div className={styles.search}>
                        <button>
                            <Image src={search_icon} height={25} alt="search" />
                        </button>
                    </div>
                    {/* help */}
                    <div className={styles.help}>
                        <HelpDropDown />
                    </div>
                    {/* settings */}
                    <div className={styles.settings}>
                        <SettingsDropDown />
                    </div>
                    {/* page options */}
                    <div className={styles.pageOptions}>
                        <CalendarTypeDropDown />
                    </div>
                    {/* user */}
                    <div className={styles.user}>
                        <button onClick={() => openModal(MODAL_NAMES.user)}>
                            J
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
