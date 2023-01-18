import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import styles from './login.module.scss';

import { useSessionContext } from '@contexts/SessionContext';

export default function LoginPage() {
    const router = useRouter();
    const {
        login,
        openGoogleLoginPage,
        openKakaoLoginPage,
        postHandleSocialLogin,
    } = useSessionContext();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const searchParams = useSearchParams();

    useEffect(() => {
        if (
            searchParams.get('error') !== null ||
            searchParams.get('access_token') !== null ||
            searchParams.get('refresh_token') !== null
        ) {
            postHandleSocialLogin({
                accessToken: searchParams.get('access_token'),
                refreshToken: searchParams.get('refresh_token'),
                error: searchParams.get('error'),
            });
            router.push('/');
        }
    });

    return (
        <>
            <div className={styles.loginPage}>
                <div className={styles.bg}></div>
                <div className={`${styles.shadow} ${styles.leftmost}`}></div>
                <div className={`${styles.shadow} ${styles.middleleft}`}></div>
                <div className={`${styles.shadow} ${styles.middleright}`}></div>
                <div className={`${styles.shadow} ${styles.uppermost}`}></div>
                <div className={`${styles.shadow} ${styles.downmost}`}></div>
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
                        <button
                            className={styles.kakaoLogin}
                            onClick={() => {
                                openKakaoLoginPage();
                            }}
                        >
                            kakao로 로그인
                        </button>
                        <button
                            className={styles.googleLogin}
                            onClick={() => {
                                openGoogleLoginPage();
                            }}
                        >
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
            <div className={styles.waffleFrame}>
                <div className={`${styles.fg} ${styles.middleleft}`}></div>
                <div className={`${styles.fg} ${styles.middleright}`}></div>
                <div className={`${styles.fg} ${styles.uppermost}`}></div>
                <div className={`${styles.fg} ${styles.downmost}`}></div>
            </div>
        </>
    );
}
