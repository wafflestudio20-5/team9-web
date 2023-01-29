import React from 'react';

import styles from './PostEditor.module.scss';

import { Post } from '@customTypes/BlogTypes';

interface PostEditorProps {
    initPost: Post;
}

export default function PostEditor({ initPost }: PostEditorProps) {
    return (
        <div className={styles.postEditor}>
            <div className={styles.title}>{initPost.title}</div>
            <div className={styles.content}>{initPost.content}</div>
        </div>
    );
}
