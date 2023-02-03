import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './scheduleId.module.scss';

import { getParticularPostAPI, getRelatedPosts } from '@apis/blog';
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
    const router = useRouter();
    const scheduleId = Number(router.query.scheduleId);
    const postId = Number(router.query.post);

    const getSchedule = async (scheduleId: number) => {
        try {
            const res = await getParticularScheduleAPI(scheduleId, accessToken);
            setSchedule(res.data);
        } catch (error) {
            const message = '일정을 불러오지 못했습니다.';
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

    const getPost = async (postId: number) => {
        try {
            const res = await getParticularPostAPI(postId, accessToken);
            setPost(res.data);
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

    const getPosts = async (scheduleId: number) => {
        try {
            const res = await getRelatedPosts(scheduleId, accessToken);
            setPosts(res.data.results || []);
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
        getSchedule(Number(scheduleId));
    }, [scheduleId]);

    useEffect(() => {
        postId ? getPost(postId) : getPosts(scheduleId);
    }, [postId]);

    if (!schedule) return;

    return (
        <div className={styles.blogPage}>
            <div className={styles.scheduleWrapper}>
                <ScheduleContent schedule={schedule} />
            </div>
            {postId && post ? (
                <div className={styles.singlePost}>
                    <div className={styles.utilContainer}>
                        <button
                            onClick={() =>
                                router.push(`/blog/schedule/${scheduleId}`)
                            }
                        >
                            목록
                        </button>
                        <button
                            onClick={() => router.push(`/blog/post/${postId}`)}
                        >
                            포스트 상세 페이지
                        </button>
                    </div>
                    <PostViewer post={post} />
                </div>
            ) : (
                <div className={styles.posts}>
                    {posts.length < 1 ? (
                        <div>연관된 포스트가 없습니다.</div>
                    ) : (
                        posts.map(p => <PostPreview post={p} key={p.pid} />)
                    )}
                </div>
            )}
        </div>
    );
}

function PostPreview({ post }: { post: FullPost }) {
    const router = useRouter();
    const scheduleId = router.query.scheduleId;

    const viewFullContent = (postId: number) => {
        router.push(`/blog/schedule/${scheduleId}?post=${postId}`);
    };

    return (
        <div
            className={styles.postPreview}
            onClick={() => viewFullContent(post.pid)}
        >
            <h3 className={styles.titlePreview}>{post.title}</h3>
            <div className={styles.contentPreview}>{post.content}</div>
        </div>
    );
}
