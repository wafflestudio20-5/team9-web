import React, { useMemo } from 'react';

import styles from './ModalFrame.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';

interface ModalFrameProps {
    modalName: MODAL_NAMES;
    isDim?: boolean;
    onClickBackDrop?(): void;
    children: React.ReactNode;
}

export default function ModalFrame({
    modalName,
    isDim,
    onClickBackDrop,
    children,
}: ModalFrameProps) {
    const { getState, closeModal } = useModal();
    const state = useMemo(() => getState(modalName), [getState]);

    const handleClickBackDrop = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (onClickBackDrop) {
            onClickBackDrop();
        } else {
            closeModal(modalName);
        }
    };

    return (
        <>
            <div
                className={`${styles.backdrop} ${styles[state]} ${
                    isDim && styles.dim
                }`}
                onClick={handleClickBackDrop}
            ></div>
            <div className={`${styles.modalBody} ${styles[state]}`}>
                {children}
            </div>
        </>
    );
}
