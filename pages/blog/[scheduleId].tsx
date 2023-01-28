import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './blog.module.scss';

import { getParticularScheduleAPI } from '@apis/calendar';
import { useSessionContext } from '@contexts/SessionContext';
import { FullPost } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast } from '@utils/customAlert';

export default function BlogPage() {
    const { accessToken } = useSessionContext();
    const [schedule, setSchedule] = useState<FullSchedule>();
    const [posts, setPosts] = useState<FullPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        const { scheduleId } = router.query;
        console.log(router);
        async () => {
            try {
                const res = await getParticularScheduleAPI(
                    Number(scheduleId),
                    accessToken,
                );
                setSchedule(res.data);
                // setPosts(res.data.posts);
            } catch (error) {
                const message = '일정을 불러오지 못했습니다.';
                if (axios.isAxiosError(error)) {
                    errorToast(error.response?.data.message || message);
                } else {
                    errorToast(message);
                }
            }
        };
    }, []);

    return (
        <div className={styles.blogPage}>
            <div className={styles.left}>
                {/* <ScheduleContent schedule={schedule} /> */}
            </div>
            <div className={styles.right}>
                {/* <Blog postId={selectedPostId}/> */}
            </div>
        </div>
    );
}
