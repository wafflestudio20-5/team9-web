import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import styles from './index.module.scss';

import {
    createCommentAPI,
    deleteCommentAPI,
    deletePostAPI,
    editCommentAPI,
    getEntireCommentAPI,
    getParticularPostAPI,
} from '@apis/blog';
import PostViewer from '@components/Blog/PostViewer';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { Comment, FullComment, FullPost } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import DeleteIcon from '@images/delete_icon.svg';
import EditIcon from '@images/edit_icon.svg';
import { errorToast, successToast, warningModal } from '@utils/customAlert';

const commentsData = [
    {
        cid: 97,
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus.',
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        is_updated: false,
        post: {
            title: 'test post',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
            pid: 1,
            created_at: '2023-01-23',
            updated_at: '2023-01-29',
            created_by: 7,
            schedules: [],
        },
    },
    {
        cid: 98,
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus.',
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        is_updated: false,
        post: {
            title: 'test post',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
            pid: 1,
            created_at: '2023-01-23',
            updated_at: '2023-01-29',
            created_by: 7,
            schedules: [],
        },
    },
    {
        cid: 99,
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus.',
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        is_updated: false,
        post: {
            title: 'test post',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
            pid: 1,
            created_at: '2023-01-23',
            updated_at: '2023-01-29',
            created_by: 7,
            schedules: [],
        },
    },
    {
        cid: 100,
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus.',
        created_by: 7,
        created_at: '2023-01-30',
        updated_at: '2023-01-30',
        is_updated: false,
        post: {
            title: 'test post',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
            pid: 1,
            created_at: '2023-01-23',
            updated_at: '2023-01-29',
            created_by: 7,
            schedules: [],
        },
    },
];

const postdata = {
    title: 'test post',
    content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
    pid: 1,
    created_at: '2023-01-23',
    updated_at: '2023-01-29',
    created_by: 7,
    schedules: [],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Waffles_with_Strawberries.jpg/1200px-Waffles_with_Strawberries.jpg',
};

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
    {
        id: 3,
        title: 'test schedule3',
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
    {
        id: 4,
        title: 'test schedule4',
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
    {
        id: 6,
        title: 'test schedule4',
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
    {
        id: 5,
        title: 'test schedule4',
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
];

export default function PostPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>(schedulesData);
    const [post, setPost] = useState<FullPost>();
    const [comments, setComments] = useState<FullComment[]>(commentsData);
    const [newComment, setNewComment] = useState<Comment>({
        post: post?.pid || 0,
        content: '',
    });
    const router = useRouter();
    const postId = Number(router.query.postId);

    const onClickEdit = () => {
        router.push(`/blog/post/${postId}/edit`);
    };

    const deletePost = async (postId: number, accessToken: string | null) => {
        try {
            await deletePostAPI(postId, accessToken);
            successToast('글을 삭제했습니다.');
            router.replace('/month/today');
        } catch (error) {
            const message = '글을 삭제하지 못했습니다.';
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

    const onClickDelete = async () => {
        const { isConfirmed } = await warningModal({
            title: '글을 삭제하시겠습니까?',
            text: '삭제된 포스트는 복원할 수 없습니다.',
            confirmButtonText: '삭제',
        });

        if (!isConfirmed) return;
        await deletePost(postId, accessToken);
    };

    const addNewComment = async () => {
        if (!newComment.content) {
            errorToast('댓글을 작성해주세요.');
            return;
        }

        if (!post) return;

        try {
            const res = await createCommentAPI(
                post.pid,
                newComment,
                accessToken,
            );
            setNewComment(prev => ({ ...prev, content: '' }));
            setComments(prev => [...prev, res.data]);
            successToast('댓글을 추가했습니다.');
        } catch (error) {
            const message = '댓글을 추가하지 못했습니다.';
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
            const res = await getParticularPostAPI(postId, accessToken);
            setPost(res.data);
            // setSchedules(res.data.schedules);
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

    const getComments = async () => {
        try {
            const res = await getEntireCommentAPI(postId, accessToken);
            setComments(res.data.results || []);
        } catch (error) {
            const message = '댓글을 불러오지 못했습니다.';
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
        getPost();
        // getComments();
    }, [router.query]);

    if (!post) return;

    return (
        <div className={styles.postPage}>
            <ScheduleList schedules={schedules} />
            <div className={styles.postContainer}>
                <div className={styles.postUtils}>
                    <button onClick={onClickEdit}>
                        <EditIcon className="icon" height="18px" />
                    </button>
                    <button onClick={onClickDelete}>
                        <DeleteIcon className="icon" height="18px" />
                    </button>
                </div>
                <PostViewer post={post} />
                <div className={styles.commentsContainer}>
                    <div className={styles.comments}>
                        {comments.length < 1 ? (
                            <div>아직 댓글이 없습니다.</div>
                        ) : (
                            comments.map(c => (
                                <CommentItem
                                    comment={c}
                                    setComments={setComments}
                                    key={c.cid}
                                />
                            ))
                        )}
                    </div>
                    <div className={styles.newComment}>
                        <textarea
                            value={newComment.content}
                            onChange={e =>
                                setNewComment(prev => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                            placeholder="댓글을 작성해주세요."
                        />
                        <div className={styles.btnContainer}>
                            <button
                                className={styles.save}
                                onClick={addNewComment}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CommentItemProps {
    comment: FullComment;
    setComments: Dispatch<SetStateAction<FullComment[]>>;
}

function CommentItem({ comment, setComments }: CommentItemProps) {
    const { accessToken } = useSessionContext();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>(comment.content);

    const deleteComment = async (
        postId: number,
        commentId: number,
        accessToken: string | null,
    ) => {
        try {
            await deleteCommentAPI(postId, commentId, accessToken);
            setComments(prev => prev.filter(c => c.cid === commentId));
            successToast('댓글을 삭제했습니다.');
        } catch (error) {
            const message = '댓글을 삭제하지 못했습니다.';
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

    const onClickDelete = async () => {
        const { isConfirmed } = await warningModal({
            title: '댓글을 삭제하시겠습니까?',
            text: '삭제된 댓글은 복원할 수 없습니다.',
            confirmButtonText: '삭제',
        });

        if (!isConfirmed) return;
        await deleteComment(comment.post.pid, comment.cid, accessToken);
    };

    const editComment = async (
        postId: number,
        commentId: number,
        accessToken: string | null,
    ) => {
        const newComment: Comment = {
            post: postId,
            content: newContent,
        };

        try {
            const res = await editCommentAPI(
                postId,
                commentId,
                newComment,
                accessToken,
            );

            setComments(prev =>
                prev.map(c => (c.cid === commentId ? res.data : c)),
            );
            successToast('댓글을 수정했습니다.');
        } catch (error) {
            const message = '댓글을 수정하지 못했습니다.';
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

    const onClickEdit = () => {
        if (!newContent) {
            errorToast('댓글을 작성해주세요.');
            return;
        }
        editComment(comment.post.pid, comment.cid, accessToken);
        setIsEditMode(false);
    };

    return isEditMode ? (
        <div>
            <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
            />
            <div className={styles.btnContainer}>
                <button className={styles.save} onClick={onClickEdit}>
                    저장
                </button>
                <button
                    className={styles.cancel}
                    onClick={() => setIsEditMode(false)}
                >
                    취소
                </button>
            </div>
        </div>
    ) : (
        <div className={styles.comment}>
            <div className={styles.commentUtils}>
                <button onClick={() => setIsEditMode(true)}>
                    <EditIcon className="icon" height="18px" />
                </button>
                <button onClick={onClickDelete}>
                    <DeleteIcon className="icon" height="18px" />
                </button>
            </div>
            <div className={styles.content}>{comment.content}</div>
        </div>
    );
}
