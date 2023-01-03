import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import styles from './register.module.scss';

import { useSessionContext } from '@contexts/SessionContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useSessionContext();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword1, setUserPassword1] = useState('');
    const [userPassword2, setUserPassword2] = useState('');
    const [userBirthday, setUserBirthday] = useState('');
    return (
        <div className={styles.registerPage}>
            <form
                className={styles.registerContainer}
                onSubmit={e => {
                    e.preventDefault();
                    register({
                        username: userName,
                        email: userEmail,
                        password1: userPassword1,
                        password2: userPassword2,
                        birthday: userBirthday,
                    });
                    router.push('/');
                }}
            >
                <div className={styles.textContainer}>
                    <div className={styles.textName}>닉네임:</div>
                    <input
                        type="text"
                        className={styles.text}
                        value={userName}
                        onChange={e => {
                            setUserName?.(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textName}>이메일:</div>
                    <input
                        type="email"
                        className={styles.text}
                        value={userEmail}
                        onChange={e => {
                            setUserEmail?.(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textName}>비밀번호:</div>
                    <input
                        type="password"
                        className={styles.text}
                        value={userPassword1}
                        onChange={e => {
                            setUserPassword1?.(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textName}>비밀번호 확인:</div>
                    <input
                        type="password"
                        className={styles.text}
                        value={userPassword2}
                        onChange={e => {
                            setUserPassword2?.(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textName}>생일:</div>
                    <input
                        type="date"
                        className={styles.text}
                        value={userBirthday}
                        onChange={e => {
                            setUserBirthday?.(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.registerButtonContainer}>
                    <button>회원가입</button>
                </div>
            </form>
        </div>
    );
}
