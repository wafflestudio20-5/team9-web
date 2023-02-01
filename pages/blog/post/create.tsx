import axios from 'axios';
import React, { useEffect, useState } from 'react';

import styles from './create.module.scss';

import { createPostAPI } from '@apis/blog';
import PostEditor from '@components/Blog/PostEditor';
import ScheduleList from '@components/Blog/ScheduleList';
import { useScheduleContext } from '@contexts/ScheduleContext';
import { useSessionContext } from '@contexts/SessionContext';
import { Post } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

const schedulesData: FullSchedule[] = [
    {
        id: 1,
        title: 'test schedule',
        created_at: '2022-02-02',
        updated_at: '2022-02-02',
        created_by: 7,
        participants: [
            { username: 'participants1', pk: 1, email: 'use@emaril.com' },
            { username: 'participants1', pk: 2, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
            { username: 'participants1', pk: 3, email: 'use@emaril.com' },
        ],
        is_recurring: false,
        show_content: true,
        protection_level: 1,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus. Phasellus venenatis efficitur rutrum. Mauris non tortor turpis. Cras semper imperdiet nisl ut pellentesque.m',
        start_at: '2023-01-30 00:00:00',
        end_at: '2023-01-30 00:00:00',
        recurring_schedule_group: null,
    },
    {
        id: 2,
        title: 'test schedule2',
        created_at: '2022-02-02',
        updated_at: '2022-02-02',
        created_by: 7,
        participants: [],
        is_recurring: false,
        show_content: true,
        protection_level: 1,
        description: 'lorem ipsum',
        start_at: '2023-01-30 00:00:00',
        end_at: '2023-01-30 00:00:00',
        recurring_schedule_group: null,
    },
    // {
    //     id: 3,
    //     title: 'test schedule3',
    //     created_at: '2022-02-02',
    //     updated_at: '2022-02-02',
    //     created_by: 7,
    //     participants: [],
    //     is_recurring: false,
    //     show_content: true,
    //     protection_level: 1,
    //     description: 'lorem ipsum',
    //     start_at: '2023-01-30 00:00:00',
    //     end_at: '2023-01-30 00:00:00',
    //     recurring_schedule_group: null,
    // },
    // {
    //     id: 4,
    //     title: 'test schedule4',
    //     created_at: '2022-02-02',
    //     updated_at: '2022-02-02',
    //     created_by: 7,
    //     participants: [],
    //     is_recurring: false,
    //     show_content: true,
    //     protection_level: 1,
    //     description: 'lorem ipsum',
    //     start_at: '2023-01-30 00:00:00',
    //     end_at: '2023-01-30 00:00:00',
    //     recurring_schedule_group: null,
    // },
    // {
    //     id: 6,
    //     title: 'test schedule4',
    //     created_at: '2022-02-02',
    //     updated_at: '2022-02-02',
    //     created_by: 7,
    //     participants: [],
    //     is_recurring: false,
    //     show_content: true,
    //     protection_level: 1,
    //     description: 'lorem ipsum',
    //     start_at: '2023-01-30 00:00:00',
    //     end_at: '2023-01-30 00:00:00',
    //     recurring_schedule_group: null,
    // },
    // {
    //     id: 5,
    //     title: 'test schedule4',
    //     created_at: '2022-02-02',
    //     updated_at: '2022-02-02',
    //     created_by: 7,
    //     participants: [],
    //     is_recurring: false,
    //     show_content: true,
    //     protection_level: 1,
    //     description: 'lorem ipsum',
    //     start_at: '2023-01-30 00:00:00',
    //     end_at: '2023-01-30 00:00:00',
    //     recurring_schedule_group: null,
    // },
];

export default function PostCreatePage() {
    const { accessToken } = useSessionContext();
    // const { schedules } = useScheduleContext();
    const [schedules, setSchedules] = useState(schedulesData); // temp

    const getScheduleIds = () => {
        const idList: { pk: number }[] = [];
        schedules.forEach(s => idList.push({ pk: s.id }));
        return idList;
    };

    const createPost = async (newPost: FormData) => {
        try {
            // newPost.append('schedules', JSON.stringify(getScheduleIds()));
            await createPostAPI(newPost, accessToken);
            successToast('새 글을 생성했습니다.');
        } catch (error) {
            console.log(error);
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

    return (
        <div className={styles.postCreatePage}>
            <ScheduleList schedules={schedules} />
            <div className={styles.createPost}>
                <div className={styles.guide}>post guide message?</div>
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
