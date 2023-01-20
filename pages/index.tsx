import React from 'react';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';

export default function HomePage() {
    const { openModal } = useModal();
    const schedule: FullSchedule = {
        id: 1,
        participants: [],
        title: 'edited',
        protection_level: 1,
        start_at: '2023-01-18 00:00:00',
        end_at: '2023-01-18 00:00:00',
        description: 'adf',
        created_at: '2023-01-18 19:36:41',
        updated_at: '2023-01-18 19:36:41',
        created_by: 7,
        show_content: true,
    };

    return (
        <div>
            <button
                onClick={() =>
                    openModal(MODAL_NAMES.scheduleView, { schedule })
                }
            >
                일정
            </button>
            homepage
        </div>
    );
}
