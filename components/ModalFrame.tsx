import React from 'react';

import { useModal } from '../lib/hooks/useModal';

import styles from './ModalFrame.module.scss';

interface ModalFrameProps {
    children: React.ReactNode;
}

export default function ModalFrame({ children }: ModalFrameProps) {
    const { state, closeModal } = useModal();

    return (
        <>
            <div
                className={`${styles.backdrop} ${styles[state]}`}
                onClick={closeModal}
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
