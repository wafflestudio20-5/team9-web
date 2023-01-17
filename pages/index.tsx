import React from 'react';

import { CalendarURLParams, getEntireScheduleAPI } from '@apis/calendar';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';

export default function HomePage() {
    const { openModal } = useModal();
    const { user, accessToken } = useSessionContext();

    const schedule: FullSchedule = {
        id: 100,
        title: 'test',
        description: 'testdes',
        start_at: '2022-01-12 00:00:00',
        end_at: '2022-01-13 00:15:00',
        participants: [],
        created_at: '',
        updated_at: '',
        created_by: 7,
        protection_level: 2,
        show_content: true,
    };

    return (
        <div>
            homepage
            <button
                onClick={() => openModal(MODAL_NAMES.schedule, { schedule })}
            >
                일정 모달
            </button>
        </div>
    );
}
