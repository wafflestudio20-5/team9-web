import React from 'react';

import styles from './PostViewer.module.scss';

import { FullPost } from '@customTypes/BlogTypes';

export default function PostViewer({ post }: { post: FullPost }) {
    return (
        <div className={styles.post}>
            <h3 className={styles.title}>{post.title}</h3>
            <div className={styles.content}>{post.content}</div>
            {post.image && (
                <div className={styles.image}>
                    <img src={post.image} alt="post_image" width="40px" />
                </div>
            )}
        </div>
    );
}