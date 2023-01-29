import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './Blog.module.scss';

import { getParticularPostAPI } from '@apis/blog';
import { useSessionContext } from '@contexts/SessionContext';
import { FullPost, Post } from '@customTypes/BlogTypes';

type BlogState = 'create' | 'edit' | 'read';

export default function Blog({ postId }: { postId: number }) {
    const { accessToken } = useSessionContext();
    const [post, setPost] = useState<FullPost>();
    const [newPost, setNewPost] = useState<Post>({ title: '', content: '' });
    const [blogState, setBlogState] = useState<BlogState>(
        postId ? 'read' : 'create',
    );
    const router = useRouter();

    const createPost = () => {
        console.log('create post!');
    };

    const editPost = () => {
        console.log('edit post!');
    };

    const deletePost = () => {
        console.log('delete post!');
    };

    const changeBlogState = (newState: BlogState) => {
        switch (newState) {
            case 'create':
                setNewPost({ title: '', content: '' });
                break;
            case 'edit':
                if (newState === 'edit') {
                    if (!post) return;
                    setNewPost({ title: post?.title, content: post?.content });
                }
                break;
            case 'read':
        }
        setBlogState(newState);
    };

    useEffect(() => {
        if (!postId) return;
        (async () => {
            try {
                const res = await getParticularPostAPI(postId, accessToken);
                setPost(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error);
                }
            }
        })();
    }, [postId]);

    return (
        <div className={styles.blog}>
            블로그!
            <div className={styles.post}></div>
            <div className={styles.comments}></div>
        </div>
    );
}

function CommentItem() {}
