import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import styles from './login.module.scss';

import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import GoogleLogo from '@images/google_logo.svg';
import KakaoLogo from '@images/kakao_logo.svg';

export default function LoginPage() {
    const router = useRouter();
    const {
        user,
        login,
        openGoogleLoginPage,
        openKakaoLoginPage,
        postHandleSocialLogin,
    } = useSessionContext();
    const { openModal } = useModal();

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
                            <div className={styles.textName}>?????????</div>
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
                            <div className={styles.textName}>????????????</div>
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
                            <button>?????????</button>
                        </div>
                    </form>
                    <div className={styles.divider}>
                        <div className={styles.dividerLine}></div>
                        <div className={styles.text}>?????? ?????? ?????????</div>
                        <div className={styles.dividerLine}></div>
                    </div>
                    <div className={styles.socialLoginContainer}>
                        <button
                            className={styles.kakaoLogin}
                            onClick={() => {
                                openKakaoLoginPage();
                            }}
                        >
                            <KakaoLogo height="13px" />
                            <div className={styles.text}>Kakao??? ?????????</div>
                        </button>
                        <button
                            className={styles.googleLogin}
                            onClick={() => {
                                openGoogleLoginPage();
                            }}
                        >
                            <GoogleLogo height="13px" />
                            <div className={styles.text}>Google??? ?????????</div>
                        </button>
                    </div>
                    <div className={styles.register}>
                        <div className={styles.textDescription}>
                            ?????? ????????? ????????????????
                        </div>
                        <button
                            className={styles.registerButton}
                            onClick={() => openModal(MODAL_NAMES.register)}
                        >
                            ????????????
                        </button>
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
