import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import styles from './schedule.module.scss';

export default function SchedulePage() {
    const { isOpen } = useSidebarContext();
    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div>Schedule Page</div>
        </div>
    );
}
