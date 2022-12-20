import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import styles from './month.module.scss';
import { DAYS_ARR } from '../lib/utils/formatDay';
import DayinMonth from '../components/DayinMonth';

export default function MonthPage() {
    const { isOpen } = useSidebarContext();

    // data for month to be displayed
    // will fetch from api request
    // need to specify response format
    const month = [
        { year: 2022, month: 11, date: 27, events: [] },
        { year: 2022, month: 11, date: 28, events: [] },
        { year: 2022, month: 11, date: 29, events: [] },
        { year: 2022, month: 11, date: 30, events: [] },
        { year: 2022, month: 12, date: 1, events: [] },
        { year: 2022, month: 12, date: 2, events: [] },
        { year: 2022, month: 12, date: 3, events: [] },
        { year: 2022, month: 12, date: 4, events: [] },
        { year: 2022, month: 12, date: 5, events: [] },
        { year: 2022, month: 12, date: 6, events: [] },
        { year: 2022, month: 12, date: 7, events: [] },
        { year: 2022, month: 12, date: 8, events: [] },
        { year: 2022, month: 12, date: 9, events: [] },
        { year: 2022, month: 12, date: 10, events: [] },
        { year: 2022, month: 12, date: 11, events: [] },
        { year: 2022, month: 12, date: 12, events: [] },
        { year: 2022, month: 12, date: 13, events: [] },
        { year: 2022, month: 12, date: 14, events: [] },
        { year: 2022, month: 12, date: 15, events: [] },
        { year: 2022, month: 12, date: 16, events: [] },
        { year: 2022, month: 12, date: 17, events: [] },
        { year: 2022, month: 12, date: 18, events: [] },
        { year: 2022, month: 12, date: 19, events: [] },
        { year: 2022, month: 12, date: 20, events: [] },
        { year: 2022, month: 12, date: 21, events: [] },
        { year: 2022, month: 12, date: 22, events: [] },
        { year: 2022, month: 12, date: 23, events: [] },
        { year: 2022, month: 12, date: 24, events: [] },
        { year: 2022, month: 12, date: 25, events: [] },
        { year: 2022, month: 12, date: 26, events: [] },
        { year: 2022, month: 12, date: 27, events: [] },
        { year: 2022, month: 12, date: 28, events: [] },
        { year: 2022, month: 12, date: 29, events: [] },
        { year: 2022, month: 12, date: 30, events: [] },
        { year: 2022, month: 12, date: 31, events: [] },
    ];
    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div className={styles.headrow}>
                {DAYS_ARR.map(item => {
                    return <div>{item}</div>;
                })}
            </div>
            <div className={styles.month}>
                {month.map(day => {
                    return <DayinMonth data={day} />;
                })}
            </div>
        </div>
    );
}
