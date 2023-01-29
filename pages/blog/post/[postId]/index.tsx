import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

import { deletePostAPI, getRelatedSchedulesAPI } from '@apis/blog';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast, warningModal } from '@utils/customAlert';

export default function PostPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const router = useRouter();
    const postId = useMemo(() => Number(router.query.postId), [router]);

    const onClickEdit = () => {
        router.push(`edit`);
    };

    const deletePost = async (postId: number, accessToken: string | null) => {
        try {
            await deletePostAPI(postId, accessToken);
            successToast('글을 삭제했습니다.');
        } catch (error) {
            const message = '글을 삭제하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    const onClickDelete = async () => {
        const { isConfirmed } = await warningModal({
            title: '글을 삭제하시겠습니까?',
            text: '삭제된 일정은 복원할 수 없습니다.',
            confirmButtonText: '삭제',
        });

        if (!isConfirmed) return;
        await deletePost(postId, accessToken);
    };

    useEffect(() => {
        async () => {
            try {
                const res = await getRelatedSchedulesAPI(postId, accessToken);
                setSchedules(res.data); // temp
            } catch (error) {
                const message = '연관된 일정을 가져오지 못했습니다.';
                if (axios.isAxiosError(error)) {
                    errorToast(error.response?.data.message || message);
                } else {
                    errorToast(message);
                }
            }
        };
    }, [router.query]);

    return (
        <div className={styles.postPage}>
            <div className={styles.left}>
                <ScheduleList schedules={schedules} />
            </div>
            <div className={styles.right}>
                <div className={styles.post}>post</div>
                <div className={styles.comments}></div>
            </div>
        </div>
    );
}
