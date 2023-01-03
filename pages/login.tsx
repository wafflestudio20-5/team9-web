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
                <div className={styles.socialLoginContainer}>
                    <button className={styles.kakaoLogin}>
                        kakao로 로그인
                    </button>
                    <button className={styles.googleLogin}>
                        google로 로그인
                    </button>
                </div>
                <div className={styles.register}>
                    <div className={styles.textDescription}>
                        아직 계정이 없으신가요?
                    </div>
                    <div className={styles.registerButtonContainer}>
                        <button
                            className={styles.registerButton}
                            onClick={() => router.push('/register')}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
