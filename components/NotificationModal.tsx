import React from 'react';

import ModalFrame from './ModalFrame';
import styles from './NotificationModal.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';

export default function NotificationModal() {
    return (
        <ModalFrame modalName={MODAL_NAMES.notification}>
            <div className={styles.notificationModal}></div>
        </ModalFrame>
    );
}
