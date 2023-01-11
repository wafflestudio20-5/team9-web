import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';

import styles from './Accordion.module.scss';

import add_icon from '@images/add_icon.svg';
import collapse_icon from '@images/collapse_icon.svg';
import expand_icon from '@images/expand_icon.svg';

interface AccordionProps {
    addAble?: boolean;
    title: string;
    sequence: any[];
    mapFunction: (value: any, index: number, array: any[]) => React.ReactNode;
    style?: { wrapper?: React.CSSProperties; title?: React.CSSProperties };
}

export function Accordion({
    addAble,
    title,
    sequence,
    mapFunction,
    style,
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const bodyHolderRef = useRef<HTMLDivElement | null>(null);
    const openAccordion = () => {
        setIsOpen(true);
    };
    const closeAccordion = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 500);
    };
    const getClassname = () => {
        if (isClosing) {
            return `${styles.body} ${styles.closing}`;
        }
        if (isOpen) {
            return `${styles.body} ${styles.open}`;
        }
        return `${styles.body}`;
    };

    return (
        <div className={styles.wrapper} style={style?.wrapper}>
            <div
                className={styles.header}
                onClick={isOpen ? closeAccordion : openAccordion}
            >
                <span style={style?.title}>{title}</span>
                {addAble && (
                    <button>
                        <Image src={add_icon} alt="add" />
                    </button>
                )}
                <button onClick={isOpen ? closeAccordion : openAccordion}>
                    <Image
                        src={isOpen ? collapse_icon : expand_icon}
                        alt="toggle"
                    />
                </button>
            </div>
            {
                <div
                    className={getClassname()}
                    style={{
                        height: isOpen ? 'auto' : 0,
                    }}
                >
                    <div className={styles.holder} ref={bodyHolderRef}>
                        {sequence.map(mapFunction)}
                    </div>
                </div>
            }
        </div>
    );
}
