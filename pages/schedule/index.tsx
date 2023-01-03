import React from 'react';

import RedirectPage from '@components/RedirectPage';
import { CalendarType } from '@contexts/CalendarContext';

export default function RedirectToSchedulePage() {
    return (
        <RedirectPage calendarType={CalendarType.schedule}>
            일정 페이지로 이동 중
        </RedirectPage>
    );
}
