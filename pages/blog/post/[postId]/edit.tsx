import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import styles from './edit.module.scss';

import {
    editPostAPI,
    getParticularPostAPI,
    getRelatedSchedulesAPI,
} from '@apis/blog';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { Post } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

export default function PostEditPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const [initPost, setInitPost] = useState<Post>({ title: '', content: '' });
    const router = useRouter();
    const postId = useMemo(() => router.query.postId, [router.query.postId]);

    const editPost = async (postId: number, accessToken: string | null) => {
        const newPost: Post = {
            title: initPost.title,
            content: initPost.content,
        };
        try {
            await editPostAPI(postId, newPost, accessToken);
            successToast('글을 수정했습니다.');
            router.push(`/blog/post/${postId}`);
        } catch (error) {
            const message = '글을 수정하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    const getPost = async () => {
        try {
            const res = await getParticularPostAPI(Number(postId), accessToken);
            setInitPost(res.data);
        } catch (error) {
            const message = '글을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    const getRelatedSchedules = async () => {
        try {
            const res = await getRelatedSchedulesAPI(
                Number(postId),
                accessToken,
            );
            setSchedules(res.data);
        } catch (error) {
            const message = '연관된 일정을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    useEffect(() => {
        getPost();
        getRelatedSchedules();
    }, [router.query]);

    return (
        <div className={styles.postEditPage}>
            <div className={styles.left}>
                <ScheduleList schedules={schedules} />
            </div>
            <div className={styles.right}>
                <div className={styles.title}></div>
                <div className={styles.content}></div>
            </div>
        </div>
    );
}
