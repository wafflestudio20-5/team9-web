import React, { useState, useEffect } from 'react';

import styles from './NotificationModal.module.scss';

import {
    getFollowRequests,
    getScheduleRequests,
    responseFollowRequests,
    responseScheduleRequests,
} from '@apis/notification';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { FollowRequestData } from '@customTypes/FollowTypes';
import {
    ProtectionLevelText,
    ScheduleRequestData,
} from '@customTypes/ScheduleTypes';

export default function NotificationModal() {
    const { user, accessToken } = useSessionContext();
    const [followRequests, setFollowRequests] = useState<FollowRequestData[]>();
    const [scheduleRequests, setScheduleRequests] =
        useState<ScheduleRequestData[]>();
    const [isSchedule, setIsSchedule] = useState<boolean>(true);

    const getAndSetFollowRequests = () => {
        getFollowRequests(accessToken)
            .then(response => {
                setFollowRequests(response.data.results);
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const getAndSetScheduleRequests = () => {
        getScheduleRequests(accessToken)
            .then(response => {
                setScheduleRequests(response.data.results);
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const transferResponseFollowRequests = (id: number, approved: boolean) => {
        responseFollowRequests(id, approved, accessToken)
            .then(response => {
                getAndSetFollowRequests();
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const transferResponseScheduleRequests = (id: number, status: number) => {
        responseScheduleRequests(id, status, accessToken)
            .then(response => {
                getAndSetScheduleRequests();
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    useEffect(() => {
        getAndSetFollowRequests();
        getAndSetScheduleRequests();
    }, []);

    return (
        <ModalFrame modalName={MODAL_NAMES.notification}>
            <div className={styles.notificationModal}>
                <div className={styles.buttonContainer}>
                    <button
                        onClick={() => {
                            setIsSchedule(true);
                        }}
                    >
                        일정 수락
                    </button>
                    <button
                        onClick={() => {
                            setIsSchedule(false);
                        }}
                    >
                        팔로우 수락
                    </button>
                </div>
                {isSchedule ? (
                    <>
                        {scheduleRequests?.map((req, index) => {
                            return (
                                <div className={styles.request} key={index}>
                                    <div className={styles.textContainer}>
                                        <div className={styles.textTitle}>
                                            title:
                                        </div>
                                        <div className={styles.textText}>
                                            {req.title}
                                        </div>
                                    </div>
                                    <div className={styles.textContainer}>
                                        <div className={styles.textTitle}>
                                            공개 범위:
                                        </div>
                                        <div className={styles.textText}>
                                            {
                                                ProtectionLevelText[
                                                    req.protection_level
                                                ]
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.buttonContainer}>
                                        <button
                                            onClick={() => {
                                                transferResponseScheduleRequests(
                                                    req.id || -1,
                                                    1,
                                                );
                                            }}
                                        >
                                            수락
                                        </button>
                                        <button
                                            onClick={() => {
                                                transferResponseScheduleRequests(
                                                    req.id || -1,
                                                    2,
                                                );
                                            }}
                                        >
                                            거절
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {followRequests?.map((req, index) => {
                            return (
                                <div className={styles.request} key={index}>
                                    <div className={styles.textContainer}>
                                        {req.followee.username}님이 팔로우를
                                        신청하셨습니다.
                                    </div>
                                    <div className={styles.buttonContainer}>
                                        <button
                                            onClick={() => {
                                                transferResponseFollowRequests(
                                                    req.id,
                                                    true,
                                                );
                                            }}
                                        >
                                            수락
                                        </button>
                                        <button
                                            onClick={() => {
                                                transferResponseFollowRequests(
                                                    req.id,
                                                    false,
                                                );
                                            }}
                                        >
                                            거절
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </ModalFrame>
    );
}
