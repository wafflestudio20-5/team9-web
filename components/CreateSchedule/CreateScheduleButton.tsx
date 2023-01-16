import axios from 'axios';
import Image from 'next/image';
import React from 'react';

import styles from './CreateScheduleButton.module.scss';

import { CalendarURLParams, createScheduleAPI } from '@apis/calendar';
import { InitSchedule } from '@components/ScheduleModal';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import { ProtectionLevel, Schedule } from '@customTypes/ScheduleTypes';
import add_icon from '@images/add_icon.svg';
import { errorToast, successToast } from '@utils/customAlert';

interface CreateScheduleButtonProps {
    text?: string;
    style?: React.CSSProperties;
}

export default function CreateScheduleButton({
    text,
    style,
}: CreateScheduleButtonProps) {
    const { openModal } = useModal();
    const { user, accessToken } = useSessionContext();

    const initSchedule: InitSchedule = {
        title: '',
        startDate: new Date(),
        endDate: new Date(),
        protectionLevel: ProtectionLevel.pulbic,
        hideDetails: false,
        description: '',
        participants: [],
    };

    const createSchedule = async (
        urlParams: CalendarURLParams,
        newSchedule: Schedule,
    ) => {
        if (!user) {
            errorToast('로그인을 먼저 해주세요.');
            return false;
        }

        try {
            await createScheduleAPI(urlParams, newSchedule, accessToken);
            successToast('일정이 추가되었습니다.');
            return true;
        } catch (error) {
            const message = '일정을 생성하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message ?? message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    return (
        <div
            className={styles.createScheduleButton}
            onClick={() =>
                openModal(MODAL_NAMES.schedule, {
                    initSchedule,
                    requestSchedule: createSchedule,
                })
            }
            style={style}
        >
            <Image src={add_icon} alt="create_schedule" width={40} />
            {text && <span>{text}</span>}
        </div>
    );
}
