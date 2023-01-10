import Image from 'next/image';
import expand_icon from '@images/expand_icon.svg';
import collapse_icon from '@images/collapse_icon.svg';
import add_icon from '@images/add_icon.svg';
import React, { useState } from 'react';
import styles from './Accordion.module.scss';

interface AccordionProps {
    addAble: boolean;
    title: string;
    sequence: any[];
    mapFunction: (value: any, index: number, array: any[]) => React.ReactNode;
}

export function Accordion({
    addAble,
    title,
    sequence,
    mapFunction,
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span>{title}</span>
                {addAble && (
                    <button>
                        <Image src={add_icon} alt="add" />
                    </button>
                )}
                <button onClick={() => setIsOpen(!isOpen)}>
                    <Image
                        src={isOpen ? collapse_icon : expand_icon}
                        alt="toggle"
                    />
                </button>
            </div>
            <div
                className={
                    isOpen
                        ? `${styles.body} ${styles.open}`
                        : `${styles.body} ${styles.closed}`
                }
            >
                {sequence.map(mapFunction)}
            </div>
        </div>
    );
}
