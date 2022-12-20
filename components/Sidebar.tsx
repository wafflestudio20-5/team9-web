import styles from './Sidebar.module.scss';

export default function Sidebar() {
    return (
        <div className={styles.wrapper}>
            <div>Create Button</div>
            <div>Monthly Calendar</div>
            <div>My Calenders</div>
            <div>Other Calenders</div>
        </div>
    );
}
