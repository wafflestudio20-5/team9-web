import ColoredCheckbox from '@components/ColoredCheckbox';
import styles from './calendarToggle.module.scss';
import React, { useState } from 'react';

interface CalendarDataForToggle {
    pk: number;
    name: string;
}

export default function CalendarToggle({ name }: { name: string }) {
    const [isChosen, setIsChosen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <ColoredCheckbox
                state={isChosen}
                setState={setIsChosen}
                size={{ size: 20, unit: 'px' }}
                color="#1967cd"
            />
            <div className={styles.text}>{name}</div>
        </div>
    );
}

export const mapCalendarToggle = (data: CalendarDataForToggle) => {
    return <CalendarToggle key={data.pk} name={data.name} />;
};
