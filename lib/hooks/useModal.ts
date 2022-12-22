import { useEffect } from 'react';

import { useModalContext } from '../../contexts/ModalContext';

// use this to open and close modals
export function useModal() {
    const { state, setModalInfo } = useModalContext();
    let timeoutId: NodeJS.Timeout;

    // pass modal name and props you need in the modal (props is optional)
    // modal names list is at ModalContainer.tsx
    const openModal = (name: string, props?: object) => {
        setModalInfo({ name: name, props: props ?? null, state: 'open' });
    };

    // reset modal state in modalContext
    const closeModal = () => {
        setModalInfo(prev => ({ ...prev, state: 'closing' }));
        timeoutId = setTimeout(() => {
            setModalInfo({ name: null, props: null, state: 'closed' });
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return { state, openModal, closeModal };
}
