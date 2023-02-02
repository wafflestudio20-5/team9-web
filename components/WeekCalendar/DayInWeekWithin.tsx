import DailyEvent from '@components/EventComponents/DailyEvent';
import { DailyLayerData, FullSchedule } from '@customTypes/ScheduleTypes';
import styles from './DayInWeekWithin.module.scss';

export default function DayInWeekWithin({
    dateString,
    dailyLayerData,
}: {
    dateString: string;
    dailyLayerData: DailyLayerData;
}) {
    return (
        <div className={styles.wrapper}>
            {Object.entries(dailyLayerData).map(([layer, eventData], index) => {
                return (
                    <div
                        className={styles.layer}
                        style={{ zIndex: `${layer + 1}` }}
                    >
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
