import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './PostEditor.module.scss';

import ImageIcon from '@images/image_icon.svg';
import { warningModal } from '@utils/customAlert';
import { useScheduleContext } from '@contexts/ScheduleContext';

interface PostEditorProps {
    initTitle: string;
    initContent: string;
    initImage?: string | null;
    submitNewPost(newPost: FormData): Promise<void>;
}

export default function PostEditor({
    initTitle,
    initContent,
    initImage,
    submitNewPost,
}: PostEditorProps) {
    const [title, setTitle] = useState<string>(initTitle);
    const [content, setContent] = useState<string>(initContent);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>(initImage || ''); // image object url
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const { setSchedules, setIsSelectMode } = useScheduleContext();

    // create url for uploaded image file(e.target.files[0]) using `URL.createObjectURL`
    // then you can use that url to show preview
    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]; // real image file
            setImagePreview(URL.createObjectURL(file));
            setImage(file);
            e.currentTarget.value = ''; // need this line to delete and repost the 'same' image
        }
    };

    // delete uploaded image (and its preview)
    const deleteImage = () => {
        URL.revokeObjectURL(imagePreview); // delete image object url
        setImagePreview('');
        setImage(undefined);
    };

    const onClickSubmitPost = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const newPost = new FormData(); // use FormData type
        newPost.append('title', title);
        newPost.append('content', content);
        if (image) newPost.append('image', image);
        else if (!imagePreview) newPost.append('image', ''); // if there's no image when creating the post, or the user wants to delete the image when editing the post
        await submitNewPost(newPost);
        setIsSubmitting(false);
    };

    const onClickCancel = () => {
        const warningContent = {
            title: '작성 중인 글을 삭제하시겠습니까?',
            text: '변경사항이 저장되지 않았습니다.',
            confirmButtonText: '삭제',
        };
        warningModal(warningContent).then(result => {
            if (result.isConfirmed) {
                setSchedules([]);
                setIsSelectMode(false);
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
                    disabled={Boolean(imagePreview)}
                />
                <label htmlFor="image">
                    <ImageIcon className="icon" height="40px" />
                    <span>{Number(Boolean(imagePreview))}/1</span>
                </label>
                {imagePreview && (
                    <div className={styles.preview}>
                        <img src={imagePreview} height={80} />
                        <button onClick={deleteImage}>삭제</button>
                    </div>
                )}
            </div>
            <div className={styles.btnContainer}>
                <button
                    className={styles.save}
                    disabled={isSubmitting}
                    onClick={onClickSubmitPost}
                >
                    저장
                </button>
                <button
                    className={styles.cancel}
                    disabled={isSubmitting}
                    onClick={onClickCancel}
                >
                    취소
                </button>
            </div>
        </div>
    );
}
