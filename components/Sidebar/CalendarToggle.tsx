import React, { useState } from 'react';

import styles from './CalendarToggle.module.scss';

import ColoredCheckbox from '@components/ColoredCheckbox';

interface CalendarDataForToggle {
    pk: number;
    name: string;
}

export default function CalendarToggle({ name }: { name: string }) {
    const [isChosen, setIsChosen] = useState(false);
    return (
        <div
            className={styles.wrapper}
            onClick={() => {
                setIsChosen(!isChosen);
            }}
        >
            <ColoredCheckbox
                state={isChosen}
                setState={setIsChosen}
                size={{ size: 18, unit: 'px' }}
                color="#6f50c3"
            />
            <div className={styles.text}>{name}</div>
        </div>
    );
}

export const mapCalendarToggle = (data: CalendarDataForToggle) => {
    return <CalendarToggle key={data.pk} name={data.name} />;
};
