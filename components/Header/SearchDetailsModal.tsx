import React from 'react';

import { MODAL_NAMES } from '../ModalContainer';
import ModalFrame from '../ModalFrame';

import CalendarDropDown from './CalendarDropDown';
import SearchCategoryDropDown from './SearchCategoryDropDown';
import styles from './SearchDetailsModal.module.scss';

interface InputTextLayoutProps {
    id: string;
    label: string;
    placeholder: string;
}

function InputTextLayout({ id, label, placeholder }: InputTextLayoutProps) {
    return (
        <>
            <div>
                <label htmlFor={id}>{label}</label>
                <input type="text" id={id} placeholder={placeholder} />
            </div>
        </>
    );
}

export default function SearchDetailsModal() {
    return (
        <>
            <ModalFrame modalName={MODAL_NAMES.search}>
                <div className={styles.searchDetailsModal}>
                    <form>
                        <div>
                            <label htmlFor="category">다음에서 검색:</label>
                            <div className={styles.category}>
                                <SearchCategoryDropDown />
                            </div>
                        </div>
                        <InputTextLayout
                            id="title"
                            label="제목"
                            placeholder="일정에 포함된 키워드"
                        />
                        <InputTextLayout
                            id="participant"
                            label="참석자"
                            placeholder="참석자 또는 주최자 입력"
                        />
                        <InputTextLayout
                            id="place"
                            label="장소"
                            placeholder="위치 또는 회의실 입력"
                        />
                        <InputTextLayout
                            id="exclude"
                            label="제외할 검색어"
                            placeholder="일정에 포함되지 않은 키워드"
                        />
                        <div>
                            <label htmlFor="category">날짜:</label>
                            <div className={styles.calendar}>
                                <CalendarDropDown title="시작 날짜" />
                            </div>
                            <span className={styles.dash}>-</span>
                            <div className={styles.calendar}>
                                <CalendarDropDown title="종료 날짜" />
                            </div>
                        </div>
                        <div className={styles.btnContainer}>
                            <button className={styles.reset}>재설정</button>
                            <button className={styles.search}>검색</button>
                        </div>
                    </form>
                </div>
            </ModalFrame>
        </>
    );
}
