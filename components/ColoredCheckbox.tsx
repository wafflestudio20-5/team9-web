import Image from 'next/image';
import React, { ReactNode } from 'react';

import styles from './ColoredCheckbox.module.scss';

import white_check_icon from '@images/white_check_icon.svg';

interface CustomCheckboxProps {
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    color: string;
    size: { size: number; unit: string };
    children?: ReactNode;
}

function DefaultChild() {
    return <Image src={white_check_icon} alt="O" className={styles.check} />;
}

export default function ColoredCheckbox({
    state, // state to be affected by checkbox toggle
    setState, // setstateaction for changing the state
    color, // color of the border & background when checked
    size, // size of the check'box'. diff from the size of the ColoredCheckbox component (the latter includes shadows)
    children, // optional parameter for element to show inside toggle. If not provided, use default check icon
}: CustomCheckboxProps) {
    return (
        <div
            className={styles.backdrop}
            style={{
                // shadow element that's slightly larger than the size of the actual box
                height: `${size.size * 1.7}${size.unit}`,
                width: `${size.size * 1.7}${size.unit}`,
            }}
        >
            <div
                onClick={() => setState(!state)}
                className={
                    state
                        ? `${styles.box} ${styles.checked}`
                        : `${styles.box} ${styles.default}`
                }
                style={{
                    height: `${size.size}${size.unit}`,
                    width: `${size.size}${size.unit}`,
                    borderColor: color,
                    backgroundColor: state ? color : 'white',
                }}
            >
                {children ? children : <DefaultChild />}
            </div>
        </div>
    );
}
