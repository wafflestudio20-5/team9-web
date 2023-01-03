import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import styles from './login.module.scss';

import { useSessionContext } from '@contexts/SessionContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useSessionContext();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBox}>
                <form
                    className={styles.loginContainer}
                    onSubmit={e => {
                        e.preventDefault();
                        login({
                            email: userEmail,
                            password: userPassword,
                        });
                        router.push('/');
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
        </div>
    );
}
