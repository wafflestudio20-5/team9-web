import React from 'react';

import styles from './settings.module.scss';

import { Accordion } from '@components/Accordion';
import { useThemeContext } from '@contexts/ThemeContext';

const settings = { 일반: ['테마', '기타'] };

const SettingItem = ({ text }: { text: string }) => {
    return <div>{text}</div>;
};

export default function SettingsPage() {
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
