import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import styles from './create.module.scss';

import { createPostAPI } from '@apis/blog';
import PostEditor from '@components/Blog/PostEditor';
import ScheduleList from '@components/Blog/ScheduleList';
import { useScheduleContext } from '@contexts/ScheduleContext';
import { useSessionContext } from '@contexts/SessionContext';
import { errorToast, successToast } from '@utils/customAlert';

export default function PostCreatePage() {
    const { accessToken } = useSessionContext();
    const { schedules, setSchedules, setIsSelectMode } = useScheduleContext();
    const router = useRouter();

    const getScheduleIds = () => {
        if (!schedules) {
            return [];
        }
        return schedules.map(event => ({ pk: event.id }));
    };

    const createPost = async (newPost: FormData) => {
        try {
            newPost.append('schedules_json', JSON.stringify(getScheduleIds()));
            const res = await createPostAPI(newPost, accessToken);
            successToast('새 글을 생성했습니다.');
            router.push(`/blog/post/${res.data.pid}`);
            setSchedules([]);
            setIsSelectMode(false);
        } catch (error) {
            const message = '글을 생성하지 못했습니다.';
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
        setSchedules(schedules ?? []);
    }, []);

    return (
        <div className={styles.postCreatePage}>
            <ScheduleList schedules={schedules ?? []} />
            <div className={styles.createPost}>
                <div className={styles.guide}></div>
                <div className={styles.newPost}>
                    <PostEditor
                        initTitle=""
                        initContent=""
                        initImage=""
                        submitNewPost={createPost}
                    />
                </div>
            </div>
        </div>
    );
}
