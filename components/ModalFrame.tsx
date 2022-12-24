import React, { useMemo } from 'react';

import { useModal } from '../lib/hooks/useModal';

import { MODAL_NAMES } from './ModalContainer';
import styles from './ModalFrame.module.scss';

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
            >
                <div
                    className={`${styles.modalBody} ${styles[state]}`}
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
