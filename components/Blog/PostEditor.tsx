import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './PostEditor.module.scss';

import ImageIcon from '@images/image_icon.svg';
import { warningModal } from '@utils/customAlert';

interface PostEditorProps {
    initTitle: string;
    initContent: string;
    initImage: string;
    submitNewPost(newPost: FormData): void;
}

export default function PostEditor({
    initTitle,
    initContent,
    submitNewPost,
}: PostEditorProps) {
    const [title, setTitle] = useState<string>(initTitle);
    const [content, setContent] = useState<string>(initContent);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>(''); // image object url
    const router = useRouter();

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setImagePreview(URL.createObjectURL(files[0]));
        setImage(files[0]);
    };

    const deleteImage = () => {
        URL.revokeObjectURL(imagePreview); // delete image object url
        setImagePreview('');
        setImage(undefined);
    };

    const onClickSubmitPost = () => {
        const newPost = new FormData();
        newPost.append('title', title);
        newPost.append('content', content);
        if (image) newPost.append('image', image);
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
                <input
                    type="file"
                    accept="image/*"
                    id="image"
                    onChange={uploadImage}
                    disabled={Boolean(image)}
                />
                <label htmlFor="image">
                    <ImageIcon className="icon" height="40px" />
                    <span>{Number(Boolean(image))}/1</span>
                </label>
                {imagePreview && (
                    <div className={styles.preview}>
                        <img src={imagePreview} width={80} />
                        <button onClick={deleteImage}>삭제</button>
                    </div>
                )}
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
