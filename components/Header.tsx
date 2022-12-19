import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import before_icon from '../public/images/before_icon.svg';
import calendar_icon from '../public/images/calendar_icon.svg';
import help_icon from '../public/images/help_icon.svg';
import menu_icon from '../public/images/menu_icon.svg';
import next_icon from '../public/images/next_icon.svg';
import search_icon from '../public/images/search_icon.svg';
import settings_icon from '../public/images/settings_icon.svg';

import styles from './Header.module.scss';

const PageOption: { [key: string]: { name: string; path: string } } = {
    index: { name: 'index', path: '/' },
    month: { name: 'month', path: '/month' },
    schedule: { name: 'schedule', path: '/schedule' },
};

const getValueFromPathname = (pathname: string) => {
    if (pathname === '/') {
        return '';
    } else if (pathname === '/month') {
        return PageOption.month.name;
    } else if (pathname === '/schedule') {
        return PageOption.schedule.name;
    }
};

function Header() {
    const router = useRouter();

    const onChangePageOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const option = e.target.value;
        router.push(PageOption[option]?.path || '/');
    };

    return (
        <>
            <header className={styles.header}>
                {/* sidebar menu */}
                <div className={styles.sidebarContainer}>
                    <button>
                        <Image src={menu_icon} height={25} alt="sidebar" />
                    </button>
                </div>

                {/* title */}
                <div className={styles.titleContainer}>
                    <Image src={calendar_icon} height={35} alt="calendar" />
                    <span>캘린더</span>
                </div>

                {/* date (today, year, month) */}
                <div className={styles.dateContainer}>
                    <div>
                        <button className={styles.today}>오늘</button>
                        <div className={styles.btnContainer}>
                            <button>
                                <Image
                                    src={before_icon}
                                    height={25}
                                    alt="last_month"
                                />
                            </button>
                            <button>
                                <Image
                                    src={next_icon}
                                    height={25}
                                    alt="next_month"
                                />
                            </button>
                        </div>
                        <div className={styles.date}>
                            <button>2023년 12월</button>
                        </div>
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
                        <button>
                            <Image src={help_icon} height={25} alt="help" />
                        </button>
                    </div>
                    {/* settings */}
                    <div className={styles.settings}>
                        <button>
                            <Image
                                src={settings_icon}
                                height={25}
                                alt="settings"
                            />
                        </button>
                    </div>
                    {/* page options */}
                    <select
                        name="pageOption"
                        id="pageOption"
                        defaultValue={getValueFromPathname(router.pathname)}
                        onChange={onChangePageOption}
                    >
                        <option value={PageOption.index.name}>캘린더</option>
                        <option value={PageOption.month.name}>월</option>
                        <option value={PageOption.schedule.name}>일정</option>
                    </select>
                    {/* user */}
                    <div className={styles.user}>
                        <button>J</button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
