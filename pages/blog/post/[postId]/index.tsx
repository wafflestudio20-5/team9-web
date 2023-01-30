import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './index.module.scss';

import {
    createCommentAPI,
    deleteCommentAPI,
    deletePostAPI,
    editCommentAPI,
    getRelatedSchedulesAPI,
} from '@apis/blog';
import ScheduleList from '@components/Blog/ScheduleList';
import { useSessionContext } from '@contexts/SessionContext';
import { Comment, FullComment, FullPost } from '@customTypes/BlogTypes';
import { FullSchedule } from '@customTypes/ScheduleTypes';
import DeleteIcon from '@images/delete_icon.svg';
import EditIcon from '@images/edit_icon.svg';
import { errorToast, successToast, warningModal } from '@utils/customAlert';

export default function PostPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const [post, setPost] = useState<FullPost>({
        title: 'test post',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec libero iaculis, vehicula erat vel, placerat tellus. Morbi porta tristique erat, non vestibulum lectus.',
        id: 1,
        created_at: '2023-01-23',
        updated_at: '2023-01-29',
        created_by: 7,
    });
    const [comments, setComments] = useState<FullComment[]>([]);
    const [newComment, setNewComment] = useState<Comment>({
        post: post.id,
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

        try {
            await createCommentAPI(post.id, newComment, accessToken);
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

    useEffect(() => {
        async () => {
            try {
                const res = await getRelatedSchedulesAPI(postId, accessToken);
                setSchedules(res.data); // temp
            } catch (error) {
                const message = '연관된 일정을 가져오지 못했습니다.';
                if (axios.isAxiosError(error)) {
                    errorToast(error.response?.data.message || message);
                } else {
                    errorToast(message);
                }
            }
        };
    }, [router.query]);

    return (
        <div className={styles.postPage}>
            <div className={styles.left}>
                <ScheduleList schedules={schedules} />
            </div>
            <div className={styles.right}>
                <div className={styles.postContainer}>
                    <div className={styles.util}>
                        <button onClick={onClickEdit}>
                            <EditIcon className="icon" height="18px" />
                        </button>
                        <button onClick={onClickDelete}>
                            <DeleteIcon className="icon" height="18px" />
                        </button>
                    </div>
                    <div className={styles.post}>post</div>
                </div>
                <div className={styles.commentsContainer}>
                    <div className={styles.comments}>
                        {comments.map(c => (
                            <CommentItem comment={c} key={c.id} />
                        ))}
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
                        />
                        <button onClick={addNewComment}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommentItem({ comment }: { comment: FullComment }) {
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
        await deleteComment(comment.post.id, comment.id, accessToken);
    };

    const editComment = async () => {
        const newComment: Comment = {
            post: comment.post.id,
            content: newContent,
        };

        try {
            await editCommentAPI(
                comment.post.id,
                comment.id,
                newComment,
                accessToken,
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

    return (
        <div className={styles.comment}>
            {isEditMode ? (
                <div className="d">
                    <textarea
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                    />
                </div>
            ) : (
                <div className={styles.util}>
                    <button onClick={() => setIsEditMode(true)}>
                        <EditIcon className="icon" height="18px" />
                    </button>
                    <button onClick={onClickDelete}>
                        <DeleteIcon className="icon" height="18px" />
                    </button>
                </div>
            )}
        </div>
    );
}
