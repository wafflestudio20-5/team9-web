import axios from 'axios';
import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    Dispatch,
    SetStateAction,
} from 'react';

import styles from './ScheduleEditorModal.module.scss';

import {
    CalendarURLParams,
    createScheduleAPI,
    editRecurringScheduleAPI,
    editScheduleAPI,
} from '@apis/calendar';
import MiniCalendarDropDown from '@components/MiniCalendarDropDown';
import ModalFrame from '@components/ModalFrame';
import ProtectionLevelDropDown from '@components/ScheduleModal/ProtectionLevelDropDown';
import RecurrenceDropDown from '@components/ScheduleModal/RecurrenceDropDown';
import TimeDropDown from '@components/ScheduleModal/TimeDropDown';
import { UserSearchDropDown } from '@components/UserSearchDropDown';
import { useCalendarContext } from '@contexts/CalendarContext';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import { useSessionContext } from '@contexts/SessionContext';
import {
    ProtectionLevel,
    Schedule,
    Participant,
    Recurrence,
    FullSchedule,
} from '@customTypes/ScheduleTypes';
import CloseIcon from '@images/close_icon.svg';
import LockIcon from '@images/lock_icon.svg';
import PeopleIcon from '@images/people_icon.svg';
import TextIcon from '@images/text_icon.svg';
import TimeIcon from '@images/time_icon.svg';
import { parseCronExpression } from '@utils/cronExpression';
import {
    errorToast,
    radioRecurringModal,
    successToast,
    warningModal,
} from '@utils/customAlert';
import { formatDate, formatDateWithTime } from '@utils/formatting';

function ErrorMessage({ message }: { message: string }) {
    return <span className={styles.errorMessage}>{message}</span>;
}

interface ScheduleEditorModalProps {
    initSchedule: Schedule;
    taskType: 'create' | 'edit';
}

export default function ScheduleEditorModal({
    initSchedule,
    taskType,
}: ScheduleEditorModalProps) {
    const { openModal, closeModal } = useModal();
    const { user, accessToken } = useSessionContext();
    const { setNeedUpdate } = useCalendarContext();
    const titleRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(initSchedule.title);
    const [startDate, setStartDate] = useState<Date>(
        new Date(initSchedule.start_at),
    );
    const [endDate, setEndDate] = useState<Date>(new Date(initSchedule.end_at));
    const [recurrence, setRecurrence] = useState<Recurrence>({
        isRecurring: initSchedule.is_recurring,
        cronExpr: initSchedule.cron_expr,
        endDate: initSchedule.recurring_end_at,
    });
    const [protectionLevel, setProtectionLevel] = useState<ProtectionLevel>(
        initSchedule.protection_level,
    );
    const [hideDetails, setHideDetails] = useState<boolean>(
        !initSchedule.show_content,
    );
    const [description, setDescription] = useState<string>(
        initSchedule.description ?? '',
    );
    const [participants, setParticipants] = useState<{ pk: number }[]>(
        initSchedule.participants,
    );
    const [dateValidity, setDateValidity] = useState({
        isValid: true,
        message: '',
    });
    const isHideDisabled = useMemo(
        () => protectionLevel === ProtectionLevel.private,
        [protectionLevel],
    );

    const validateDate = (isValid: boolean, msg: string) => {
        if (isValid) {
            setDateValidity({ isValid: true, message: '' });
            return true;
        } else {
            setDateValidity({ isValid: false, message: msg });
            return false;
        }
    };

    const changeStartDate = (newDate: Date) => {
        const msg = '?????? ????????? ?????? ?????? ??????????????? ?????????.';
        validateDate(newDate <= endDate, msg);
        setStartDate(newDate);
    };

    const changeEndDate = (newDate: Date) => {
        const msg = '?????? ????????? ?????? ?????? ???????????? ?????????.';
        validateDate(newDate >= startDate, msg);
        setEndDate(newDate);
    };

    const updateParticipants = (participants: Participant[]) => {
        const pkList: { pk: number }[] = [];
        participants.forEach(p => pkList.push({ pk: p.pk }));
        setParticipants(pkList);
    };

    const createSchedule = async (
        newSchedule: Schedule,
        accessToken: string | null,
    ) => {
        if (!user) {
            errorToast('???????????? ?????? ????????????.');
            return false;
        }

        const urlParams: CalendarURLParams = {
            pk: user.pk,
            from: formatDate(startDate),
            to: formatDate(endDate),
        };

        try {
            await createScheduleAPI(newSchedule, urlParams, accessToken);
            successToast('????????? ?????????????????????.');
            return true;
        } catch (error) {
            const message = '????????? ???????????? ???????????????.';
            if (axios.isAxiosError(error)) {
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const editSchdule = async (
        id: number, // scheduleId or groupId
        newSchedule: Schedule,
        accessToken: string | null,
        editRecurring: boolean,
    ) => {
        try {
            let newData;
            if (editRecurring) {
                const res = await editRecurringScheduleAPI(
                    id,
                    {
                        ...newSchedule,
                        cron_expr: undefined,
                        recurring_end_at: undefined,
                    },
                    accessToken,
                );
                newData = res.data.schedules.find(
                    (s: FullSchedule) => s.id === newSchedule.id,
                );
            } else {
                const res = await editScheduleAPI(id, newSchedule, accessToken);
                newData = res.data;
            }
            successToast('????????? ?????????????????????.');
            openModal(MODAL_NAMES.scheduleView, { schedule: newData });
            return true;
        } catch (error) {
            const message = '????????? ???????????? ???????????????.';
            if (axios.isAxiosError(error)) {
                const errObj: { [key: string]: string } =
                    error.response?.data ?? {};
                let errMsg = '';
                for (const k in errObj) errMsg += `${k}: ${errObj[k]}\n\n`;
                errorToast(errMsg.trim() || message);
            } else {
                errorToast(message);
            }
            return false;
        }
    };

    const validateScheduleForm = () => {
        if (!title) {
            errorToast('????????? ???????????????.');
            titleRef.current?.focus();
            return false;
        } else if (!dateValidity.isValid) {
            errorToast(dateValidity.message);
            return false;
        }
        return true;
    };

    const submitScheduleForm = async () => {
        const isValid = validateScheduleForm();
        if (!isValid) return;

        const newSchedule: Schedule = {
            id: initSchedule.id,
            title: title,
            start_at: formatDateWithTime(startDate),
            end_at: formatDateWithTime(endDate),
            description: description || null,
            protection_level: protectionLevel,
            show_content: !hideDetails,
            participants: participants,
            is_recurring: recurrence.isRecurring,
            cron_expr: recurrence.cronExpr,
            recurring_end_at: recurrence.endDate,
        };

        let isSuccessful = false;
        switch (taskType) {
            case 'create':
                isSuccessful = await createSchedule(newSchedule, accessToken);
                break;
            case 'edit':
                if (!initSchedule.id) return;

                if (initSchedule.is_recurring) {
                    if (!initSchedule.recurring_schedule_group) return;
                    const { value, isConfirmed } = await radioRecurringModal(
                        '??????',
                    );
                    if (!isConfirmed) return;

                    if (value === 'all') {
                        isSuccessful = await editSchdule(
                            initSchedule.recurring_schedule_group,
                            newSchedule,
                            accessToken,
                            true,
                        );
                    } else {
                        isSuccessful = await editSchdule(
                            initSchedule.id,
                            newSchedule,
                            accessToken,
                            false,
                        );
                    }
                } else {
                    isSuccessful = await editSchdule(
                        initSchedule.id,
                        newSchedule,
                        accessToken,
                        false,
                    );
                }
                break;
        }

        if (isSuccessful) {
            closeModal(MODAL_NAMES.scheduleEditor);
            if (setNeedUpdate) {
                setNeedUpdate(true);
            }
        }
    };

    const detectChange = () => {
        return (
            title !== initSchedule.title ||
            startDate.toString() !==
                new Date(initSchedule.start_at).toString() ||
            endDate.toString() !== new Date(initSchedule.end_at).toString() ||
            description !== initSchedule.description ||
            protectionLevel !== initSchedule.protection_level ||
            hideDetails !== !initSchedule.show_content ||
            JSON.stringify(participants) !==
                JSON.stringify(initSchedule.participants)
        );
    };

    const cancelScheduleForm = () => {
        const isChanged = detectChange();
        if (isChanged) {
            const warningContent = {
                title: '?????? ?????? ????????? ?????????????????????????',
                text: '??????????????? ???????????? ???????????????.',
                confirmButtonText: '??????',
            };
            warningModal(warningContent).then(result => {
                if (result.isConfirmed) {
                    closeModal(MODAL_NAMES.scheduleEditor);
                }
            });
        } else {
            closeModal(MODAL_NAMES.scheduleEditor);
        }
    };

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    return (
        <ModalFrame
            modalName={MODAL_NAMES.scheduleEditor}
            onClickBackDrop={cancelScheduleForm}
        >
            <div className={styles.scheduleEditorModal}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={cancelScheduleForm}
                    >
                        <CloseIcon height="18px" />
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.scheduleForm}>
                        <div className={styles.title}>
                            <input
                                type="text"
                                value={title}
                                id="title"
                                onChange={e => setTitle(e.target.value)}
                                placeholder="?????? ??????"
                                ref={titleRef}
                            />
                            <span className={styles.underline} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.dateTime}>
                                <label>
                                    <TimeIcon className="icon" height="24px" />
                                </label>
                                <div>
                                    <div className={styles.dateTimeContent}>
                                        <div
                                            className={
                                                styles.timeInputContainer
                                            }
                                        >
                                            <MiniCalendarDropDown
                                                title="?????? ??????"
                                                date={startDate}
                                                changeDate={changeStartDate}
                                            />
                                            <TimeDropDown
                                                title="?????? ??????"
                                                time={startDate}
                                                changeTime={changeStartDate}
                                            />
                                            <span className={styles.dash}>
                                                -
                                            </span>
                                            <MiniCalendarDropDown
                                                title="?????? ??????"
                                                date={endDate}
                                                changeDate={changeEndDate}
                                            />
                                            <TimeDropDown
                                                title="?????? ??????"
                                                time={endDate}
                                                changeTime={changeEndDate}
                                            />
                                        </div>
                                        {!dateValidity.isValid && (
                                            <ErrorMessage
                                                message={dateValidity.message}
                                            />
                                        )}
                                    </div>
                                    {taskType === 'create' ? (
                                        <RecurrenceDropDown
                                            date={startDate}
                                            recurrence={recurrence}
                                            setRecurrence={setRecurrence}
                                        />
                                    ) : (
                                        // can't edit recurring rule
                                        initSchedule.is_recurring && (
                                            <div
                                                className={
                                                    styles.recurrenceText
                                                }
                                            >
                                                {initSchedule.cron_expr &&
                                                    parseCronExpression(
                                                        initSchedule.cron_expr,
                                                    )}{' '}
                                                (?????????:{' '}
                                                {initSchedule.recurring_end_at &&
                                                    initSchedule.recurring_end_at.split(
                                                        ' ',
                                                    )[0]}
                                                )
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className={styles.participants}>
                                <label>
                                    <PeopleIcon
                                        className="icon"
                                        height="24px"
                                    />
                                </label>
                                <UserSearchDropDown
                                    toExecute={item => null}
                                    interceptResult={updateParticipants}
                                    buttonText="??????"
                                    width="400px"
                                    submitButtonNotRequired={true}
                                    placeholder="????????? ??????"
                                />
                            </div>
                            <div className={styles.public}>
                                <label>
                                    <LockIcon className="icon" height="24px" />
                                </label>
                                <div>
                                    <ProtectionLevelDropDown
                                        protectionLevel={protectionLevel}
                                        setProtectionLevel={setProtectionLevel}
                                    />
                                    <div className={styles.hideDetails}>
                                        <input
                                            type="checkbox"
                                            id="hideDetails"
                                            checked={
                                                hideDetails || isHideDisabled
                                            }
                                            onChange={e =>
                                                setHideDetails(e.target.checked)
                                            }
                                            disabled={isHideDisabled}
                                        />
                                        <label htmlFor="hideDetails">
                                            ?????? ?????? ?????????
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.description}>
                                <label>
                                    <TextIcon className="icon" height="24px" />
                                </label>
                                <textarea
                                    cols={57}
                                    rows={5}
                                    value={description}
                                    onChange={e =>
                                        setDescription(e.target.value || '')
                                    }
                                    placeholder="????????? ?????? ????????? ????????? ???????????????."
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button
                            className={styles.save}
                            onClick={submitScheduleForm}
                        >
                            ??????
                        </button>
                    </div>
                </div>
            </div>
        </ModalFrame>
    );
}
