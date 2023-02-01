import React, { useState, useEffect } from 'react';

import styles from './NotificationModal.module.scss';
import { ProtectionLevelText, ScheduleRequestData } from '@customTypes/ScheduleTypes';

import { getFollowRequests, getScheduleRequests, responseScheduleRequests } from '@apis/notification';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';

export default function NotificationModal() {
    const { user, accessToken } = useSessionContext();
    const [followRequests, setFollowRequests] = useState();
    const [scheduleRequests, setScheduleRequests] = useState<ScheduleRequestData[]>();

    const getAndSetFollowRequests = () => {
        getFollowRequests(accessToken)
            .then(response => {
                console.log(response.data.results);
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const getAndSetScheduleRequests = () => {
        getScheduleRequests(accessToken)
            .then(response => {
                console.log(response.data.results);
                setScheduleRequests(response.data.results);
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const transferResponseScheduleRequests = (id:number, status:number) => {
        responseScheduleRequests(id, status, accessToken)
        .then(response => {
            console.log("yay!")
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    useEffect(() => {
        getAndSetFollowRequests();
        getAndSetScheduleRequests();
    }, []);

    return (
        <ModalFrame modalName={MODAL_NAMES.notification}>
            <div className={styles.notificationModal}>
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
                                    {ProtectionLevelText[req.protection_level]}
                                </div>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button onClick={() => {
                                    transferResponseScheduleRequests(user?.pk || -1, 1);
                                    getAndSetScheduleRequests();
                                }}>수락</button>
                                <button onClick={() => {
                                    transferResponseScheduleRequests(user?.pk || -1, 2);
                                    getAndSetScheduleRequests();
                                }}>거절</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ModalFrame>
    );
}
