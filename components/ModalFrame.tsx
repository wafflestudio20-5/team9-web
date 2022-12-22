import React, { useEffect, useMemo, useState } from 'react';

import { useModal } from '../lib/hooks/useModal';

import styles from './ModalFrame.module.scss';

interface ModalFrameProps {
    children: React.ReactNode;
}

export default function ModalFrame({ children }: ModalFrameProps) {
    const { closeModal } = useModal();
    const [active, setActive] = useState<boolean>(true);
    let timeoutId: NodeJS.Timeout;

    const modalBodyClass = useMemo(() => {
        if (active) {
            return styles.open;
        } else {
            return styles.close;
        }
    }, [active]);

    const startCloseModal = () => {
        setActive(false);
        timeoutId = setTimeout(() => {
            closeModal();
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return (
        <>
            <div className={styles.overlay} onClick={startCloseModal}>
                <div
                    className={`${styles.modalBody} ${modalBodyClass}`}
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
