import React from 'react';

import { useModalStateContext } from '../contexts/ModalContext';

import CalendarModal from './Header/CalendarModal';
import SearchDetailsModal from './Header/SearchDetailsModal';
import UserModal from './Header/UserModal';

export const enum MODAL_NAMES {
    user = 'user',
    calendar = 'calendar',
    search = 'search',
}

// React.ElementType could be inaccurate
const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    [MODAL_NAMES.user]: UserModal,
    [MODAL_NAMES.calendar]: CalendarModal,
    [MODAL_NAMES.search]: SearchDetailsModal,
};

export default function ModalContainer() {
    const modals = useModalStateContext();

    return (
        <>
            {Object.keys(modals).map(name => {
                const modal = modals[name];
                if (modal.state !== 'closed') {
                    const Modal = MODAL_COMPONENTS[name];
                    return <Modal key={name} {...modal.props} />;
                }
            })}
        </>
    );
}
