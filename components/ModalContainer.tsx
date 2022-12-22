import React from 'react';

import { useModalContext } from '../contexts/ModalContext';

import CalendarModal from './calendarModaltemp';
import UserModal from './UserModal';

export const enum MODAL_NAMES {
    user = 'user',
    calendar = 'calendar',
}

// React.ElementType could be inaccurate
const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    [MODAL_NAMES.user]: UserModal,
    [MODAL_NAMES.calendar]: CalendarModal,
};

export default function ModalContainer() {
    const { name, props } = useModalContext();

    // all modals are closed
    if (!name) return null;

    const Modal = MODAL_COMPONENTS[name];

    return <Modal {...props} />;
}
