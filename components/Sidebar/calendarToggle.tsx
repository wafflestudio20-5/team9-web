import React, { useState } from 'react';

import styles from './calendarToggle.module.scss';

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
                color="#1967cd"
            />
            <div className={styles.text}>{name}</div>
        </div>
    );
}

export const mapCalendarToggle = (data: CalendarDataForToggle) => {
    return <CalendarToggle key={data.pk} name={data.name} />;
};
