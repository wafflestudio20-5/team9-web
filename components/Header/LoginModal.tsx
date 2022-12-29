import React, { useState } from 'react';

import { MODAL_NAMES } from '../../contexts/ModalContext';
import ModalFrame from '../ModalFrame';

import styles from './LoginModal.module.scss';
import { useSessionContext } from '../../contexts/SessionContext';

export default function LoginModal() {
    const {
        login
    } = useSessionContext();

    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');

    return (
        <ModalFrame modalName={MODAL_NAMES.login}>
            <div className={styles.loginModal}>
                <form
                    className={styles.loginContainer}
                    onSubmit = {e => {
                        e.preventDefault();
                        login({
                            id: userId,
                            password: userPassword,
                        });
                    }}
                >
                    <div className={styles.textContainer}>
                        <div className={styles.textName}>
                            아이디:
                        </div>
                        <input
                            type="text"
                            className={styles.text}
                            value={userId}
                            onChange={e => {
                                setUserId?.(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textName}>
                            비밀번호:
                        </div>
                        <input
                            type="text"
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
                        <button className={styles.socialLoginButton}>소셜 로그인</button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}