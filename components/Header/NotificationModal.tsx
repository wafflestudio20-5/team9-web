import React, { useEffect } from 'react';

import styles from './NotificationModal.module.scss';

import { getFollowRequests, getScheduleRequests } from '@apis/notification';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';

export default function NotificationModal() {
    const { accessToken } = useSessionContext();
    const getAndSetFollowRequests = () => {
        getFollowRequests(accessToken)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.message);
            });
    };
    const getAndSetScheduleRequests = () => {
        getScheduleRequests(accessToken)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    useEffect(() => {
        getAndSetFollowRequests();
        getAndSetScheduleRequests();
    });

    return (
        <ModalFrame modalName={MODAL_NAMES.notification}>
            <div className={styles.notificationModal}></div>
        </ModalFrame>
    );
}
