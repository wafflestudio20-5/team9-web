import React from 'react';

import styles from './PostViewer.module.scss';

import { FullPost } from '@customTypes/BlogTypes';

export default function PostViewer({ post }: { post: FullPost }) {
    return (
        <div className={styles.post}>
            <h3 className={styles.title}>
                {/* {post.title} */}
                오십자를채워보장일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
            </h3>
            <div className={styles.content}>
                {/* {post.content} */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                posuere fringilla ipsum non egestas. In a urna vel elit pulvinar
                euismod. Donec mollis eros ut tincidunt porta. Duis sagittis
                nisi augue, ut finibus nibh suscipit at. Ut vestibulum vitae
                metus eu iaculis. Quisque rutrum dui at ante efficitur, quis
                maximus ex malesuada. Maecenas egestas ultricies sapien sed
                feugiat. Donec porta sem eu nibh aliquet dapibus. Proin maximus
                odio viverra nunc vulputate viverra. Donec metus urna, imperdiet
                eu sagittis at, dictum eu urna. Vivamus pulvinar, velit et
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
