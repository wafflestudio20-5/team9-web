import React from 'react';

import { useModalStateContext } from '../contexts/ModalContext';

import CalendarModal from './CalendarModal';
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
