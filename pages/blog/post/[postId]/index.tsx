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

export default function PostPage() {
    const { accessToken } = useSessionContext();
    const [schedules, setSchedules] = useState<FullSchedule[]>([]);
    const [post, setPost] = useState<FullPost>();
    const [comments, setComments] = useState<FullComment[]>([]);
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

    const createComment = async () => {
        if (!newComment.content) {
            errorToast('댓글을 작성해주세요.');
            return;
        }

        if (!post) return;

        try {
            const res = await createCommentAPI(postId, newComment, accessToken);
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
            setSchedules(res.data.schedules || []);
            setNewComment(prev => ({ ...prev, post: res.data.pid }));
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
        getComments();
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
                                onClick={createComment}
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

    const editComment = async (
        postId: number,
        commentId: number,
        accessToken: string | null,
    ) => {
        const newComment: Comment = {
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
        editComment(comment.post, comment.cid, accessToken);
        setIsEditMode(false);
    };

    const deleteComment = async (
        postId: number,
        commentId: number,
        accessToken: string | null,
    ) => {
        try {
            await deleteCommentAPI(postId, commentId, accessToken);
            setComments(prev => prev.filter(c => c.cid !== commentId));
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
        await deleteComment(comment.post, comment.cid, accessToken);
    };

    const onClickCancel = () => {
        setNewContent(comment.content);
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
                <button className={styles.cancel} onClick={onClickCancel}>
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
