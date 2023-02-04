import router from 'next/router';
import React from 'react';

import styles from './UserModal.module.scss';

import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import CameraIcon from '@images/camera_icon.svg';

export default function UserModal() {
    const { user, logout } = useSessionContext();
    const { closeModal } = useModal();

    if (!user) return null;

    return (
        <ModalFrame modalName={MODAL_NAMES.user}>
            <div className={styles.userModal}>
                <div className={styles.userInfo}>
                    <div
                        className={`${styles.photo} ${
                            user.image ? styles.whiteBack : ''
                        }`}
                    >
                        <button className={styles.addPhoto}>
                            <CameraIcon height="20px" className="icon" />
                        </button>
                        {user.image ? (
                            <img
                                className={styles.imageRound}
                                src={user.image}
                            />
                        ) : (
                            <div className={styles.imageRound}></div>
                        )}
                    </div>
                    <div className={styles.basic}>
                        <span className={styles.name}>{user?.username}</span>
                        <span className={styles.id}>{user?.email}</span>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.button}>
                        <button
                            onClick={() => {
                                router.push('/settings');
                            }}
                        >
                            설정
                        </button>
                    </div>
                    <div className={styles.button}>
                        <button
                            onClick={() => {
                                logout();
                                closeModal(MODAL_NAMES.user);
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
