import React, { useState } from 'react';

import { MODAL_NAMES } from '../../contexts/ModalContext';
import { useSessionContext } from '../../contexts/SessionContext';
import ModalFrame from '../ModalFrame';

import styles from './RegisterModal.module.scss';

export default function RegisterModal() {
    const { register } = useSessionContext();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword1, setUserPassword1] = useState('');
    const [userPassword2, setUserPassword2] = useState('');
    const [userBirthday, setUserBirthday] = useState('');
    return (
        <ModalFrame modalName={MODAL_NAMES.register}>
            <div className={styles.signUpModal}>
                <form
                    className={styles.signUpContainer}
                    onSubmit={e => {
                        e.preventDefault();
                        register({
                            username: userName,
                            email: userEmail,
                            password1: userPassword1,
                            password2: userPassword2,
                            birthday: userBirthday,
                        });
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
                            type="text"
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
                            type="text"
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
                    <div className={styles.signUpButtonContainer}>
                        <button>회원가입</button>
                    </div>
                </form>
                <div className={styles.socialSignUp}>
                    <div className={styles.textDescription}>
                        다른 회원가입 방법을 찾으시나요?
                    </div>
                    <div className={styles.socialSignUpButtonContainer}>
                        <button className={styles.socialSignUpButton}>
                            소셜 회원가입
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
