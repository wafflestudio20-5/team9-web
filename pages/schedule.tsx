import React from 'react';

import { CalendarType } from '@components/Header/CalendarTypeDropDown';
import RedirectPage from '@components/RedirectPage';

export default function RedirectToSchedulePage() {
    return (
        <RedirectPage calendarType={CalendarType.schedule}>
            일정 페이지로 이동 중
        </RedirectPage>
    );
}
