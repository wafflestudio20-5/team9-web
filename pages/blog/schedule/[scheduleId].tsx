import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './scheduleId.module.scss';

import { getMyPostsAPI, getParticularPostAPI } from '@apis/blog';
import { getParticularScheduleAPI } from '@apis/calendar';
import PostViewer from '@components/Blog/PostViewer';
import ScheduleContent from '@components/ScheduleContent';
import { useSessionContext } from '@contexts/SessionContext';
import { FullPost } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast } from '@utils/customAlert';

const tempPosts: FullPost[] = [
    {
        title: 'temp post1',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
        pid: 1,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post2',
        content: ' temp conte',
        pid: 2,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post3',
        content: ' temp conte',
        pid: 3,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post4',
        content: ' temp conte',
        pid: 4,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post5',
        content: ' temp conte',
        pid: 5,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post6',
        content: ' temp conte',
        pid: 6,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
    {
        title: 'temp post7',
        content: ' temp conte',
        pid: 7,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    },
];

export default function SchedulePage() {
    const { accessToken } = useSessionContext();
    const [schedule, setSchedule] = useState<FullSchedule>();
    const [posts, setPosts] = useState<FullPost[]>(tempPosts);
    const [post, setPost] = useState<FullPost>({
        title: 'temp post',
        content: ' temp conte',
        pid: 1,
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        schedules: [],
    });
    const router = useRouter();
    const scheduleId = router.query.scheduleId;
    const postId = router.query.post;

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
        return;
        // try {
        //     const res = await getEntirePostAPI(scheduleId, accessToken);
        //     setPosts(res.data);
        // } catch (error) {
        //     const message = '글을 불러오지 못했습니다.';
        //     if (axios.isAxiosError(error)) {
        //         errorToast(error.response?.data.message || message);
        //     } else {
        //         errorToast(message);
        //     }
        // }
    };

    useEffect(() => {
        getSchedule(Number(scheduleId));
    }, [scheduleId]);

    useEffect(() => {
        postId ? getPost(Number(postId)) : getPosts(Number(scheduleId));
    }, [postId]);

    if (!schedule) return;

    return (
        <div className={styles.blogPage}>
            <ScheduleContent schedule={schedule} />
            {postId && post ? (
                <div className={styles.singlePost}>
                    <button
                        onClick={() =>
                            router.push(`/blog/schedule/${scheduleId}`)
                        }
                    >
                        목록
                    </button>
                    <PostViewer post={post} />
                </div>
            ) : (
                <div className={styles.posts}>
                    {posts.map(p => (
                        <PostPreview post={p} key={p.pid} />
                    ))}
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
