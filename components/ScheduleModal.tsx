import Image from 'next/image';
import React from 'react';

import styles from './ScheduleModal.module.scss';

import ModalFrame from '@components/ModalFrame';
import { MODAL_NAMES, useModal } from '@contexts/ModalContext';
import close_icon from '@images/close_icon.svg';
import delete_icon from '@images/delete_icon.svg';
import edit_icon from '@images/edit_icon.svg';

export default function ScheduleModal() {
    const { closeModal } = useModal();

    return (
        <ModalFrame modalName={MODAL_NAMES.schedule}>
            <div className={styles.scheduleModal}>
                <div className={styles.header}>
                    <button className={styles.edit}>
                        <Image src={edit_icon} width={18} alt="edit_schedule" />
                    </button>
                    <button className={styles.delete}>
                        <Image
                            src={delete_icon}
                            width={18}
                            alt="delete_schedule"
                        />
                    </button>
                    <button
                        className={styles.close}
                        onClick={() => closeModal(MODAL_NAMES.schedule)}
                    >
                        <Image
                            src={close_icon}
                            width={18}
                            alt="close_schedule_modal"
                        />
                    </button>
                </div>
            </div>
        </ModalFrame>
    );
}
