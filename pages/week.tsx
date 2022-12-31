import React from 'react';

import RedirectPage from '@components/RedirectPage';
import { CalendarType } from '@contexts/DateContext';

export default function RedirectToMonthPage() {
    return (
        <RedirectPage calendarType={CalendarType.week}>
            주별 페이지로 이동 중
        </RedirectPage>
    );
}
