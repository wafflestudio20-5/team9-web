import Image from 'next/image';
import React from 'react';

import { useSessionContext } from '../contexts/SessionContext';
import camera_icon from '../public/images/camera_icon.svg';

import ModalFrame from './ModalFrame';
import styles from './UserModal.module.scss';

export default function UserModal() {
    const { user, logout } = useSessionContext();

    // if (!user) return null;

    return (
        <>
            <ModalFrame>
                이것은 유저 정보 모달
                <div className={styles.userModal}>
                    <div className={styles.userInfo}>
                        <div className={styles.photo}>
                            <button className={styles.addPhoto}>
                                <Image
                                    src={camera_icon}
                                    height={20}
                                    alt="add_photo"
                                />
                            </button>
                        </div>
                        <div className={styles.basic}>
                            <span className={styles.name}>이름</span>
                            <span className={styles.id}>
                                emailaddress@gmail.com
                            </span>
                        </div>
                        <div className={styles.management}>
                            <button>Google 계정 관리</button>
                        </div>
                    </div>
                    <div className={styles.otherAccount}></div>
                    <div className={styles.logout}>
                        <button onClick={logout}>로그아웃</button>
                    </div>
                </div>
            </ModalFrame>
        </>
    );
}
