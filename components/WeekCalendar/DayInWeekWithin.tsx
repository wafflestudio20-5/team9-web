import styles from './DayinWeekWithin.module.scss';

import DailyEvent from '@components/EventComponents/DailyEvent';
import { DailyLayerData, FullSchedule } from '@customTypes/ScheduleTypes';

export default function DayinWeekWithin({
    dailyLayerData,
}: {
    dailyLayerData: DailyLayerData;
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.backgroundProvider} />
            {Object.entries(dailyLayerData).map(([layer, eventData], index) => {
                return (
                    <div key={index} className={styles.layer}>
                        {eventData &&
                            eventData.map(
                                (
                                    eventDataItem: {
                                        textTop: number;
                                        event: FullSchedule;
                                    },
                                    index: number,
                                ) => {
                                    return (
                                        <DailyEvent
                                            key={index}
                                            textTop={eventDataItem.textTop}
                                            event={eventDataItem.event}
                                            layer={Number(layer)}
                                        />
                                    );
                                },
                            )}
                    </div>
                );
            })}
        </div>
    );
}
