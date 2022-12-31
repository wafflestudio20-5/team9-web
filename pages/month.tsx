import React from 'react';

import { CalendarType } from '@components/Header/CalendarTypeDropDown';
import RedirectPage from '@components/RedirectPage';

export default function RedirectToMonthPage() {
    return (
        <RedirectPage calendarType={CalendarType.month}>
            월별 페이지로 이동 중
        </RedirectPage>
    );
}
