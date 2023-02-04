import React, { Dispatch, FormEvent, useState, SetStateAction } from 'react';

import styles from './SearchDetailsModal.module.scss';

import SearchCategoryDropDown from '@components/Header/SearchCategoryDropDown';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES } from '@contexts/ModalContext';
import { errorToast } from '@utils/customAlert';

interface InputTextLayoutProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}

function InputTextLayout({
    id,
    label,
    placeholder,
    value,
    setValue,
}: InputTextLayoutProps) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <span className="underline" />
            </div>
        </div>
    );
}

export default function SearchDetailsModal() {
    const [title, setTitle] = useState<string>('');
    const [participants, setParticipants] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [excludeQuery, setExcludeQuery] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const changeStartDate = (newDate: Date) => {
        setStartDate(newDate);
    };

    const changeEndDate = (newDate: Date) => {
        setEndDate(newDate);
    };

    const searchSchedule = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        errorToast('안타깝게도 장식이에요.');
    };

    const resetAllOptions = () => {
        setTitle('');
        setParticipants('');
        setPlace('');
        setExcludeQuery('');
    };

    return (
        <ModalFrame modalName={MODAL_NAMES.searchDetails}>
            <div className={styles.searchDetailsModal}>
                <form onSubmit={searchSchedule}>
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
                        value={title}
                        setValue={setTitle}
                    />
                    <InputTextLayout
                        id="participant"
                        label="참석자"
                        placeholder="참석자 또는 주최자 입력"
                        value={participants}
                        setValue={setParticipants}
                    />
                    <InputTextLayout
                        id="place"
                        label="장소"
                        placeholder="위치 또는 회의실 입력"
                        value={place}
                        setValue={setPlace}
                    />
                    <InputTextLayout
                        id="exclude"
                        label="제외할 검색어"
                        placeholder="일정에 포함되지 않은 키워드"
                        value={excludeQuery}
                        setValue={setExcludeQuery}
                    />
                    <div>
                        <label htmlFor="category">날짜:</label>
                        <div className={styles.calendar}>
                            <MiniCalendarDropDown
                                title="시작 날짜"
                                date={startDate}
                                changeDate={changeStartDate}
                            />
                        </div>
                        <span className={styles.dash}>-</span>
                        <div className={styles.calendar}>
                            <MiniCalendarDropDown
                                title="종료 날짜"
                                date={endDate}
                                changeDate={changeEndDate}
                            />
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button
                            type="button"
                            className={styles.reset}
                            onClick={resetAllOptions}
                        >
                            재설정
                        </button>
                        <button className={styles.search}>검색</button>
                    </div>
                </form>
            </div>
        </ModalFrame>
    );
}
