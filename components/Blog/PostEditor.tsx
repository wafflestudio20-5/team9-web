import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './PostEditor.module.scss';

import { Post } from '@customTypes/BlogTypes';
import ImageIcon from '@images/image_icon.svg';
import { warningModal } from '@utils/customAlert';

interface PostEditorProps {
    initTitle: string;
    initContent: string;
    submitNewPost(newPost: Post): void;
}

export default function PostEditor({
    initTitle,
    initContent,
    submitNewPost,
}: PostEditorProps) {
    const [title, setTitle] = useState<string>(initTitle);
    const [content, setContent] = useState<string>(initContent);
    const router = useRouter();

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
    };

    const onClickSubmitPost = () => {
        const newPost: Post = {
            title,
            content,
        };
        submitNewPost(newPost);
    };

    const onClickCancel = () => {
        const warningContent = {
            title: '작성 중인 글을 삭제하시겠습니까?',
            text: '변경사항이 저장되지 않았습니다.',
            confirmButtonText: '삭제',
        };
        warningModal(warningContent).then(result => {
            if (result.isConfirmed) {
                router.back();
            }
        });
    };

    return (
        <div className={styles.postEditor}>
            <div className={styles.title}>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="제목"
                />
                <span className="underline" />
            </div>
            <div className={styles.content}>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="내용을 작성해주세요."
                />
            </div>
            <div className={styles.images}>
                <label htmlFor="image">
                    <ImageIcon className="icon" height="24px" />
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="image"
                    onChange={uploadImage}
                />
            </div>
            <div className={styles.btnContainer}>
                <button className={styles.save} onClick={onClickSubmitPost}>
                    저장
                </button>
                <button className={styles.cancel} onClick={onClickCancel}>
                    취소
                </button>
            </div>
        </div>
    );
}
