import MiniCalendar from '@components/MiniCalendar';
import React from 'react';

import styles from './Sidebar.module.scss';

export default function Sidebar() {
    return (
        <div className={styles.wrapper}>
            <div>Create Button</div>
            <div className={styles.calendar}>
                <MiniCalendar />
            </div>
            <div>My Calenders</div>
            <div>Other Calenders</div>
        </div>
    );
}
