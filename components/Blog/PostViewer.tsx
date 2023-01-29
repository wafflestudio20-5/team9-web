import React from 'react';

import styles from './PostViewer.module.scss';

import { FullPost } from '@customTypes/BlogTypes';

export default function PostViewer({ post }: { post: FullPost }) {
    return (
        <div className={styles.post}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.content}>{post.content}</div>
        </div>
    );
}
