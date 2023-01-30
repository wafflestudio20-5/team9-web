import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './edit.module.scss';

import { editPostAPI, getParticularPostAPI } from '@apis/blog';
import PostEditor from '@components/Blog/PostEditor';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { FullPost, Post } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

export default function PostEditPage() {
    const { accessToken } = useSessionContext();
    const [post, setPost] = useState<FullPost>();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const router = useRouter();
    const postId = Number(router.query.postId);

    const editPost = async (newPost: Post) => {
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
            setPost(res.data);
            setSchedules(res.data.schedules);
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

    useEffect(() => {
        // getPost();
    }, [router.query]);

    if (!post) return;

    return (
        <div className={styles.postEditPage}>
            <ScheduleList schedules={schedules} />
            <div className={styles.editPost}>
                <div className={styles.guide}>post guide message?</div>
                <div className={styles.newPost}>
                    <PostEditor
                        initTitle={post.title}
                        initContent={post.content}
                        submitNewPost={editPost}
                    />
                </div>
            </div>
        </div>
    );
}
