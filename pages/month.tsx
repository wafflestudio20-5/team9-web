import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import styles from './month.module.scss';

export default function MonthPage() {
    const { isOpen } = useSidebarContext();
    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div>Month Page</div>
        </div>
    );
}
