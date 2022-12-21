import React from 'react';

import { useModalStateContext } from '../contexts/ModalContext';

import UserModal from './UserModal';

export const enum MODAL_NAMES {
    user = 'user',
}

// React.ElementType could be inaccurate
const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    [MODAL_NAMES.user]: UserModal,
};

export default function ModalContainer() {
    const { name, props } = useModalStateContext();

    // all modals are closed
    if (!name) return null;

    const Modal = MODAL_COMPONENTS[name];

    return <Modal {...props} />;
}
