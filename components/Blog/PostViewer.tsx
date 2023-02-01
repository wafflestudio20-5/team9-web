import React from 'react';

import styles from './PostViewer.module.scss';

import { FullPost } from '@customTypes/BlogTypes';

export default function PostViewer({ post }: { post: FullPost }) {
    return (
        <div className={styles.post}>
            <h3 className={styles.title}>
                {/* {post.title} */}
                Lorem ipsum dolor sit amet
            </h3>
            <div className={styles.content}>
                {/* {post.content} */}
                sagittis vehicula, elit tortor eleifend magna, non gravida
                tortor magna in lacus. Duis tristique erat ut arcu feugiat
                auctor. Aliquam erat volutpat. Sed in nisi et mi consequat
                mattis. Nulla volutpat malesuada quam sit amet varius. Curabitur
                at congue nunc. Donec nec accumsan nisl, non dictum velit.
                {!post.image && (
                    <div className={styles.image}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Waffles_with_Strawberries.jpg/1200px-Waffles_with_Strawberries.jpg"
                            alt="post_image"
                            width="100%"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
