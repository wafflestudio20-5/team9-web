import React from 'react';

import useModal from '../lib/hooks/useModal';

import styles from './ModalFrame.module.scss';

interface ModalFrameProps {
    children: React.ReactNode;
}

export default function ModalFrame({ children }: ModalFrameProps) {
    const { closeModal } = useModal();

    return (
        <>
            <div className={styles.overlay} onClick={closeModal}>
                {children}
            </div>
        </>
    );
}
