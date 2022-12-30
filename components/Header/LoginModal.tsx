import React, { useState } from 'react';

import { MODAL_NAMES, useModal } from '../../contexts/ModalContext';
import { useSessionContext } from '../../contexts/SessionContext';
import ModalFrame from '../ModalFrame';

import styles from './LoginModal.module.scss';

export default function LoginModal() {
    const { login } = useSessionContext();
    const { closeModal } = useModal();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    return (
        <ModalFrame modalName={MODAL_NAMES.login}>
            <div className={styles.loginModal}>
                <form
                    className={styles.loginContainer}
                    onSubmit={e => {
                        e.preventDefault();
                        login({
                            email: userEmail,
                            password: userPassword,
                        });
                        closeModal(MODAL_NAMES.login);
                    }}
                >
                    <div className={styles.textContainer}>
                        <div className={styles.textName}>이메일:</div>
                        <input
                            type="text"
                            className={styles.text}
                            value={userEmail}
                            onChange={e => {
                                setUserEmail?.(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textName}>비밀번호:</div>
                        <input
                            type="password"
                            className={styles.text}
                            value={userPassword}
                            onChange={e => {
                                setUserPassword?.(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.loginButtonContainer}>
                        <button>로그인</button>
                    </div>
                </form>
                <div className={styles.socialLogin}>
                    <div className={styles.textDescription}>
                        다른 로그인 방법을 찾으시나요?
                    </div>
                    <div className={styles.socialLoginButtonContainer}>
                        <button className={styles.socialLoginButton}>
                            소셜 로그인
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
