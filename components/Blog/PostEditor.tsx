import React, { Dispatch, SetStateAction, useState } from 'react';

import styles from './PostEditor.module.scss';

import { Post } from '@customTypes/BlogTypes';

interface PostEditorProps {
    title: string;
    content: string;
    setTitle: Dispatch<SetStateAction<string>>;
    setContent: Dispatch<SetStateAction<string>>;
}

export default function PostEditor({
    title,
    content,
    setTitle,
    setContent,
}: PostEditorProps) {
    const parseLettersOnly = () => {
        // parse letters only using regex
        // parse all letters except between '<' and '>'
        // connect words with a single space
    };

    return (
        <div className={styles.postEditor}>
            <div className={styles.title}>
                <label htmlFor="title"></label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <span className="underline" />
            </div>
            <div className={styles.content}>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
            </div>
        </div>
    );
}
