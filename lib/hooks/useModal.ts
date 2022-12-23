import { useCallback, useEffect } from 'react';

import { MODAL_NAMES } from '../../components/ModalContainer';
import {
    useModalSetterContext,
    useModalStateContext,
} from '../../contexts/ModalContext';

// use this to open and close modals
export function useModal() {
    // const { state, setModalInfo } = useModalContext();
    const { updateModalInfo } = useModalSetterContext();
    const modals = useModalStateContext();
    let timeoutId: NodeJS.Timeout;

    // pass modal name and props you need in the modal (props is optional)
    // modal names list is at ModalContainer.tsx
    const openModal = (name: MODAL_NAMES, props?: object) => {
        updateModalInfo(name, { state: 'open', props: props ?? null });
    };

    // reset modal state in modalContext
    const closeModal = (name: MODAL_NAMES) => {
        updateModalInfo(name, { state: 'closing' });

        timeoutId = setTimeout(() => {
            updateModalInfo(name, { state: 'closed', props: null });
        }, 200);
    };

    const getState = useCallback(
        (name: MODAL_NAMES) => modals[name].state,
        [modals],
    );

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return { getState, openModal, closeModal };
}
