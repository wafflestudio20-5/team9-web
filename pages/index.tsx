import React from 'react';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';

export default function HomePage() {
    const { openModal } = useModal();
    return (
        <div>
            homepage
            <button onClick={() => openModal(MODAL_NAMES.schedule)}>
                일정 모달
            </button>
        </div>
    );
}
