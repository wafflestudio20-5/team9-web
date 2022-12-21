import React, { useEffect } from 'react';

import { useSessionContext } from '../contexts/SessionContext';

import ModalFrame from './ModalFrame';
import styles from './UserModal.module.scss';

export default function UserModal() {
    const { user } = useSessionContext();

    // if (!user) return null;

    return (
        <>
            <ModalFrame>
                <div
                    className={styles.userInfo}
                    onClick={e => e.stopPropagation()}
                >
                    이것은 유저 정보 모달
                </div>
            </ModalFrame>
        </>
    );
}
