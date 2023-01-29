import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './scheduleId.module.scss';

import { getEntirePostAPI, getParticularPostAPI } from '@apis/blog';
import { getParticularScheduleAPI } from '@apis/calendar';
import PostViewer from '@components/Blog/PostViewer';
import ScheduleContent from '@components/ScheduleContent';
import { useSessionContext } from '@contexts/SessionContext';
import { FullPost } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast } from '@utils/customAlert';

export default function SchedulePage() {
    const { accessToken } = useSessionContext();
    const [schedule, setSchedule] = useState<FullSchedule>();
    const [posts, setPosts] = useState<FullPost[]>([]);
    const [post, setPost] = useState<FullPost>();
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const router = useRouter();

    const getSchedule = async (scheduleId: number) => {
        try {
            const res = await getParticularScheduleAPI(scheduleId, accessToken);
            setSchedule(res.data);
        } catch (error) {
            const message = '일정을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    const getPost = async (postId: number) => {
        try {
            const res = await getParticularPostAPI(postId, accessToken);
            setPost(res.data);
            setIsDetail(true);
        } catch (error) {
            const message = '글을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    const getPosts = async (scheduleId: number) => {
        try {
            const res = await getEntirePostAPI(scheduleId, accessToken);
            setPosts(res.data);
            setIsDetail(false);
        } catch (error) {
            const message = '글을 불러오지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    useEffect(() => {
        const { scheduleId, postId } = router.query;
        console.log(router);
        getSchedule(Number(scheduleId));
        postId ? getPost(Number(postId)) : getPosts(Number(scheduleId));
    }, [router.query]);

    if (!schedule) return;

    return (
        <div className={styles.blogPage}>
            <div className={styles.schedule}>
                <ScheduleContent schedule={schedule} />
            </div>
            {isDetail && post ? (
                <PostViewer post={post} />
            ) : (
                <div className={styles.posts}>
                    {posts.map(p => (
                        <PostPreview post={p} key={p.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

function PostPreview({ post }: { post: FullPost }) {
    return (
        <div className={styles.postPreview}>
            <div className={styles.titlePreview}>{post.title}</div>
            <div className={styles.contentPreview}>{post.content}</div>
        </div>
    );
}
