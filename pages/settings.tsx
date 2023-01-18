import { useThemeContext } from '@contexts/ThemeContext';
import styles from './settings.module.scss';

export default function SettingsPage() {
    const { theme, setTheme } = useThemeContext();

    return (
        <>
            <button onClick={() => setTheme('light')}>light</button>
            <button onClick={() => setTheme('dark')}>dark</button>
            <div className={styles.tester}>background color</div>
        </>
    );
}
