import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import styles from './edit.module.scss';

import {
    editPostAPI,
    getParticularPostAPI,
    getRelatedSchedulesAPI,
} from '@apis/blog';
import PostEditor from '@components/Blog/PostEditor';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { Post } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

export default function PostEditPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const router = useRouter();
    const postId = Number(router.query.postId);

    const editPost = async () => {
        const newPost: Post = {
            title,
            content,
        };
        try {
            await editPostAPI(postId, newPost, accessToken);
            successToast('글을 수정했습니다.');
            router.push(`/blog/post/${postId}`);
        } catch (error) {
            const message = '글을 수정하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
            } else {
                errorToast(message);
            }
        }
    };

    const getPost = async () => {
        try {
            const res = await getParticularPostAPI(Number(postId), accessToken);
            setTitle(res.data.title);
            setContent(res.data.content);
        } catch (error) {
            const message = '글을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
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
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
            } else {
                errorToast(message);
            }
        }
    };

    useEffect(() => {
        // getPost();
        // getRelatedSchedules();
    }, [router.query]);

    return (
        <div className={styles.postEditPage}>
            <ScheduleList schedules={schedules} />
            <div className={styles.editPost}>
                <div className={styles.guide}>post guide message?</div>
                <div className={styles.newPost}>
                    <PostEditor
                        title={title}
                        setTitle={setTitle}
                        content={content}
                        setContent={setContent}
                    />
                </div>
                <div className={styles.btnContainer}>
                    <button className={styles.edit} onClick={editPost}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
