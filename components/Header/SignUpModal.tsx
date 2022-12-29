import React from 'react';

import { MODAL_NAMES } from '../../contexts/ModalContext';
import ModalFrame from '../ModalFrame';

import styles from './SignUpModal.module.scss';

export default function LoginModal() {
    return (
        <ModalFrame modalName={MODAL_NAMES.signUp}>
            <div className={styles.signUpModal}>signup component</div>
        </ModalFrame>
    );
}
