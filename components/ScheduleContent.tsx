import React, { useMemo } from 'react';

import styles from './ScheduleContent.module.scss';

import { useSessionContext } from '@contexts/SessionContext';
import {
    FullSchedule,
    Participant,
    ProtectionLevelText,
} from '@customTypes/ScheduleTypes';
import AccountDefaultIcon from '@images/account_default_icon.svg';
import LockIcon from '@images/lock_icon.svg';
import PeopleIcon from '@images/people_icon.svg';
import TextIcon from '@images/text_icon.svg';
import { parseCronExpression } from '@utils/cronExpression';
import { DAYS, formatTime } from '@utils/formatting';

interface ScheduleContentProps {
    schedule: FullSchedule;
}

export default function ScheduleContent({ schedule }: ScheduleContentProps) {
    const { user } = useSessionContext();
    const startDate = useMemo(() => new Date(schedule.start_at), [schedule]);
    const endDate = useMemo(() => new Date(schedule.end_at), [schedule]);

    const mergeScheduleEndDateTime = (startDate: Date, endDate: Date) => {
        if (startDate.toString() === endDate.toString()) return '';

        let result = '';
        let different = false;

        if (startDate.getFullYear() !== endDate.getFullYear()) {
            result += `${endDate.getFullYear()}년`;
            different = true;
        }
        if (different || startDate.getMonth() + 1 !== endDate.getMonth() + 1) {
            result += `${different ? ' ' : ''}${endDate.getMonth() + 1}월`;
            different = true;
        }
        if (different || startDate.getDate() !== endDate.getDate()) {
            result += `${different ? ' ' : ''}${endDate.getDate()}일(${
                DAYS[endDate.getDay()]
            })`;
            different = true;
        }

        result += (different ? ' ' : '') + formatTime(endDate);

        return result;
    };

    return (
        <div className={styles.scheduleContent}>
            <h2 className={styles.title}>
                <div
                    className={styles.color}
                    style={{ backgroundColor: 'burlywood' }}
                />
                {user?.pk !== schedule.created_by && !schedule.show_content
                    ? '바쁨'
                    : schedule.title}
            </h2>
            <div className={styles.times}>
                <div className={styles.date}>
                    <span>
                        {startDate.getFullYear()}년 {startDate.getMonth() + 1}월{' '}
                        {startDate.getDate()}
                        일({DAYS[startDate.getDay()]}) {formatTime(startDate)}
                    </span>
                    {startDate.toString() !== endDate.toString() && (
                        <span className={styles.dash}>-</span>
                    )}
                    <span>{mergeScheduleEndDateTime(startDate, endDate)}</span>
                </div>
                {schedule.is_recurring && (
                    <div className={styles.recurrence}>
                        <span>
                            {schedule.cron_expr &&
                                parseCronExpression(schedule.cron_expr)}{' '}
                            (종료일:{' '}
                            {schedule.recurring_end_at &&
                                schedule.recurring_end_at.split(' ')[0]}
                            )
                        </span>
                    </div>
                )}
            </div>
            {user?.pk !== schedule.created_by && !schedule.show_content ? (
                <></>
            ) : (
                <>
                    {schedule.participants?.length ? (
                        <div className={styles.participants}>
                            <div className={styles.icon}>
                                <PeopleIcon className="icon" height="24px" />
                            </div>
                            <ul>
                                {schedule.participants.map((p, i) => (
                                    <ParticipantItem participant={p} key={i} />
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {schedule.description && (
                        <div className={styles.description}>
                            <div className={styles.icon}>
                                <TextIcon className="icon" height="24px" />
                            </div>
                            <p>{schedule.description}</p>
                        </div>
                    )}
                    {user?.pk === schedule.created_by && (
                        <div className={styles.protectionLevel}>
                            <div className={styles.icon}>
                                <LockIcon className="icon" height="24px" />
                            </div>
                            <div>
                                {ProtectionLevelText[schedule.protection_level]}
                                {schedule.show_content || (
                                    <span className={styles.hideDetails}>
                                        (세부사항 비공개)
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function ParticipantItem({ participant }: { participant: Participant }) {
    return (
        <li className={styles.participant}>
            <AccountDefaultIcon className="icon" height="24px" />
            <div>
                <span className={styles.username}>{participant.username}</span>
                <span className={styles.email}>{participant.email}</span>
            </div>
        </li>
    );
}
