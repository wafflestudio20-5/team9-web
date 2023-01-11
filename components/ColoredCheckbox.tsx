import Image from 'next/image';
import React, { ReactNode, useState, useEffect } from 'react';

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
    state,
    setState,
    color,
    size,
    children,
}: CustomCheckboxProps) {
    return (
        <div
            className={styles.backdrop}
            style={{
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
