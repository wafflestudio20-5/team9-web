import React from 'react';

import { MODAL_NAMES } from '../../contexts/ModalContext';
import ModalFrame from '../ModalFrame';

import styles from './LoginModal.module.scss';

export default function LoginModal() {
    return (
        <ModalFrame modalName={MODAL_NAMES.login}>
            <div className={styles.loginModal}>login component</div>
        </ModalFrame>
    );
}