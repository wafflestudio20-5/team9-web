import React, { useState } from 'react';

import styles from './ScheduleList.module.scss';

import ScheduleContent from '@components/ScheduleContent';
import { FullSchedule } from '@customTypes/ScheduleTypes';

interface ScheduleListProps {
    schedules: FullSchedule[];
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
    const [selectedId, setSelectedId] = useState<number>(0);

    return (
        <>
            {selectedId ? (
                <div className={styles.selectedSchedule}>
                    <button onClick={() => setSelectedId(0)}>목록</button>
                    <div className={styles.schedule}>
                        <ScheduleContent
                            schedule={schedules.find(s => s.id === selectedId)!}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.schedules}>
                    {schedules.map(s => (
                        <div
                            className={styles.schedule}
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                        >
                            <ScheduleContent schedule={s} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}