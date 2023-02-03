import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './create.module.scss';

import { createPostAPI } from '@apis/blog';
import PostEditor from '@components/Blog/PostEditor';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

// temp data for related schedule list
const schedulesData: FullSchedule[] = [
    {
        id: 993,
        title: '',
        created_at: '',
        updated_at: '',
        created_by: 0,
        is_recurring: false,
        description: '',
        participants: [],
        show_content: false,
        protection_level: 1,
        recurring_schedule_group: null,
        recurring_end_at: null,
        cron_expr: null,
        start_at: '',
        end_at: '',
    },
];

export default function PostCreatePage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState(schedulesData); // need to bring related schedules from local storage
    const router = useRouter();

    const getScheduleIds = () => {
        const idList: { pk: number }[] = [];
        schedules.forEach(s => idList.push({ pk: s.id }));
        return idList;
    };

    const createPost = async (newPost: FormData) => {
        try {
            newPost.append('schedules_json', JSON.stringify(getScheduleIds()));
            const res = await createPostAPI(newPost, accessToken);
            successToast('새 글을 생성했습니다.');
            router.push(`/blog/post/${res.data.pid}`);
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

    /**
     * TODO: get associated schedules from local storage
     *       and assign it to `schedules` using `setSchedules` when this component is first rendered
     */

    return (
        <div className={styles.postCreatePage}>
            <ScheduleList schedules={schedules} />
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
