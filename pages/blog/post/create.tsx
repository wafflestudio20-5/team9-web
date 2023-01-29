import axios from 'axios';
import React, { useEffect, useState } from 'react';

import styles from './create.module.scss';

import { createPostAPI } from '@apis/blog';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { Post } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import { errorToast, successToast } from '@utils/customAlert';

export default function PostCreatePage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]); // get from the context?
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const createPost = async () => {
        const newPost: Post = {
            title,
            content,
        };

        try {
            await createPostAPI(newPost, accessToken);
            successToast('새 글을 생성했습니다.');
        } catch (error) {
            const message = '글을 생성하지 못했습니다.';
            if (axios.isAxiosError(error)) {
                errorToast(error.response?.data.message || message);
            } else {
                errorToast(message);
            }
        }
    };

    useEffect(() => {
        // TODO:
        // get selected schedules may be from context
        // and setSchedules(selectedSchedules)
    }, []);

    return (
        <div className={styles.postCreatePage}>
            <ScheduleList schedules={schedules} />
            <div className={styles.createPost}>
                <div className={styles.guide}>post guide message?</div>
                <div className={styles.newPost}>
                    <div className={styles.title}>
                        <label htmlFor="title"></label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.content}>text editor?</div>
                </div>
                <div className={styles.btnContainer}>
                    <button className={styles.create} onClick={createPost}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
