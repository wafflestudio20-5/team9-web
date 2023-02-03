import React, { useState } from 'react';

import styles from './settings.module.scss';

import { useSessionContext } from '@contexts/SessionContext';
import { useThemeContext } from '@contexts/ThemeContext';
import CameraIcon from '@images/camera_icon.svg';
import { patchProfileAPI, getProfileAPI } from '@apis/profile';

const settings = { 일반: ['테마', '기타'] };

export default function SettingsPage() {
    const { user, accessToken } = useSessionContext();

    if (!user) return null;

    const [birthdate, setBirthDate] = useState<string>(user.birthdate);
    const [username, setUsername] = useState<string>(user.username);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>(user.image || ""); // image object url
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    const onClickSubmitProfile = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const newProfile = new FormData(); // use FormData type
        newProfile.append('username', username);
        newProfile.append('birthdate', birthdate);
        if (image) newProfile.append('image', image);
        else if (!imagePreview) newProfile.append('image', ''); // if there's no image when creating the post, or the user wants to delete the image when editing the post
        console.log(newProfile);
        await patchProfileAPI(newProfile, accessToken);
        setIsSubmitting(false);
    };

    const { setTheme } = useThemeContext();

    return (
        <div className={styles.container}>
            <div className={styles.userModal}>
                <div className={styles.userInfo}>
                    <div className={styles.photo}>
                        <label htmlFor="image">
                            <div className={styles.addPhoto}>
                                <CameraIcon height="20px" className="icon"/>
                            </div>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            onChange={uploadImage}
                            disabled={Boolean(imagePreview)}
                        />
                        {imagePreview && (
                            <img src={imagePreview}/>
                        )}
                    </div>
                    {imagePreview && (
                    <button onClick={deleteImage} type="button">이미지 삭제</button>
                    )}
                    <div className={styles.basic}>
                        <span className={styles.name}>{user?.username}</span>
                        <span className={styles.id}>{user?.email}</span>
                    </div>
                </div>
                <button disabled={isSubmitting}
                    onClick={onClickSubmitProfile}>저장</button>
            </div>
            <div className={styles.main}>
                <div className={styles.settingBlock}>
                    <div className={styles.title}>테마</div>
                    <button onClick={() => setTheme('light')}>light</button>
                    <button onClick={() => setTheme('dark')}>dark</button>
                </div>
            </div>
        </div>
    );
}
