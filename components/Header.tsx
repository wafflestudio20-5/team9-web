import React, { useState } from 'react';
import Image from 'next/image';
import menu_icon from '../public/images/menu_icon.svg';
import calendar_icon from '../public/images/calendar_icon.svg';
import next_icon from '../public/images/next_icon.svg';
import before_icon from '../public/images/before_icon.svg';
import search_icon from '../public/images/search_icon.svg';
import help_icon from '../public/images/help_icon.svg';
import settings_icon from '../public/images/settings_icon.svg';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';

const PageOption = {
  month: { name: 'month', path: '/' },
  schedule: { name: 'schedule', path: '/schedule' },
};

const getValueFromPathname = (pathname: string) => {
  if (pathname === '/') {
    return PageOption.month.name;
  } else if (pathname === '/schedule') {
    return PageOption.schedule.name;
  }
};

function Header() {
  const router = useRouter();

  const onChangePageOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(PageOption[e.target.value]?.path || '/');
  };

  return (
    <>
      <header className={styles.header}>
        {/* 사이드바 아이콘 */}
        <div className={styles.sidebarContainer}>
          <button>
            <Image src={menu_icon} height={25} alt="sidebar" />
          </button>
        </div>

        {/* 타이틀 */}
        <div className={styles.titleContainer}>
          <Image src={calendar_icon} height={35} alt="calendar" />
          <span>캘린더</span>
        </div>

        {/* 날짜 */}
        <div className={styles.dateContainer}>
          <div>
            {/* 오늘 */}
            <button className={styles.today}>오늘</button>
            {/* 월 이동 버튼 */}
            <div className={styles.btnContainer}>
              <button>
                <Image src={before_icon} height={25} alt="last_month" />
              </button>
              <button>
                <Image src={next_icon} height={25} alt="next_month" />
              </button>
            </div>
            {/* 연월 */}
            <div className={styles.date}>
              <button>2023년 12월</button>
            </div>
          </div>
        </div>

        {/* 기타 기능들 */}
        <div className={styles.utilContainer}>
          {/* 검색 */}
          <div className={styles.search}>
            <button>
              <Image src={search_icon} height={25} alt="search" />
            </button>
            {/* 도움말 */}
          </div>
          <div className={styles.help}>
            <button>
              <Image src={help_icon} height={25} alt="help" />
            </button>
          </div>
          {/* 설정 */}
          <div className={styles.settings}>
            <button>
              <Image src={settings_icon} height={25} alt="settings" />
            </button>
          </div>
          {/* 페이지 옵션(월/일정) */}
          <select
            name="pageOption"
            id="pageOption"
            defaultValue={getValueFromPathname(router.pathname)}
            onChange={onChangePageOption}
          >
            <option value={PageOption.month.name}>월</option>
            <option value={PageOption.schedule.name}>일정</option>
          </select>
          {/* 사용자 */}
          <div className={styles.user}>
            <button>J</button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
