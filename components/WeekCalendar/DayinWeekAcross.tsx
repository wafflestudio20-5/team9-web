import { useBoxSizeContext } from '@contexts/BoxSizeContext';
import { LayerData } from '@customTypes/ScheduleTypes';
import getEventComponent from '@utils/getEventComponent';

import styles from './DayinWeekAcross.module.scss';

export default function DayinWeekAcross({
    eventData,
    dateData,
}: {
    eventData: LayerData;
    dateData: string;
}) {
    const eventDataEntries = Object.entries(eventData);
    const { boxWidth } = useBoxSizeContext();
    return (
        <div className={styles.day} style={{ width: `${boxWidth}px` }}>
            {eventDataEntries.map(([layer, event], index) => {
                return getEventComponent({
                    dateString: dateData,
                    data: event,
                    index: index,
                });
            })}
        </div>
    );
}
