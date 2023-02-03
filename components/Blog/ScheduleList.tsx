import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './ScheduleList.module.scss';

import ScheduleContent from '@components/ScheduleContent';
import { FullSchedule } from '@customTypes/ScheduleTypes';

interface ScheduleListProps {
    schedules: FullSchedule[];
}

// list of schedules associated with a particular post
export default function ScheduleList({ schedules }: ScheduleListProps) {
    const [selectedId, setSelectedId] = useState<number>(0);
    const router = useRouter();

    return (
        <>
            {selectedId ? (
                <div className={styles.selectedSchedule}>
                    <div className={styles.utilContainer}>
                        <button onClick={() => setSelectedId(0)}>목록</button>
                        <button
                            onClick={() =>
                                router.push(`/blog/schedule/${selectedId}`)
                            }
                        >
                            일정 상세 페이지
                        </button>
                    </div>
                    <div className={styles.schedule}>
                        <ScheduleContent
                            schedule={schedules.find(s => s.id === selectedId)!}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.schedules}>
                    {schedules.length < 1 ? (
                        <div>연관된 일정이 없습니다.</div>
                    ) : (
                        schedules.map(s => (
                            <div
                                className={styles.schedule}
                                key={s.id}
                                onClick={() => setSelectedId(s.id)}
                            >
                                <ScheduleContent schedule={s} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}
