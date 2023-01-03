import React, { useMemo } from 'react';

import styles from './ModalFrame.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';

interface ModalFrameProps {
    modalName: MODAL_NAMES;
    isDim?: boolean;
    children: React.ReactNode;
}

export default function ModalFrame({
    modalName,
    isDim,
    children,
}: ModalFrameProps) {
    const { getState, closeModal } = useModal();
    const state = useMemo(() => getState(modalName), [getState]);

    return (
        <>
            <div
                className={`${styles.backdrop} ${styles[state]} ${
                    isDim && styles.dim
                }`}
                onClick={e => {
                    e.stopPropagation();
                    closeModal(modalName);
                }}
            ></div>
            <div className={`${styles.modalBody} ${styles[state]}`}>
                {children}
            </div>
        </>
    );
}
