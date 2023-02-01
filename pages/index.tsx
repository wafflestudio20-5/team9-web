import { useRouter } from 'next/router';
import React from 'react';

import styles from './index.module.scss';

import { useSessionContext } from '@contexts/SessionContext';
import MainImage from '@images/main_images.svg';

export default function MainPage() {
    const { user } = useSessionContext();
    const router = useRouter();

    return (
        <div className={styles.mainPage}>
            <div className={styles.main}>
                <h1 className={styles.guide}>
                    계획이 중요한 당신에게,
                    <br />
                    일정을 회고하고 공유할 수 있게 하는
                    <br />
                    와플을 제공합니다.
                </h1>
                <h4>와플스튜디오 토이프로젝트 Team09</h4>
                <div className={styles.btnContainer}>
                    {user ? (
                        <button onClick={() => router.push('/month/today')}>
                            월별 캘린더 보기
                        </button>
                    ) : (
                        <button onClick={() => router.push('/login')}>
                            로그인으로 시작
                        </button>
                    )}
                </div>
                <div className={styles.mainImage}></div>
            </div>
        </div>
    );
}
