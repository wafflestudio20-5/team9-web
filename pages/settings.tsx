import React from 'react';

import styles from './settings.module.scss';

import { Accordion } from '@components/Accordion';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { useThemeContext } from '@contexts/ThemeContext';
import CameraIcon from '@images/camera_icon.svg';

const settings = { 일반: ['테마', '기타'] };

const SettingItem = ({ text }: { text: string }) => {
    return <div>{text}</div>;
};

export default function SettingsPage() {
    const { user, logout } = useSessionContext();
    const { closeModal } = useModal();

    if (!user) return null;

    const { setTheme } = useThemeContext();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Accordion
                    title="일반"
                    sequence={settings.일반}
                    mapFunction={(item, index) => {
                        return <SettingItem key={index} text={item} />;
                    }}
                />
            </div>
            <div className={styles.userModal}>
                <div className={styles.userInfo}>
                    <div className={styles.photo}>
                        <button className={styles.addPhoto}>
                            <CameraIcon height="20px" className="icon" />
                        </button>
                    </div>
                    <div className={styles.basic}>
                        <span className={styles.name}>{user?.username}</span>
                        <span className={styles.id}>{user?.email}</span>
                    </div>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.settingBlock}>
                    <div className={styles.title}>테마</div>
                    <button onClick={() => setTheme('light')}>light</button>
                    <button onClick={() => setTheme('dark')}>dark</button>
                </div>
            </div>
        </div>
    );
}
